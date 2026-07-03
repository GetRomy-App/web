import type { PageServerLoad } from './$types';
import { getLegalPage } from '$lib/legal';
import { error } from '@sveltejs/kit';
import { breadcrumbList, type SeoData } from '$lib/seo';

export const prerender = true;

export const load: PageServerLoad = async () => {
	const page = await getLegalPage('aup');
	if (!page) throw error(404, 'Page not found');

	const seo: SeoData = {
		title: `${page.title} — Rōmy`,
		description: page.description,
		path: '/aup',
		robots: 'index, follow',
		jsonLd: [
			breadcrumbList([
				{ name: 'Home', path: '/' },
				{ name: 'Legal', path: '/legal' },
				{ name: page.title, path: '/aup' }
			])
		]
	};

	return { page, seo };
};
