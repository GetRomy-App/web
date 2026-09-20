import type { PageServerLoad } from './$types';
import type { SeoData } from '$lib/seo';
import { getAllLegalPages } from '$lib/legal';

export const prerender = true;

const seo: SeoData = {
	title: 'Legal — Rōmy',
	description:
		'Privacy policy, terms, sub-processors, and other legal documents for Rōmy by GetRomy LLC.',
	path: '/legal'
};

export const load: PageServerLoad = async () => {
	const pages = await getAllLegalPages();
	return { pages, seo };
};
