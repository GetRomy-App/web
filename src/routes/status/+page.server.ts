import type { PageServerLoad } from './$types';
import { loadStatusPageData } from '$lib/status';
import type { SeoData } from '$lib/seo';

export const prerender = true;

const seo: SeoData = {
	title: 'Status — Rōmy',
	description:
		'Live operational status and uptime history for Rōmy — the donor-intelligence app at intel.getromy.app and getromy.app.',
	path: '/status',
	type: 'website'
};

export const load: PageServerLoad = async () => {
	const data = await loadStatusPageData();
	return { ...data, seo };
};
