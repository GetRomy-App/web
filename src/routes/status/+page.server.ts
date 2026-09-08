import type { PageServerLoad } from './$types';
import { loadStatusPageData } from '$lib/status';

export const prerender = true;

export const load: PageServerLoad = async () => {
	const data = await loadStatusPageData();
	return {
		...data,
		seo: {
			title: 'Status — Rōmy',
			description:
				'Live operational status and uptime history for Rōmy — the donor-intelligence app at intel.getromy.app and getromy.app.',
			url: 'https://getromy.app/status',
			type: 'website' as const
		}
	};
};
