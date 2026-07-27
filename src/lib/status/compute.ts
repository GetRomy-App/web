// Pure, isomorphic helpers that turn raw history into the shape the UI renders.
// Imported by BOTH the prerender loader (server) and the live refresh (browser),
// so it must stay free of node-only APIs.

import type {
	ComponentSummary,
	HealthTelemetry,
	ServiceConfig,
	ServiceState,
	ServiceSummary,
	SummaryCore,
	HistoryDoc,
	ServiceHistory,
	DayCell,
	OverallStatus,
	OverallLevel,
	Incident
} from './types';

const DAY_MS = 24 * 60 * 60 * 1000;
export const TIMELINE_DAYS = 90;
const SPARK_POINTS = 40;

/** UTC date key, e.g. "2026-06-22". */
export function utcDayKey(epochMs: number): string {
	return new Date(epochMs).toISOString().slice(0, 10);
}

/** Trailing day keys, oldest first, ending today (UTC). */
export function lastDayKeys(n: number, nowMs: number): string[] {
	const keys: string[] = [];
	for (let i = n - 1; i >= 0; i--) {
		keys.push(utcDayKey(nowMs - i * DAY_MS));
	}
	return keys;
}

// The live badge reflects the last few probes, not a single sample, so one slow
// or briefly-failed check can't flip the headline status. A 5-probe window is
// ~50 min at the 10-minute cadence — wide enough to absorb a cold start or a bit
// of runner jitter, narrow enough to surface a real, sustained problem quickly.
const STATE_WINDOW = 5;

