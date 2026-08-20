// Contact / "report an issue" endpoint. Takes a JSON payload from the contact
// modal, validates it, and sends a plain-text email via the Resend HTTP API to
// the team. `reply_to` is set to the sender so a reply in the inbox goes
// straight back to them.
//
// Waitlist signups are a different shape and live at /api/waitlist.
//
// Required env: RESEND_API_KEY.
// Optional env: CONTACT_FROM_EMAIL (must be a Resend-verified sender),
//               CONTACT_TO_EMAILS (comma-separated; defaults to the team).

import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import {
	isBot,
	readJsonBody,
	readPersonFields,
	recipientsFrom,
	requireApiKey,
	sendEmail
} from '$lib/server/mail';

// This route is a server function, never prerendered.
export const prerender = false;

export const POST: RequestHandler = async ({ request }) => {
	const payload = await readJsonBody(request);

	// Honeypot: bots fill hidden fields, humans never see them. Pretend success
	// so the bot has nothing to tune against.
	if (isBot(payload)) {
		return json({ ok: true });
	}

	const { name, email, message, page } = readPersonFields(payload);
	const kind = payload.kind === 'issue' ? 'issue' : 'contact';

	const apiKey = requireApiKey('contact');

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

	await sendEmail(apiKey, 'contact', {
		to: recipientsFrom(env.CONTACT_TO_EMAILS),
		replyTo: email,
		subject,
		text
	});

	return json({ ok: true });
};
