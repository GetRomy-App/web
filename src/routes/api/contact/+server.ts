// Contact / "report an issue" endpoint. Takes a JSON payload from the contact
// modal, validates it, and sends a plain-text email via the Resend HTTP API to
// the team. `reply_to` is set to the sender so a reply in the inbox goes
// straight back to them.
//
// Required env: RESEND_API_KEY.
// Optional env: CONTACT_FROM_EMAIL (must be a Resend-verified sender),
//               CONTACT_TO_EMAILS (comma-separated; defaults to the team).

import { json, error, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

// This route is a server function, never prerendered.
export const prerender = false;

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const DEFAULT_FROM = 'Rōmy <noreply@letters.getromy.app>';
const DEFAULT_TO = ['solomon@getromy.app', 'howard@getromy.app'];

const LIMITS = { name: 120, email: 200, message: 5000 } as const;

function asString(value: unknown): string {
	return typeof value === 'string' ? value.trim() : '';
}

/** Collapse a value to a single line — for fields that land in headers/subjects. */
function singleLine(value: string): string {
	return value
		.replace(/[\r\n\t]+/g, ' ')
		.replace(/\s{2,}/g, ' ')
		.trim();
}

/** Permissive shape check; the real test of an address is whether a reply lands. */
function looksLikeEmail(value: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function recipients(): string[] {
	const configured = (env.CONTACT_TO_EMAILS ?? '')
		.split(',')
		.map((entry) => entry.trim())
		.filter(Boolean);
	return configured.length > 0 ? configured : DEFAULT_TO;
}

export const POST: RequestHandler = async ({ request }) => {
	let payload: Record<string, unknown>;
	try {
		payload = await request.json();
	} catch {
		throw error(400, 'Expected a JSON body.');
	}

	// Honeypot: bots fill hidden fields, humans never see them. Pretend success
	// so the bot has nothing to tune against.
	if (asString(payload.company)) {
		return json({ ok: true });
	}

	const name = singleLine(asString(payload.name));
	const email = singleLine(asString(payload.email));
	const message = asString(payload.message);
	const kind = payload.kind === 'issue' ? 'issue' : 'contact';
	const page = singleLine(asString(payload.page)).slice(0, 300);

	if (!name || !email || !message) {
		throw error(400, 'Please add your name, email, and a message.');
	}
	if (name.length > LIMITS.name || email.length > LIMITS.email || message.length > LIMITS.message) {
		throw error(400, 'One of the fields is a little too long — please shorten it.');
	}
	if (!looksLikeEmail(email)) {
		throw error(400, 'That email address doesn’t look right.');
	}

	const apiKey = env.RESEND_API_KEY;
	if (!apiKey) {
		console.error('[contact] RESEND_API_KEY is not set — cannot send email.');
		throw error(500, 'The contact form isn’t configured yet. Please email solomon@getromy.app.');
	}

	const subject =
		kind === 'issue' ? `Issue report from ${name}` : `New contact message from ${name}`;

	const text = [
		kind === 'issue' ? 'New issue report via getromy.app' : 'New contact message via getromy.app',
		'',
		`Name:  ${name}`,
		`Email: ${email}`,
		...(page ? [`Page:  ${page}`] : []),
		'',
		'Message:',
		message,
		'',
		'—',
		'Reply to this email to respond directly to the sender.'
	].join('\n');

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
				to: recipients(),
				reply_to: email,
				subject,
				text
			})
		});
	} catch (err) {
		console.error('[contact] Network error talking to Resend:', err);
		throw error(502, 'We couldn’t send your message just now. Please try again in a moment.');
	}

	if (!res.ok) {
		const detail = await res.text().catch(() => '');
		console.error(`[contact] Resend responded ${res.status}: ${detail}`);
		throw error(502, 'We couldn’t send your message just now. Please try again in a moment.');
	}

	return json({ ok: true });
};
