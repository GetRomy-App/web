#!/usr/bin/env node
// Internal alerting for the Rōmy uptime monitor — no third-party pager.
//
// Runs right after scripts/uptime-check.mjs in the same workflow, reads the
// freshly written history, and turns sustained problems into GitHub issues on
// this repo (label: status-alert). GitHub then does the paging: watchers and
// anyone in `alerts.mentions` get email/push the moment an issue opens.
//
// Alert conditions (each keyed, one issue per key):
//   down:<id>       a service — or a dependency check reported through its
//                   health endpoint — is failing its probes (>=2 consecutive
//                   failures, mirroring the "down" rule in
//                   src/lib/status/compute.ts, so a lone blip never pages)
//   spike:<id>      the service's health telemetry reports an application
//                   error count at or above its own declared threshold
//   telemetry:<id>  a health endpoint that used to report went dark while the
//                   page still answers — deep checks are blind, a human should
//                   know (a service that never reported yet does not page)
//
// Issues auto-close with a recovery note when the condition clears. An issue a
// human closed by hand is treated as acknowledged: the same condition will not
// re-open it for ACK_COOLDOWN_MS.
//
// Env: GITHUB_TOKEN + GITHUB_REPOSITORY (both provided by Actions). Without a
// token this becomes a dry run that only prints what it would do. Set
// STATUS_DATA_DIR to point at scratch data, GITHUB_API_URL to a mock server —
// both used by the smoke tests. No dependencies — just Node 18+.

import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = process.env.STATUS_DATA_DIR || join(ROOT, 'data', 'status');

const LABEL = 'status-alert';
const LABEL_COLOR = 'D93F0B';
const STATE_WINDOW = 5; // keep in sync with src/lib/status/compute.ts
const FRESH_MS = 45 * 60 * 1000; // ignore series with no recent samples
const ACK_COOLDOWN_MS = 6 * 60 * 60 * 1000;
const MARKER_RE = /<!-- status-alert:([a-z0-9:_-]+) -->/i;

const API = (process.env.GITHUB_API_URL || 'https://api.github.com').replace(/\/+$/, '');
const REPO = process.env.GITHUB_REPOSITORY || '';
const TOKEN = process.env.GITHUB_TOKEN || '';
const DRY_RUN = !TOKEN || !REPO;

async function readJson(path, fallback) {
	try {
		return JSON.parse(await readFile(path, 'utf-8'));
	} catch {
		return fallback;
	}
}

/** Mirrors the "down" rules of currentState() in src/lib/status/compute.ts. */
function isDown(history) {
	const window = (history?.recent ?? []).slice(-STATE_WINDOW);
	if (window.length === 0) return false;
	const failures = window.filter((s) => !s.ok).length;
	if (failures === window.length) return true;
	return !window[window.length - 1].ok && failures >= 2;
}

function latestSample(history) {
	const recent = history?.recent ?? [];
	return recent.length ? recent[recent.length - 1] : null;
}

function isFresh(history, nowMs) {
	const latest = latestSample(history);
	return !!latest && nowMs - latest.t <= FRESH_MS;
}

/** Start of the current failing streak, for "down since" in the issue body. */
function failingSince(history) {
	const recent = history?.recent ?? [];
	let since = null;
	for (let i = recent.length - 1; i >= 0; i--) {
		if (recent[i].ok) break;
		since = recent[i].t;
	}
	return since;
}

function isSpiking(sample) {
	return (
		!!sample &&
		Number.isFinite(sample.err) &&
		Number.isFinite(sample.errT) &&
		sample.errT > 0 &&
		sample.err >= sample.errT
	);
}

const REPORTING = new Set(['ok', 'degraded', 'down']);

function utc(ms) {
	return new Date(ms).toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
}

function duration(ms) {
	const min = Math.max(1, Math.round(ms / 60000));
	if (min < 60) return `${min} min`;
	const hr = Math.floor(min / 60);
	return `${hr}h ${String(min % 60).padStart(2, '0')}m`;
}

function sampleTable(history) {
	const rows = (history?.recent ?? []).slice(-STATE_WINDOW).map((s) => {
		const result = s.ok ? '✅ up' : '❌ down';
		const http = Number.isFinite(s.status) && s.status > 0 ? String(s.status) : '—';
		const note = [s.error, s.h && s.h !== 'ok' ? `health: ${s.h}` : null]
			.filter(Boolean)
			.join(' · ');
		return `| ${utc(s.t)} | ${result} | ${http} | ${s.ms} | ${note || '—'} |`;
	});
	return [
		'| Probe (UTC) | Result | HTTP | ms | Note |',
		'| --- | --- | --- | --- | --- |',
		...rows
	].join('\n');
}

function componentLabel(svc, key) {
	return svc.components?.[key]?.name ?? key;
}

/**
 * Build the full set of alert conditions from config + history. Each entry:
 * { key, title, body } — key doubles as the idempotency marker in the body.
 */
