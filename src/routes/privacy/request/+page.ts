import type { SeoData } from '$lib/seo';

export const prerender = true;

export const load = () => {
	const seo: SeoData = {
		title: 'Privacy rights request — Rōmy',
		description:
			'Submit a request to access, erase, correct, or object to processing of your personal data held by Rōmy (GetRomy LLC).',
		path: '/privacy/request',
		type: 'website'
	};

	return { seo };
};
