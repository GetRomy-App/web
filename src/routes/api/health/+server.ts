// Deep-health endpoint for the marketing site, implementing the contract in
// data/status/README.md. The uptime monitor polls this alongside the homepage
// so the status page can say more than "the page loads" — it reports each
// dependency this deployment actually relies on.
//
// The marketing site has exactly one runtime dependency: Resend, which
// delivers the contact / issue-report emails. Pages render without it, so a
// failing email check degrades the service rather than downing it.
//
// This file doubles as the reference implementation for the Rōmy app's
// endpoint at intel.getromy.app/api/health — same shape, more checks
// (database, cache, ai_gateway, billing, email) plus `errors` telemetry from
// its error log.

import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

// A live endpoint, never a snapshot.
export const prerender = false;

const CHECK_TIMEOUT_MS = 5000;
// The monitor polls every ~10 min; a short cache keeps a curious crowd (or a
// scraper) from turning each page hit into a Resend API call.
const CACHE_MS = 60_000;

interface Check {
	ok: boolean;
	ms?: number;
	degraded?: boolean;
	note?: string;
}

interface HealthBody {
	status: 'ok' | 'degraded' | 'down';
	checks: Record<string, Check>;
}

let cached: { at: number; body: HealthBody } | null = null;

/**
 * Proves the email path works without sending anything: an authenticated read
 * against the Resend API exercises DNS, TLS, and the API key in one call.
 */
async function checkEmail(): Promise<Check> {
	const apiKey = env.RESEND_API_KEY;
	if (!apiKey) return { ok: false, note: 'RESEND_API_KEY not configured' };

	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), CHECK_TIMEOUT_MS);
	const started = Date.now();
	try {
		const res = await fetch('https://api.resend.com/domains', {
			headers: { Authorization: `Bearer ${apiKey}` },
			signal: controller.signal
		});
		const ms = Date.now() - started;
		if (!res.ok) return { ok: false, ms, note: `Resend HTTP ${res.status}` };
		return { ok: true, ms };
	} catch {
		const ms = Date.now() - started;
		return { ok: false, ms, note: controller.signal.aborted ? 'timeout' : 'network error' };
	} finally {
		clearTimeout(timer);
	}
}

export const GET: RequestHandler = async () => {
	const now = Date.now();
	let body: HealthBody;
	if (cached && now - cached.at < CACHE_MS) {
		body = cached.body;
	} else {
		const email = await checkEmail();
		body = {
			status: email.ok ? 'ok' : 'degraded',
			checks: { email }
		};
		cached = { at: now, body };
	}

	// Per the contract: "down" ships as HTTP 503 so dumb monitors agree with
	// smart ones; "ok" and "degraded" are 200 with the verdict in the body.
	return json(body, {
		status: body.status === 'down' ? 503 : 200,
		headers: { 'cache-control': 'no-store' }
	});
};
