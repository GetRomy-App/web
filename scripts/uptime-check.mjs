#!/usr/bin/env node
// Uptime probe runner for the Rōmy status page.
//
// Reads data/status/services.json, probes every service, and folds the result
// into data/status/history.json:
//   - lastCheck : the most recent probe
//   - recent    : a rolling window of raw samples (for the live view + sparkline)
//   - daily     : per-UTC-day aggregates, retained for 90 days (for the timeline)
//
// A plain GET only proves the page answers — the product can be broken while
// the homepage still returns 200. So services may also declare a `healthUrl`
// pointing at a deep-health endpoint (contract: data/status/README.md) that
// reports each dependency (database, cache, AI gateway, billing, email…).
// When present:
//   - each dependency check is recorded as its own history series under the
//     key "<serviceId>:<checkKey>" (e.g. "app:database"),
//   - a reported status of "down" marks the service down even if its page
//     still loads, and "degraded" is folded into the sample as `h`,
//   - application error-rate telemetry (`errors.count` / `errors.threshold`)
//     is captured as `err`/`errT` so the alerter can page on spikes,
//   - an unreachable health endpoint records `h: "unreachable"` — visible on
//     the page as "surface checks only", and alertable as a regression.
//
// Runs in CI on a cron schedule (see .github/workflows/uptime.yml) and is safe
// to run locally: `node scripts/uptime-check.mjs`. Set STATUS_DATA_DIR to
// probe into a scratch copy of the data directory (used by the smoke tests).
// No dependencies — just Node 18+.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = process.env.STATUS_DATA_DIR || join(ROOT, 'data', 'status');
const SERVICES_PATH = join(DATA_DIR, 'services.json');
const HISTORY_PATH = join(DATA_DIR, 'history.json');

const SCHEMA_VERSION = 2;
const RECENT_CAP = 240; // ~40h at a 10-minute cadence
const COMPONENT_RECENT_CAP = 60; // ~10h — enough for live state + short spark
const MAX_COMPONENTS = 24; // guardrail against a runaway health payload
const MAX_HEALTH_BYTES = 256 * 1024;
const RETENTION_DAYS = 90;
const DAY_MS = 24 * 60 * 60 * 1000;
const USER_AGENT = 'Romy-StatusBot/1.0 (+https://getromy.app/status)';

const utcDayKey = (ms) => new Date(ms).toISOString().slice(0, 10);

async function readJson(path, fallback) {
	try {
		return JSON.parse(await readFile(path, 'utf-8'));
	} catch {
		return fallback;
	}
}

/** Probe a single URL. Resolves to a sample; never rejects. */
async function probe(url, timeoutMs) {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), timeoutMs);
	const started = Date.now();
	try {
		const res = await fetch(url, {
			method: 'GET',
			redirect: 'follow',
			signal: controller.signal,
			headers: { 'User-Agent': USER_AGENT, Accept: '*/*' }
		});
		// Drain the body so the connection can close cleanly.
		await res.arrayBuffer().catch(() => {});
		const ms = Date.now() - started;
		const ok = res.status >= 200 && res.status < 400;
		return {
			t: started,
			ok,
			status: res.status,
			ms,
			error: ok ? null : `HTTP ${res.status}`
		};
	} catch (err) {
		const ms = Date.now() - started;
		const aborted = err && (err.name === 'AbortError' || controller.signal.aborted);
		return {
			t: started,
			ok: false,
			status: 0,
			ms,
			error: aborted ? 'timeout' : (err && err.message) || 'network error'
		};
	} finally {
		clearTimeout(timer);
	}
}

const HEALTH_STATUSES = new Set(['ok', 'degraded', 'down']);
const CHECK_KEY_RE = /^[a-z0-9][a-z0-9_-]{0,31}$/i;

/** Validate a parsed health payload against the contract. Returns null if it doesn't conform. */
function parseHealthDoc(raw) {
	if (!raw || typeof raw !== 'object' || !HEALTH_STATUSES.has(raw.status)) return null;

	const checks = {};
	if (raw.checks && typeof raw.checks === 'object' && !Array.isArray(raw.checks)) {
		for (const [key, value] of Object.entries(raw.checks)) {
			if (!CHECK_KEY_RE.test(key) || !value || typeof value !== 'object') continue;
			if (typeof value.ok !== 'boolean') continue;
			checks[key] = {
				ok: value.ok,
				ms: Number.isFinite(value.ms) && value.ms >= 0 ? Math.round(value.ms) : null,
				degraded: value.degraded === true,
				note: typeof value.note === 'string' ? value.note.slice(0, 140) : null
			};
			if (Object.keys(checks).length >= MAX_COMPONENTS) break;
		}
	}

	let errors = null;
	if (raw.errors && typeof raw.errors === 'object') {
		const count = raw.errors.count;
		const threshold = raw.errors.threshold;
		if (Number.isFinite(count) && count >= 0) {
			errors = {
				count: Math.round(count),
				threshold: Number.isFinite(threshold) && threshold > 0 ? Math.round(threshold) : null
			};
		}
	}

	return { status: raw.status, checks, errors };
}

/**
 * Fetch and parse a deep-health endpoint. The body is authoritative even on a
 * non-2xx response — the contract serves HTTP 503 alongside `status: "down"`.
 */
