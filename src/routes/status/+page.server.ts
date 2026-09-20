import type { PageServerLoad } from './$types';
import type { SeoData } from '$lib/seo';
import { loadStatusPageData } from '$lib/status';

export const prerender = true;

const seo: SeoData = {
	title: 'Status — Rōmy',
	description:
		'Live operational status and uptime history for Rōmy — the donor-intelligence app at intel.getromy.app and getromy.app.',
	path: '/status'
};

export const load: PageServerLoad = async () => {
	const data = await loadStatusPageData();
	return { ...data, seo };
};
