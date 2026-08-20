// Shared plumbing for the two forms on this site — the contact dialog
// (src/routes/api/contact) and the waitlist dialog (src/routes/api/waitlist).
// Both take a small JSON payload, validate it the same way, and hand a
// plain-text email to Resend (https://resend.com).
//
// Required env: RESEND_API_KEY.
// Optional env: CONTACT_FROM_EMAIL (must be a Resend-verified sender).

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const DEFAULT_FROM = 'Rōmy <noreply@letters.getromy.app>';

/** The team. Both forms land here unless the env overrides say otherwise. */
export const TEAM_EMAILS = ['solomon@getromy.app', 'howard@getromy.app'];

export const LIMITS = {
	name: 120,
	email: 200,
	message: 5000,
	organization: 200
} as const;

export function asString(value: unknown): string {
	return typeof value === 'string' ? value.trim() : '';
}

/** Collapse a value to a single line — for fields that land in headers/subjects. */
export function singleLine(value: string): string {
	return value
		.replace(/[\r\n\t]+/g, ' ')
		.replace(/\s{2,}/g, ' ')
		.trim();
}

/** Permissive shape check; the real test of an address is whether a reply lands. */
export function looksLikeEmail(value: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Read a comma-separated recipient list out of the environment, falling back to
 * the team when the variable is unset or empty.
 */
export function recipientsFrom(value: string | undefined, fallback = TEAM_EMAILS): string[] {
	const configured = (value ?? '')
		.split(',')
		.map((entry) => entry.trim())
		.filter(Boolean);
	return configured.length > 0 ? configured : fallback;
}

export function requireApiKey(scope: string): string {
	const apiKey = env.RESEND_API_KEY;
	if (!apiKey) {
		console.error(`[${scope}] RESEND_API_KEY is not set — cannot send email.`);
		throw error(500, 'This form isn’t configured yet. Please email solomon@getromy.app.');
	}
	return apiKey;
}

export interface OutgoingEmail {
	to: string[];
	subject: string;
	text: string;
	replyTo?: string;
}

/**
 * Post one email to Resend. Throws a SvelteKit 502 on failure, so the caller can
 * let it bubble for mail that must arrive.
 */
export async function sendEmail(apiKey: string, scope: string, mail: OutgoingEmail): Promise<void> {
	let res: Response;
	try {
		res = await fetch(RESEND_ENDPOINT, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				from: env.CONTACT_FROM_EMAIL || DEFAULT_FROM,
				to: mail.to,
				...(mail.replyTo ? { reply_to: mail.replyTo } : {}),
				subject: mail.subject,
				text: mail.text
			})
		});
	} catch (err) {
		console.error(`[${scope}] Network error talking to Resend:`, err);
		throw error(502, 'We couldn’t send your message just now. Please try again in a moment.');
	}

	if (!res.ok) {
		const detail = await res.text().catch(() => '');
		console.error(`[${scope}] Resend responded ${res.status}: ${detail}`);
		throw error(502, 'We couldn’t send your message just now. Please try again in a moment.');
	}
}

/**
 * Best-effort variant of {@link sendEmail} for mail that is nice to have but must
 * never fail the request — the signup confirmation, for instance. Logs and moves on.
 */
export async function sendEmailQuietly(
	apiKey: string,
	scope: string,
	mail: OutgoingEmail
): Promise<boolean> {
	try {
		await sendEmail(apiKey, scope, mail);
		return true;
	} catch (err) {
		console.error(`[${scope}] Non-fatal: could not send "${mail.subject}".`, err);
		return false;
	}
}

/** Parse a JSON request body, or fail with a 400. */
export async function readJsonBody(request: Request): Promise<Record<string, unknown>> {
	try {
		return (await request.json()) as Record<string, unknown>;
	} catch {
		throw error(400, 'Expected a JSON body.');
	}
}

export interface PersonFields {
	name: string;
	email: string;
	message: string;
	page: string;
}

/**
 * Validate the name / email / message trio both forms collect. `message` is
 * optional for the waitlist, where a note is welcome but not required.
 */
export function readPersonFields(
	payload: Record<string, unknown>,
	{ requireMessage = true }: { requireMessage?: boolean } = {}
): PersonFields {
	const name = singleLine(asString(payload.name));
	const email = singleLine(asString(payload.email));
	const message = asString(payload.message);
	const page = singleLine(asString(payload.page)).slice(0, 300);

	if (!name || !email || (requireMessage && !message)) {
		throw error(
			400,
			requireMessage
				? 'Please add your name, email, and a message.'
				: 'Please add your name and email.'
		);
	}
	if (name.length > LIMITS.name || email.length > LIMITS.email || message.length > LIMITS.message) {
		throw error(400, 'One of the fields is a little too long — please shorten it.');
	}
	if (!looksLikeEmail(email)) {
		throw error(400, 'That email address doesn’t look right.');
	}

	return { name, email, message, page };
}

/**
 * Honeypot check. Bots fill hidden fields, humans never see them. Callers should
 * pretend success when this returns true, so the bot has nothing to tune against.
 */
export function isBot(payload: Record<string, unknown>): boolean {
	return Boolean(asString(payload.company));
}