function computeConditions(config, history, nowMs) {
	const conditions = [];
	const services = history?.services ?? {};
	const statusPage = config.alerts?.statusPage || 'https://getromy.app/status';
	const mentions = (config.alerts?.mentions ?? []).map((m) => `@${m}`).join(' ');

	const runUrl =
		process.env.GITHUB_SERVER_URL && process.env.GITHUB_RUN_ID && REPO
			? `${process.env.GITHUB_SERVER_URL}/${REPO}/actions/runs/${process.env.GITHUB_RUN_ID}`
			: null;

	const footer = (key) =>
		[
			'',
			`Live status: ${statusPage}`,
			...(runUrl ? [`Monitor run: ${runUrl}`] : []),
			...(mentions ? [`cc ${mentions}`] : []),
			'',
			'> Opened automatically by the uptime monitor — closes itself when checks recover.',
			'',
			`<!-- status-alert:${key} -->`
		].join('\n');

	for (const svc of config.services ?? []) {
		const svcHistory = services[svc.id];
		const latest = latestSample(svcHistory);

		if (isDown(svcHistory)) {
			const since = failingSince(svcHistory);
			const key = `down:${svc.id}`;
			conditions.push({
				key,
				title: `🔴 ${svc.name} is down`,
				body: [
					`**${svc.name}** (${svc.url}) is failing its checks.`,
					'',
					`- Failing since: ${since ? `${utc(since)} (${duration(nowMs - since)})` : 'unknown'}`,
					`- Latest error: \`${latest?.error ?? 'unknown'}\``,
					'',
					sampleTable(svcHistory),
					footer(key)
				].join('\n')
			});
		}

		// Dependency checks reported through the health endpoint, e.g. "app:database".
		for (const [id, componentHistory] of Object.entries(services)) {
			if (!id.startsWith(`${svc.id}:`)) continue;
			if (!isFresh(componentHistory, nowMs) || !isDown(componentHistory)) continue;
			const componentKey = id.slice(svc.id.length + 1);
			const name = componentLabel(svc, componentKey);
			const since = failingSince(componentHistory);
			const componentLatest = latestSample(componentHistory);
			const key = `down:${id}`;
			conditions.push({
				key,
				title: `🔴 ${svc.name}: ${name} check failing`,
				body: [
					`The **${name}** dependency check reported by ${svc.name}'s health endpoint is failing.`,
					'',
					`- Failing since: ${since ? `${utc(since)} (${duration(nowMs - since)})` : 'unknown'}`,
					`- Latest note: \`${componentLatest?.error ?? 'unknown'}\``,
					'',
					sampleTable(componentHistory),
					footer(key)
				].join('\n')
			});
		}

		// A spike stays active until two consecutive quiet reports (~20 min), so
		// an error count hovering at the threshold doesn't churn open/close.
		const spikeSample = (svcHistory?.recent ?? []).slice(-2).filter(isSpiking).pop();
		if (spikeSample) {
			const key = `spike:${svc.id}`;
			conditions.push({
				key,
				title: `🟠 ${svc.name}: error rate above threshold`,
				body: [
					`**${svc.name}** is reporting an application error spike through its health endpoint.`,
					'',
					`- Latest report: **${spikeSample.err} errors** in its window (threshold ${spikeSample.errT})`,
					`- Reported at: ${utc(spikeSample.t)}`,
					'',
					'The service may still answer probes — this is the error log crossing the',
					"threshold the app itself declared. Check the app's logs.",
					footer(key)
				].join('\n')
			});
		}

		// Telemetry regression: the endpoint used to report and went dark.
		if (svc.healthUrl && svcHistory) {
			const recent = svcHistory.recent ?? [];
			const lastTwo = recent.slice(-2);
			const wentDark = lastTwo.length === 2 && lastTwo.every((s) => s.h === 'unreachable');
			const everReported = recent.some((s) => REPORTING.has(s.h));
			if (wentDark && everReported) {
				const key = `telemetry:${svc.id}`;
				conditions.push({
					key,
					title: `🟡 ${svc.name}: health telemetry unreachable`,
					body: [
						`**${svc.name}** still answers, but its deep-health endpoint stopped responding:`,
						`\`${svc.healthUrl}\``,
						'',
						'Dependency checks (database, cache, AI gateway, …) are blind until it is',
						'back — an outage behind the homepage would currently go unseen.',
						footer(key)
					].join('\n')
				});
			}
		}
	}

	return conditions;
}

// ---------------------------------------------------------------------------
// GitHub API plumbing
// ---------------------------------------------------------------------------

