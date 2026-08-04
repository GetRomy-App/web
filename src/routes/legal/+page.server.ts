import type { PageServerLoad } from './$types';
import { getAllLegalPages } from '$lib/legal';
import type { SeoData } from '$lib/seo';

export const prerender = true;

export const load: PageServerLoad = async () => {
	const pages = await getAllLegalPages();

	const seo: SeoData = {
		title: 'Legal — Rōmy',
		description: 'Privacy policy, terms, sub-processors, and other legal documents for Rōmy by GetRomy LLC.',
		path: '/legal',
		type: 'website'
	};

	return { pages, seo };
};