async function fetchHealth(url, timeoutMs) {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), timeoutMs);
	const started = Date.now();
	try {
		const res = await fetch(url, {
			method: 'GET',
			redirect: 'follow',
			signal: controller.signal,
			headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' }
		});
		const text = await res.text();
		const ms = Date.now() - started;
		if (text.length > MAX_HEALTH_BYTES) return { doc: null, ms, error: 'oversized payload' };
		let doc = null;
		try {
			doc = parseHealthDoc(JSON.parse(text));
		} catch {
			doc = null;
		}
		if (!doc) return { doc: null, ms, error: `no health payload (HTTP ${res.status})` };
		return { doc, ms, error: null };
	} catch (err) {
		const ms = Date.now() - started;
		const aborted = err && (err.name === 'AbortError' || controller.signal.aborted);
		return { doc: null, ms, error: aborted ? 'timeout' : (err && err.message) || 'network error' };
	} finally {
		clearTimeout(timer);
	}
}

function pruneDaily(daily, nowMs) {
	const oldestAllowed = utcDayKey(nowMs - (RETENTION_DAYS - 1) * DAY_MS);
	const next = {};
	for (const [key, bucket] of Object.entries(daily)) {
		if (key >= oldestAllowed) next[key] = bucket;
	}
	return next;
}

/**
 * Fold one sample into a service/component history. `slow` marks the sample as
 * degraded-but-answering in the daily aggregates (latency breach for services,
 * a reported degraded flag for dependency checks).
 */
function foldSample(prevHistory, sample, { nowMs, cap, slow }) {
	const history = prevHistory ?? { lastCheck: null, recent: [], daily: {} };
	const recent = Array.isArray(history.recent) ? history.recent : [];
	recent.push(sample);
	while (recent.length > cap) recent.shift();

	const daily = pruneDaily(history.daily ?? {}, nowMs);
	const dayKey = utcDayKey(nowMs);
	const bucket = daily[dayKey] ?? { up: 0, total: 0, degraded: 0, sumMs: 0 };
	bucket.total += 1;
	if (sample.ok) {
		bucket.up += 1;
		bucket.sumMs += sample.ms;
		if (slow) bucket.degraded += 1;
	}
	daily[dayKey] = bucket;

	return { lastCheck: sample, recent, daily };
}

async function main() {
	const config = await readJson(SERVICES_PATH, null);
	if (!config || !Array.isArray(config.services)) {
		console.error(`No services configured at ${SERVICES_PATH}`);
		process.exit(1);
	}

	const timeoutMs = config.timeoutMs ?? 15000;
	const threshold = config.degradedThresholdMs ?? 2500;
	const now = Date.now();

	const prev = await readJson(HISTORY_PATH, { services: {} });
	const prevServices = prev.services ?? {};

	const services = {};
	let downNow = 0;

	for (const svc of config.services) {
		const surface = await probe(svc.url, timeoutMs);
		const health = svc.healthUrl ? await fetchHealth(svc.healthUrl, timeoutMs) : null;

		// The parent sample keeps the page's own HTTP status and latency, then
		// layers the deep-health verdict on top: a reported "down" fails the
		// sample even though the page answered — that is the whole point.
		const sample = { ...surface };
		if (health) {
			if (health.doc) {
				sample.h = health.doc.status;
				if (health.doc.status === 'down' && sample.ok) {
					sample.ok = false;
					sample.error = 'health: reported down';
				}
				if (health.doc.errors) {
					sample.err = health.doc.errors.count;
					if (health.doc.errors.threshold) sample.errT = health.doc.errors.threshold;
				}
			} else {
				sample.h = 'unreachable';
			}
		}
		if (!sample.ok) downNow++;

		services[svc.id] = foldSample(prevServices[svc.id], sample, {
			nowMs: now,
			cap: RECENT_CAP,
			slow: sample.ok && (sample.ms > threshold || sample.h === 'degraded')
		});

		// One history series per reported dependency check.
		const reported = health?.doc ? Object.entries(health.doc.checks) : [];
		for (const [key, check] of reported) {
			const id = `${svc.id}:${key}`;
			const componentSample = {
				t: now,
				ok: check.ok,
				ms: check.ms ?? 0,
				error: check.ok ? null : check.note || 'check failed'
			};
			if (check.degraded) componentSample.h = 'degraded';
			services[id] = foldSample(prevServices[id], componentSample, {
				nowMs: now,
				cap: COMPONENT_RECENT_CAP,
				slow: check.ok && check.degraded
			});
		}

		// Checks that stopped being reported keep their (pruned) history so the
		// page can show the gap honestly, and drop off once fully aged out.
		const reportedIds = new Set(reported.map(([key]) => `${svc.id}:${key}`));
		for (const [id, componentHistory] of Object.entries(prevServices)) {
			if (!id.startsWith(`${svc.id}:`) || reportedIds.has(id)) continue;
			const daily = pruneDaily(componentHistory?.daily ?? {}, now);
			if (Object.keys(daily).length === 0) continue;
			services[id] = { ...componentHistory, daily };
		}

		const deep = !svc.healthUrl
			? ''
			: health?.doc
				? ` · health: ${health.doc.status}, ${reported.length} check(s)` +
					(health.doc.errors ? `, errors ${health.doc.errors.count}` : '')
				: ` · health: unreachable (${health?.error})`;
		const label = sample.ok
			? `up ${sample.ms}ms${sample.ms > threshold ? ' (degraded)' : ''}`
			: `DOWN (${sample.error})`;
		console.log(`${svc.id.padEnd(8)} ${label}${deep} — ${svc.url}`);
	}

	const doc = {
		schemaVersion: SCHEMA_VERSION,
		generatedAt: new Date(now).toISOString(),
		degradedThresholdMs: threshold,
		services
	};

	await mkdir(dirname(HISTORY_PATH), { recursive: true });
	await writeFile(HISTORY_PATH, JSON.stringify(doc, null, '\t') + '\n');
	console.log(`\nWrote ${HISTORY_PATH} — ${config.services.length} service(s), ${downNow} down.`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