async function gh(method, path, body) {
	const res = await fetch(`${API}${path}`, {
		method,
		headers: {
			Authorization: `Bearer ${TOKEN}`,
			Accept: 'application/vnd.github+json',
			'User-Agent': 'romy-status-alerter',
			...(body ? { 'Content-Type': 'application/json' } : {})
		},
		body: body ? JSON.stringify(body) : undefined
	});
	if (!res.ok) {
		const detail = await res.text().catch(() => '');
		throw new Error(`GitHub ${method} ${path} → ${res.status} ${detail.slice(0, 200)}`);
	}
	return res.status === 204 ? null : res.json();
}

async function ensureLabel() {
	try {
		await gh('POST', `/repos/${REPO}/labels`, {
			name: LABEL,
			color: LABEL_COLOR,
			description: 'Automated alert from the uptime monitor'
		});
	} catch (err) {
		if (!String(err.message).includes('422')) throw err; // 422 = already exists
	}
}

function markerOf(issue) {
	const match = MARKER_RE.exec(issue.body ?? '');
	return match ? match[1] : null;
}

async function listAlertIssues(state, since) {
	const query = new URLSearchParams({ labels: LABEL, state, per_page: '100' });
	if (since) query.set('since', since);
	const issues = await gh('GET', `/repos/${REPO}/issues?${query}`);
	return (issues ?? []).filter((issue) => !issue.pull_request);
}

async function main() {
	const config = await readJson(join(DATA_DIR, 'services.json'), null);
	const history = await readJson(join(DATA_DIR, 'history.json'), null);
	if (!config || !history) {
		console.error('Missing services.json or history.json — run uptime-check first.');
		process.exit(1);
	}

	const nowMs = Date.now();
	const conditions = computeConditions(config, history, nowMs);
	const activeKeys = new Set(conditions.map((c) => c.key));

	console.log(
		conditions.length
			? `Active alert conditions: ${[...activeKeys].join(', ')}`
			: 'No active alert conditions.'
	);

	if (DRY_RUN) {
		console.log('No GITHUB_TOKEN/GITHUB_REPOSITORY — dry run, not touching issues.');
		return;
	}

	await ensureLabel();

	const open = await listAlertIssues('open');
	const openByKey = new Map();
	for (const issue of open) {
		const key = markerOf(issue);
		if (key) openByKey.set(key, issue);
	}

	// A human closing an alert issue means "acknowledged" — honour it for a
	// cooldown instead of re-paging on the very next run. Closes performed by
	// the monitor itself (recoveries) must NOT suppress a fresh outage, so we
	// look up who closed each candidate — the list payload doesn't say.
	const recentlyClosed = await listAlertIssues(
		'closed',
		new Date(nowMs - ACK_COOLDOWN_MS).toISOString()
	);
	const acknowledged = new Set();
	for (const issue of recentlyClosed) {
		const key = markerOf(issue);
		if (!key || !activeKeys.has(key)) continue;
		const detail = await gh('GET', `/repos/${REPO}/issues/${issue.number}`);
		const closedBy = detail?.closed_by?.login ?? '';
		if (!closedBy.endsWith('[bot]')) acknowledged.add(key);
	}

	let failures = 0;

	for (const condition of conditions) {
		if (openByKey.has(condition.key)) continue;
		if (acknowledged.has(condition.key)) {
			console.log(`skip ${condition.key} — closed by hand recently (cooldown)`);
			continue;
		}
		try {
			const issue = await gh('POST', `/repos/${REPO}/issues`, {
				title: condition.title,
				body: condition.body,
				labels: [LABEL]
			});
			console.log(`opened #${issue.number} — ${condition.title}`);
		} catch (err) {
			failures++;
			console.error(`Failed to open issue for ${condition.key}: ${err.message}`);
		}
	}

	for (const [key, issue] of openByKey) {
		if (activeKeys.has(key)) continue;
		// Only close on a positive signal: the subject must have fresh data again
		// (or have left the config entirely) — never close into a data gap.
		const subject = key.split(':').slice(1).join(':');
		const stillConfigured =
			(config.services ?? []).some((s) => s.id === subject || subject.startsWith(`${s.id}:`)) ??
			false;
		const subjectHistory = history.services?.[subject];
		if (stillConfigured && key.startsWith('down:') && !isFresh(subjectHistory, nowMs)) continue;

		const openedFor = duration(nowMs - new Date(issue.created_at).getTime());
		const note = stillConfigured
			? `Recovered — checks passing again after ${openedFor}. Auto-closed by the uptime monitor.`
			: 'No longer monitored (removed from services.json). Auto-closed by the uptime monitor.';
		try {
			await gh('POST', `/repos/${REPO}/issues/${issue.number}/comments`, { body: note });
			await gh('PATCH', `/repos/${REPO}/issues/${issue.number}`, {
				state: 'closed',
				state_reason: 'completed'
			});
			console.log(`closed #${issue.number} — ${key} recovered`);
		} catch (err) {
			failures++;
			console.error(`Failed to close issue #${issue.number}: ${err.message}`);
		}
	}

	if (failures > 0) {
		console.error(`${failures} GitHub operation(s) failed.`);
		process.exit(1);
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
