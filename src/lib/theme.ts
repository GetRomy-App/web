import { writable } from 'svelte/store';

export const isDark = writable(false);

export function toggleTheme() {
	isDark.update((v) => {
		const next = !v;
		if (typeof document !== 'undefined') {
			document.documentElement.classList.toggle('light', !next);
		}
		return next;
	});
}
