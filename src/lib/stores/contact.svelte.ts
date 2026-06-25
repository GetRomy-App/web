// Global open/close state for the contact dialog, so any call-to-action — the
// navbar "Contact" link, the status page's "Report an issue" button, the
// landing CTA — can summon the same on-brand modal. The dialog itself is
// mounted once in the root layout (see +layout.svelte).

/** Tailors the dialog copy and the email subject line. */
export type ContactKind = 'contact' | 'issue';

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
	/** Open the dialog. `kind` switches between the general and issue-report copy. */
	show(kind: ContactKind = 'contact') {
		state.kind = kind;
		state.open = true;
	},
	hide() {
		state.open = false;
	}
};
