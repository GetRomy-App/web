// Global open/close state for the contact dialog, so any call-to-action — the
// navbar "Contact" link, the status page's "Report an issue" button, the
// "Learn More" buttons that open the waitlist — can summon the same on-brand
// modal. The dialog itself is mounted once in the root layout (see
// +layout.svelte).

/** Tailors the dialog copy, where it posts, and the email subject line. */
export type ContactKind = 'contact' | 'issue' | 'waitlist';

const state = $state<{ open: boolean; kind: ContactKind }>({
	open: false,
	kind: 'contact'
});

export const contactModal = {
	get open() {
		return state.open;
	},
	get kind() {
		return state.kind;
	},
	/** Open the dialog. `kind` switches between the contact, issue and waitlist copy. */
	show(kind: ContactKind = 'contact') {
		state.kind = kind;
		state.open = true;
	},
	/** Shorthand for the site-wide "Learn More" call to action. */
	showWaitlist() {
		state.kind = 'waitlist';
		state.open = true;
	},
	hide() {
		state.open = false;
	}
};
