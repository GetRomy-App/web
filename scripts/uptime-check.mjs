#!/usr/bin/env node
// Uptime probe runner for the Rōmy status page.
//
// Reads data/status/services.json, pings every service, and folds the result
// into data/status/history.json:
//   - lastCheck : the most recent probe
//   - recent    : a rolling window of raw samples (for the live view + sparkline)
//   - daily     : per-UTC-day aggregates, retained for 90 days (for the timeline)
//
// Runs in CI on a cron schedule (see .github/workflows/uptime.yml) and is safe
// to run locally: `node scripts/uptime-check.mjs`. No dependencies — just Node 18+.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SERVICES_PATH = join(ROOT, 'data', 'status', 'services.json');
const HISTORY_PATH = join(ROOT, 'data', 'status', 'history.json');

const SCHEMA_VERSION = 1;
const RECENT_CAP = 240; // ~40h at a 10-minute cadence
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

function pruneDaily(daily, nowMs) {
	const oldestAllowed = utcDayKey(nowMs - (RETENTION_DAYS - 1) * DAY_MS);
	const next = {};
	for (const [key, bucket] of Object.entries(daily)) {
		if (key >= oldestAllowed) next[key] = bucket;
	}
	return next;
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
	const dayKey = utcDayKey(now);

	const prev = await readJson(HISTORY_PATH, { services: {} });
	const prevServices = prev.services ?? {};

	const services = {};
	let downNow = 0;

	for (const svc of config.services) {
		const sample = await probe(svc.url, timeoutMs);
		if (!sample.ok) downNow++;

		const history = prevServices[svc.id] ?? { lastCheck: null, recent: [], daily: {} };
		const recent = Array.isArray(history.recent) ? history.recent : [];
		recent.push(sample);
		while (recent.length > RECENT_CAP) recent.shift();

		const daily = pruneDaily(history.daily ?? {}, now);
		const bucket = daily[dayKey] ?? { up: 0, total: 0, degraded: 0, sumMs: 0 };
		bucket.total += 1;
		if (sample.ok) {
			bucket.up += 1;
			bucket.sumMs += sample.ms;
			if (sample.ms > threshold) bucket.degraded += 1;
		}
		daily[dayKey] = bucket;

		services[svc.id] = { lastCheck: sample, recent, daily };

		const label = sample.ok
			? `up ${sample.ms}ms${sample.ms > threshold ? ' (degraded)' : ''}`
			: `DOWN (${sample.error})`;
		console.log(`${svc.id.padEnd(8)} ${label} — ${svc.url}`);
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
