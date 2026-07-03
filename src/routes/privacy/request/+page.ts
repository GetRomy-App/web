import type { PageLoad } from './$types';
import { breadcrumbList, type SeoData } from '$lib/seo';

export const prerender = true;

export const load: PageLoad = async () => {
	const seo: SeoData = {
		title: 'Privacy rights request — Rōmy',
		description:
			'Submit a request to access, erase, correct, or object to processing of your personal data held by Rōmy (GetRomy LLC).',
		path: '/privacy/request',
		robots: 'index, follow',
		jsonLd: [
			breadcrumbList([
				{ name: 'Home', path: '/' },
				{ name: 'Legal', path: '/legal' },
				{ name: 'Privacy rights request', path: '/privacy/request' }
			])
		]
	};

	return { seo };
};
