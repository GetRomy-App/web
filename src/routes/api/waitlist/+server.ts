// Waitlist endpoint. The "Learn More" buttons across the site open a dialog that
// posts here. Each signup does three things:
//
//   1. emails the team (solomon@ + howard@) so a human sees it;
//   2. emails the person back to confirm they're on the list;
//   3. records them to the Resend audience, so the list survives the inbox.
//
// Only (1) is allowed to fail the request — the rest are best-effort, because a
// signup the team can see is a signup that worked.
//
// Required env: RESEND_API_KEY.
// Optional env: CONTACT_FROM_EMAIL, WAITLIST_TO_EMAILS (comma-separated;
//               defaults to the team), RESEND_AUDIENCE_ID.

import { json, error, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import {
	LIMITS,
	asString,
	isBot,
	readJsonBody,
	readPersonFields,
	recipientsFrom,
	requireApiKey,
	sendEmail,
	sendEmailQuietly,
	singleLine
} from '$lib/server/mail';
import { addToWaitlist } from '$lib/server/waitlist';

// This route is a server function, never prerendered.
export const prerender = false;

export const POST: RequestHandler = async ({ request }) => {
	const payload = await readJsonBody(request);

	// Honeypot — pretend success so the bot has nothing to tune against.
	if (isBot(payload)) {
		return json({ ok: true });
	}

	// A note is welcome on the waitlist but never required; an address is the
	// only thing we actually need to reach someone later.
	const { name, email, message, page } = readPersonFields(payload, { requireMessage: false });
	const organization = singleLine(asString(payload.organization));

	if (organization.length > LIMITS.organization) {
		throw error(400, 'One of the fields is a little too long — please shorten it.');
	}

	const apiKey = requireApiKey('waitlist');

	const teamText = [
		'New waitlist signup via getromy.app',
		'',
		`Name:  ${name}`,
		`Email: ${email}`,
		...(organization ? [`Org:   ${organization}`] : []),
		...(page ? [`Page:  ${page}`] : []),
		'',
		'Message:',
		message || '(no message left)',
		'',
		'—',
		'Reply to this email to respond directly to them.'
	].join('\n');

	// The one that must land: if the team never hears about it, it isn't a signup.
	await sendEmail(apiKey, 'waitlist', {
		to: recipientsFrom(env.WAITLIST_TO_EMAILS),
		replyTo: email,
		subject: `Waitlist signup from ${name}${organization ? ` (${organization})` : ''}`,
		text: teamText
	});

	// Everything past here is best-effort — the signup already counts.
	const storage = await addToWaitlist(apiKey, { name, email });
	if (storage === 'failed') {
		console.error(`[waitlist] ${email} was emailed in but not stored — add them by hand.`);
	}

	const firstName = name.split(' ')[0];
	await sendEmailQuietly(apiKey, 'waitlist', {
		to: [email],
		replyTo: 'solomon@getromy.app',
		subject: 'You’re on the list for the next version of Rōmy',
		text: [
			`Hi ${firstName},`,
			'',
			'Thanks for reaching out — you’re on the email list for the next version of Rōmy.',
			'',
			'We’ll write to you as soon as it’s ready to try, and we won’t use this address',
			'for anything else. If you have a question in the meantime, just reply to this',
			'email — it comes straight to us.',
			'',
			'— The Rōmy team',
			'https://getromy.app'
		].join('\n')
	});

	return json({ ok: true });
};
