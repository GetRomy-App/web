import type { SeoData } from '$lib/seo';

export const prerender = true;

const seo: SeoData = {
	title: 'Privacy rights request — Rōmy',
	description:
		'Submit a request to access, erase, correct, or object to processing of your personal data held by Rōmy (GetRomy LLC).',
	path: '/privacy/request'
};

export function load() {
	return { seo };
}
