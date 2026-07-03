import type { PageServerLoad } from './$types';
import { loadStatusPageData } from '$lib/status';
import { breadcrumbList, type SeoData } from '$lib/seo';

export const prerender = true;

export const load: PageServerLoad = async () => {
	const data = await loadStatusPageData();

	const seo: SeoData = {
		title: 'Status — Rōmy',
		description:
			'Live operational status and uptime history for Rōmy — the donor-intelligence app at intel.getromy.app and getromy.app.',
		path: '/status',
		robots: 'index, follow',
		jsonLd: [
			breadcrumbList([
				{ name: 'Home', path: '/' },
				{ name: 'Status', path: '/status' }
			])
		]
	};

	return { ...data, seo };
};