/** Median of a non-empty numeric list. */
function median(values: number[]): number {
	const sorted = [...values].sort((a, b) => a - b);
	const mid = Math.floor(sorted.length / 2);
	return sorted.length % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Current state of a service, smoothed over the last few probes:
 *   - "down"        when no probe in the window succeeded, or the latest probe
 *                   failed and it isn't a lone blip (>=2 recent failures) — so a
 *                   single transient runner error doesn't read as an outage.
 *   - "degraded"    when the service's own health endpoint reported degraded on
 *                   two probes in the window (~20 min sustained), or the MEDIAN
 *                   latency of recent healthy probes exceeds the threshold —
 *                   never just one slow ping or one flapping report.
 *   - "operational" otherwise.
 * A reported deep-health of "down" is recorded as a failed sample by the probe
 * runner, so the down rules above already cover "page loads, product broken".
 */
export function currentState(history: ServiceHistory, thresholdMs: number): ServiceState {
	const window = (history?.recent ?? []).slice(-STATE_WINDOW);
	if (window.length === 0) return 'pending';

	const healthy = window.filter((s) => s.ok);
	if (healthy.length === 0) return 'down';

	const latest = window[window.length - 1];
	if (!latest.ok && window.length - healthy.length >= 2) return 'down';

	const reportedDegraded = window.filter((s) => s.h === 'degraded').length;
	if (reportedDegraded >= 2 || (reportedDegraded === 1 && window.length === 1)) return 'degraded';

	return median(healthy.map((s) => s.ms)) > thresholdMs ? 'degraded' : 'operational';
}

/**
 * Derive a day cell's visual state. A day is only marked "degraded" if a
 * meaningful share of that day's probes were slow (not a single blip), so
 * normal latency variance from the probe runner doesn't paint a day amber.
 */
const DEGRADED_DAY_RATIO = 0.1;
function dayState(uptime: number, degradedRatio: number): DayCell['state'] {
	if (uptime < 0.95) return 'down';
	if (uptime < 1) return 'degraded';
	if (degradedRatio >= DEGRADED_DAY_RATIO) return 'degraded';
	return 'operational';
}

function ratio(up: number, total: number): number | null {
	return total > 0 ? up / total : null;
}

/**
 * Dependency samples arrive only while the parent's health endpoint answers,
 * so a component whose data stops flowing must fall back to "pending" rather
 * than freeze on its last known colour. ~4 missed cadences counts as stale.
 */
const COMPONENT_STALE_MS = 45 * 60 * 1000;

function computeCore(
	id: string,
	name: string,
	description: string,
	history: ServiceHistory | undefined,
	thresholdMs: number,
	nowMs: number
): SummaryCore {
	const safe: ServiceHistory = history ?? { lastCheck: null, recent: [], daily: {} };
	const daily = safe.daily ?? {};
	const recent = safe.recent ?? [];

	// 24h window from raw samples.
	let d1Up = 0;
	let d1Total = 0;
	const cutoff = nowMs - DAY_MS;
	for (const s of recent) {
		if (s.t >= cutoff) {
			d1Total++;
			if (s.ok) d1Up++;
		}
	}

	// 7d and 90d windows from daily buckets.
	const sumWindow = (n: number) => {
		let up = 0;
		let total = 0;
		for (const key of lastDayKeys(n, nowMs)) {
			const b = daily[key];
			if (b) {
				up += b.up;
				total += b.total;
			}
		}
		return { up, total };
	};
	const w7 = sumWindow(7);
	const w90 = sumWindow(TIMELINE_DAYS);

	// 90-day timeline, oldest first.
	const days: DayCell[] = lastDayKeys(TIMELINE_DAYS, nowMs).map((date) => {
		const b = daily[date];
		if (!b || b.total === 0) return { date, uptime: null, state: 'nodata' };
		const u = b.up / b.total;
		return { date, uptime: u, state: dayState(u, b.degraded / b.total) };
	});

	// Sparkline of recent response times (newest last).
	const spark = recent.slice(-SPARK_POINTS).map((s) => (s.ok ? s.ms : 0));

	return {
		id,
		name,
		description,
		state: currentState(safe, thresholdMs),
		responseMs: safe.lastCheck ? safe.lastCheck.ms : null,
		lastCheckedAt: safe.lastCheck ? safe.lastCheck.t : null,
		uptime: {
			d1: ratio(d1Up, d1Total),
			d7: ratio(w7.up, w7.total),
			d90: ratio(w90.up, w90.total)
		},
		spark,
		days
	};
}

/** Fallback label for a check key the config doesn't name: "ai_gateway" → "AI Gateway". */
function prettifyKey(key: string): string {
	return key
		.split(/[-_\s]+/)
		.filter(Boolean)
		.map((word) => (word === 'ai' ? 'AI' : word[0].toUpperCase() + word.slice(1)))
		.join(' ');
}

/**
 * Summaries for the dependency checks a service reports through its health
 * endpoint. Keys come from the history (whatever the endpoint actually
 * reported), ordered as declared in config with undeclared extras appended, so
 * a new check shows up without a config edit and a renamed one ages out.
 */
function componentSummaries(
	config: ServiceConfig,
	doc: HistoryDoc,
	thresholdMs: number,
	nowMs: number
): ComponentSummary[] {
	const prefix = `${config.id}:`;
	const present = Object.keys(doc?.services ?? {})
		.filter((k) => k.startsWith(prefix))
		.map((k) => k.slice(prefix.length));
	if (present.length === 0) return [];

	const declared = Object.keys(config.components ?? {});
	const ordered = [
		...declared.filter((k) => present.includes(k)),
		...present.filter((k) => !declared.includes(k)).sort()
	];

	return ordered.map((key) => {
		const id = prefix + key;
		const label = config.components?.[key];
		const core = computeCore(
			id,
			label?.name ?? prettifyKey(key),
			label?.description ?? '',
			doc.services[id],
			thresholdMs,
			nowMs
		);
		const stale = core.lastCheckedAt !== null && nowMs - core.lastCheckedAt > COMPONENT_STALE_MS;
		return { ...core, key, state: stale ? 'pending' : core.state };
	});
}

/** Is dependency-level telemetry flowing for this service right now? */
function healthTelemetry(
	config: ServiceConfig,
	history: ServiceHistory | undefined
): HealthTelemetry {
	if (!config.healthUrl) return 'none';
	const last = history?.lastCheck;
	if (!last) return 'none';
	return last.h && last.h !== 'unreachable' ? 'reporting' : 'unreachable';
}

export function computeServiceSummary(
	config: ServiceConfig,
	doc: HistoryDoc,
	thresholdMs: number,
	nowMs: number
): ServiceSummary {
	const history = doc?.services?.[config.id];
	return {
		...computeCore(config.id, config.name, config.description, history, thresholdMs, nowMs),
		url: config.url,
		group: config.group,
		components: componentSummaries(config, doc, thresholdMs, nowMs),
		health: healthTelemetry(config, history)
	};
}

export function summarize(
	services: ServiceConfig[],
	doc: HistoryDoc,
	nowMs: number
): ServiceSummary[] {
	const threshold = doc?.degradedThresholdMs ?? 2500;
	return services.map((svc) => computeServiceSummary(svc, doc, threshold, nowMs));
}

const OVERALL_LABELS: Record<OverallLevel, string> = {
	operational: 'All systems operational',
	degraded: 'Degraded performance',
	partial: 'Partial system outage',
	major: 'Major system outage',
	maintenance: 'Scheduled maintenance',
	pending: 'Awaiting first check'
};

export function computeOverall(
	summaries: ServiceSummary[],
	activeIncidents: Incident[]
): OverallStatus {
	const total = summaries.length;
	const downCount = summaries.filter((s) => s.state === 'down').length;
	const degradedCount = summaries.filter((s) => s.state === 'degraded').length;
	const pendingCount = summaries.filter((s) => s.state === 'pending').length;

	const hasCritical = activeIncidents.some((i) => i.severity === 'critical');
	const hasMajor = activeIncidents.some((i) => i.severity === 'major');
	const hasMinor = activeIncidents.some((i) => i.severity === 'minor');
	const hasMaintenance = activeIncidents.some((i) => i.severity === 'maintenance');

	let level: OverallLevel;
	if ((total > 0 && downCount >= total) || hasCritical) {
		level = 'major';
	} else if (downCount > 0 || hasMajor) {
		level = 'partial';
	} else if (degradedCount > 0 || hasMinor) {
		level = 'degraded';
	} else if (hasMaintenance) {
		level = 'maintenance';
	} else if (total > 0 && pendingCount === total) {
		level = 'pending';
	} else {
		level = 'operational';
	}

	return { level, label: OVERALL_LABELS[level] };
}
