// Pure, isomorphic helpers that turn raw history into the shape the UI renders.
// Imported by BOTH the prerender loader (server) and the live refresh (browser),
// so it must stay free of node-only APIs.

import type {
	ServiceConfig,
	ServiceState,
	ServiceSummary,
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

/** Current state of a service from its most recent probe. */
export function currentState(history: ServiceHistory, thresholdMs: number): ServiceState {
	const last = history?.lastCheck;
	if (!last) return 'pending';
	if (!last.ok) return 'down';
	if (last.ms > thresholdMs) return 'degraded';
	return 'operational';
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

export function computeServiceSummary(
	config: ServiceConfig,
	history: ServiceHistory | undefined,
	thresholdMs: number,
	nowMs: number
): ServiceSummary {
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
		id: config.id,
		name: config.name,
		description: config.description,
		url: config.url,
		group: config.group,
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

export function summarize(
	services: ServiceConfig[],
	doc: HistoryDoc,
	nowMs: number
): ServiceSummary[] {
	const threshold = doc?.degradedThresholdMs ?? 2500;
	return services.map((svc) =>
		computeServiceSummary(svc, doc?.services?.[svc.id], threshold, nowMs)
	);
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
