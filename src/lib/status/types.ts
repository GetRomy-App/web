// Shared types for the uptime status page.
// These are used by the prerender loader, the isomorphic compute helpers,
// and the client-side live refresh. Keep this file free of node-only imports
// so it can be bundled for the browser.

export type ServiceState = 'operational' | 'degraded' | 'down' | 'pending';

export type OverallLevel =
	| 'operational'
	| 'degraded'
	| 'partial'
	| 'major'
	| 'maintenance'
	| 'pending';

export type IncidentSeverity = 'maintenance' | 'minor' | 'major' | 'critical';

export type IncidentStatus = 'investigating' | 'identified' | 'monitoring' | 'resolved';

/** A monitored service, as declared in data/status/services.json. */
export interface ServiceConfig {
	id: string;
	name: string;
	description: string;
	url: string;
	group: string;
}

/** A single point-in-time probe result. */
export interface CheckSample {
	/** Epoch milliseconds. */
	t: number;
	/** Whether the service answered as healthy (2xx/3xx, under timeout). */
	ok: boolean;
	/** HTTP status code, or 0 on a network/timeout error. */
	status: number;
	/** Round-trip time in milliseconds. */
	ms: number;
	/** Short error label when the probe failed, else null. */
	error?: string | null;
}

/** Aggregated stats for a single UTC day. */
export interface DayBucket {
	/** Healthy checks that day. */
	up: number;
	/** Total checks that day. */
	total: number;
	/** Checks that breached the degraded threshold (but still answered). */
	degraded: number;
	/** Sum of response times for healthy checks (for averaging). */
	sumMs: number;
}

/** On-disk history for a single service. */
export interface ServiceHistory {
	lastCheck: CheckSample | null;
	/** Most recent raw samples, newest last. Capped. */
	recent: CheckSample[];
	/** Per-day aggregates keyed by UTC date (YYYY-MM-DD). Capped to 90 days. */
	daily: Record<string, DayBucket>;
}

/** The full data/status/history.json document. */
export interface HistoryDoc {
	schemaVersion: number;
	generatedAt: string;
	degradedThresholdMs: number;
	services: Record<string, ServiceHistory>;
}

/** One day cell in the rendered 90-day timeline. */
export interface DayCell {
	date: string;
	/** Uptime ratio 0..1, or null when there was no data that day. */
	uptime: number | null;
	state: ServiceState | 'nodata';
}

/** Everything the UI needs to render one service row. */
export interface ServiceSummary {
	id: string;
	name: string;
	description: string;
	url: string;
	group: string;
	state: ServiceState;
	/** Latest response time in ms, or null when never checked. */
	responseMs: number | null;
	/** Epoch ms of the last check, or null. */
	lastCheckedAt: number | null;
	/** Uptime ratios over trailing windows, 0..1 or null when no data. */
	uptime: { d1: number | null; d7: number | null; d90: number | null };
	/** Newest-last list of recent response times for the sparkline. */
	spark: number[];
	/** Oldest-first list of up to 90 day cells for the timeline. */
	days: DayCell[];
}

export interface OverallStatus {
	level: OverallLevel;
	label: string;
}

/** A status update / incident, parsed from content/status/*.mdoc. */
export interface Incident {
	slug: string;
	title: string;
	/** ISO start time. */
	date: string;
	/** ISO resolved time, or '' when ongoing. */
	resolved: string;
	severity: IncidentSeverity;
	status: IncidentStatus;
	/** Affected service ids. */
	affected: string[];
	/** Rendered HTML body. */
	content: string;
	/** True when there is no resolved time. */
	active: boolean;
}
