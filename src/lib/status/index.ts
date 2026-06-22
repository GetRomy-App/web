// Server-only loaders for the status page. Reads the committed services +
// history JSON and the incident markdoc files, then computes the render-ready
// summaries. Mirrors the fs + Markdoc pattern used by $lib/content and $lib/legal.

import fs from 'fs/promises';
import type { Dirent } from 'node:fs';
import path from 'path';
import matter from 'gray-matter';
import Markdoc from '@markdoc/markdoc';

import { summarize, computeOverall } from './compute';
import type {
	ServiceConfig,
	HistoryDoc,
	Incident,
	IncidentSeverity,
	IncidentStatus,
	ServiceSummary,
	OverallStatus
} from './types';

const STATUS_DATA_DIR = path.join(process.cwd(), 'data', 'status');
const SERVICES_PATH = path.join(STATUS_DATA_DIR, 'services.json');
const HISTORY_PATH = path.join(STATUS_DATA_DIR, 'history.json');
const INCIDENTS_DIR = path.join(process.cwd(), 'content', 'status');

interface ServicesConfig {
	repo: string;
	branch: string;
	timeoutMs: number;
	degradedThresholdMs: number;
	services: ServiceConfig[];
}

const SEVERITIES: IncidentSeverity[] = ['maintenance', 'minor', 'major', 'critical'];
const STATUSES: IncidentStatus[] = ['investigating', 'identified', 'monitoring', 'resolved'];

async function readJson<T>(filePath: string, fallback: T): Promise<T> {
	try {
		return JSON.parse(await fs.readFile(filePath, 'utf-8')) as T;
	} catch {
		return fallback;
	}
}

export async function getServicesConfig(): Promise<ServicesConfig> {
	return readJson<ServicesConfig>(SERVICES_PATH, {
		repo: 'getromy-app/web',
		branch: 'main',
		timeoutMs: 15000,
		degradedThresholdMs: 2500,
		services: []
	});
}

export async function getHistory(): Promise<HistoryDoc> {
	return readJson<HistoryDoc>(HISTORY_PATH, {
		schemaVersion: 1,
		generatedAt: '',
		degradedThresholdMs: 2500,
		services: {}
	});
}

function coerceStringArray(value: unknown): string[] {
	if (Array.isArray(value)) return value.map((v) => String(v));
	if (typeof value === 'string' && value.trim()) return [value.trim()];
	return [];
}

function asEnum<T extends string>(value: unknown, allowed: T[], fallback: T): T {
	return allowed.includes(value as T) ? (value as T) : fallback;
}

function toIso(value: unknown): string {
	if (!value) return '';
	if (value instanceof Date) return value.toISOString();
	const d = new Date(String(value));
	return isNaN(d.getTime()) ? String(value) : d.toISOString();
}

export async function getIncidents(): Promise<Incident[]> {
	let entries: Dirent<string>[];
	try {
		entries = await fs.readdir(INCIDENTS_DIR, { withFileTypes: true });
	} catch {
		return [];
	}

	const incidents: Incident[] = [];
	for (const entry of entries) {
		// One directory per incident, holding index.mdoc — mirrors content/posts.
		if (!entry.isDirectory()) continue;
		const slug = entry.name;
		try {
			const raw = await fs.readFile(path.join(INCIDENTS_DIR, slug, 'index.mdoc'), 'utf-8');
			const { data, content: source } = matter(raw);

			const ast = Markdoc.parse(source);
			const transformed = Markdoc.transform(ast);
			const html = Markdoc.renderers.html(transformed);

			const resolved = toIso(data.resolved);
			incidents.push({
				slug,
				title: data.title ?? slug,
				date: toIso(data.date),
				resolved,
				severity: asEnum<IncidentSeverity>(data.severity, SEVERITIES, 'minor'),
				status: asEnum<IncidentStatus>(
					data.status,
					STATUSES,
					resolved ? 'resolved' : 'investigating'
				),
				affected: coerceStringArray(data.affected),
				content: html,
				active: !resolved
			});
		} catch {
			// skip malformed incident files
		}
	}

	// Newest first by start date.
	return incidents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export interface StatusPageData {
	repo: string;
	branch: string;
	rawHistoryUrl: string;
	degradedThresholdMs: number;
	generatedAt: string;
	/** Build-time clock, so the first client render matches SSR. */
	now: number;
	services: ServiceConfig[];
	summaries: ServiceSummary[];
	overall: OverallStatus;
	incidents: Incident[];
}

export async function loadStatusPageData(): Promise<StatusPageData> {
	const [config, history, incidents] = await Promise.all([
		getServicesConfig(),
		getHistory(),
		getIncidents()
	]);

	const now = Date.now();
	const summaries = summarize(config.services, history, now);
	const activeIncidents = incidents.filter((i) => i.active);
	const overall = computeOverall(summaries, activeIncidents);

	const rawHistoryUrl = `https://raw.githubusercontent.com/${config.repo}/${config.branch}/data/status/history.json`;

	return {
		repo: config.repo,
		branch: config.branch,
		rawHistoryUrl,
		degradedThresholdMs: history.degradedThresholdMs ?? config.degradedThresholdMs,
		generatedAt: history.generatedAt,
		now,
		services: config.services,
		summaries,
		overall,
		incidents
	};
}
