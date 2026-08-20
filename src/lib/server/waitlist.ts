// Waitlist storage. The signup email to the team is the source of truth, but a
// list you can actually mail later needs to live somewhere — so every signup is
// also added to a Resend "audience" (https://resend.com/docs/api-reference/contacts).
// That keeps the roster in the same place the mail already goes, with an
// unsubscribe link handled for us when the announcement goes out.
//
// Optional env: RESEND_AUDIENCE_ID. Without it, storage is skipped and the
// signup still succeeds on the strength of the notification email.

import { env } from '$env/dynamic/private';

const AUDIENCE_ENDPOINT = 'https://api.resend.com/audiences';

export type WaitlistStorage = 'stored' | 'skipped' | 'failed';

/** Split a display name into the first / last pair Resend stores. */
function splitName(name: string): { firstName: string; lastName: string } {
	const parts = name.split(/\s+/).filter(Boolean);
	if (parts.length === 0) return { firstName: '', lastName: '' };
	return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

/**
 * Record a signup on the waitlist. Best-effort by design: a storage hiccup must
 * never cost us the signup, since the team is emailed either way.
 */
export async function addToWaitlist(
	apiKey: string,
	person: { name: string; email: string }
): Promise<WaitlistStorage> {
	const audienceId = env.RESEND_AUDIENCE_ID;
	if (!audienceId) return 'skipped';

	const { firstName, lastName } = splitName(person.name);

	try {
		const res = await fetch(`${AUDIENCE_ENDPOINT}/${encodeURIComponent(audienceId)}/contacts`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: person.email,
				first_name: firstName,
				last_name: lastName,
				unsubscribed: false
			})
		});

		if (!res.ok) {
			const detail = await res.text().catch(() => '');
			console.error(`[waitlist] Resend audience responded ${res.status}: ${detail}`);
			return 'failed';
		}

		return 'stored';
	} catch (err) {
		console.error('[waitlist] Network error adding contact to the audience:', err);
		return 'failed';
	}
}
