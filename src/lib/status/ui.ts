// Presentation mapping for status states. Centralised so the hero, service
// rows, timeline bars, and incident chips never disagree on a colour or label.
// Colours reference the design tokens exposed in app.css (@theme inline), so
// they theme correctly in both light and dark mode.

import type { ServiceState, OverallLevel, IncidentSeverity, IncidentStatus } from './types';

export interface StateStyle {
	label: string;
	/** Tailwind text colour utility. */
	text: string;
	/** Tailwind background utility for the status dot / bar. */
	dot: string;
	/** CSS color() value for tinted surfaces. */
	cssVar: string;
}

const GREEN = 'var(--ds-green-600)';
const AMBER = 'var(--ds-amber-800)';
const RED = 'var(--ds-red-600)';
const GRAY = 'var(--ds-gray-alpha-400)';

export const STATE_STYLES: Record<ServiceState, StateStyle> = {
	operational: { label: 'Operational', text: 'text-green-600', dot: 'bg-green-600', cssVar: GREEN },
	degraded: { label: 'Degraded', text: 'text-amber-800', dot: 'bg-amber-800', cssVar: AMBER },
	down: { label: 'Down', text: 'text-red-600', dot: 'bg-red-600', cssVar: RED },
	pending: { label: 'Pending', text: 'text-gray-alpha-600', dot: 'bg-gray-alpha-400', cssVar: GRAY }
};

export const OVERALL_STYLES: Record<OverallLevel, StateStyle> = {
	operational: STATE_STYLES.operational,
	degraded: {
		label: 'Degraded performance',
		text: 'text-amber-800',
		dot: 'bg-amber-800',
		cssVar: AMBER
	},
	partial: {
		label: 'Partial outage',
		text: 'text-orange-600',
		dot: 'bg-orange-600',
		cssVar: 'var(--ds-orange-600)'
	},
	major: { label: 'Major outage', text: 'text-red-600', dot: 'bg-red-600', cssVar: RED },
	maintenance: {
		label: 'Maintenance',
		text: 'text-blue-700',
		dot: 'bg-blue-700',
		cssVar: 'var(--ds-blue-700)'
	},
	pending: STATE_STYLES.pending
};

/** Colour for a single day cell in the 90-day timeline. */
export function dayCellClass(
	state: 'operational' | 'degraded' | 'down' | 'pending' | 'nodata'
): string {
	switch (state) {
		case 'operational':
			return 'bg-green-600';
		case 'degraded':
			return 'bg-amber-800';
		case 'down':
			return 'bg-red-600';
		default:
			return 'bg-gray-alpha-200';
	}
}

export function dayCellVar(
	state: 'operational' | 'degraded' | 'down' | 'pending' | 'nodata'
): string {
	switch (state) {
		case 'operational':
			return GREEN;
		case 'degraded':
			return AMBER;
		case 'down':
			return RED;
		default:
			return 'var(--ds-gray-alpha-200)';
	}
}

const SEVERITY_LABELS: Record<IncidentSeverity, string> = {
	maintenance: 'Maintenance',
	minor: 'Minor',
	major: 'Major',
	critical: 'Critical'
};

export function severityLabel(s: IncidentSeverity): string {
	return SEVERITY_LABELS[s];
}

export function severityStyle(s: IncidentSeverity): StateStyle {
	switch (s) {
		case 'critical':
			return { label: 'Critical', text: 'text-red-600', dot: 'bg-red-600', cssVar: RED };
		case 'major':
			return {
				label: 'Major',
				text: 'text-orange-600',
				dot: 'bg-orange-600',
				cssVar: 'var(--ds-orange-600)'
			};
		case 'minor':
			return { label: 'Minor', text: 'text-amber-800', dot: 'bg-amber-800', cssVar: AMBER };
		default:
			return {
				label: 'Maintenance',
				text: 'text-blue-700',
				dot: 'bg-blue-700',
				cssVar: 'var(--ds-blue-700)'
			};
	}
}

const STATUS_LABELS: Record<IncidentStatus, string> = {
	investigating: 'Investigating',
	identified: 'Identified',
	monitoring: 'Monitoring',
	resolved: 'Resolved'
};

export function incidentStatusLabel(s: IncidentStatus): string {
	return STATUS_LABELS[s];
}

/** Format a 0..1 ratio as a percentage string, or an em dash when null. */
export function formatUptime(ratio: number | null): string {
	if (ratio === null) return '—';
	const pct = ratio * 100;
	// Show two decimals unless it's a clean 100%.
	if (pct >= 99.995) return '100%';
	return `${pct.toFixed(2)}%`;
}

/** Human-friendly "x ago" from an epoch-ms timestamp. */
export function relativeTime(epochMs: number | null, nowMs: number): string {
	if (!epochMs) return 'never';
	const diff = Math.max(0, nowMs - epochMs);
	const sec = Math.round(diff / 1000);
	if (sec < 60) return sec <= 5 ? 'just now' : `${sec}s ago`;
	const min = Math.round(sec / 60);
	if (min < 60) return `${min}m ago`;
	const hr = Math.round(min / 60);
	if (hr < 24) return `${hr}h ago`;
	const day = Math.round(hr / 24);
	return `${day}d ago`;
}
