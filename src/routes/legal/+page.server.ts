import type { PageServerLoad } from './$types';
import { getAllLegalPages } from '$lib/legal';

export const prerender = true;

export const load: PageServerLoad = async () => {
	const pages = await getAllLegalPages();
	return {
		pages,
		seo: {
			title: 'Legal — Rōmy',
			description:
				'Privacy policy, terms, sub-processors, and other legal documents for Rōmy by GetRomy LLC.',
			url: 'https://getromy.app/legal',
			type: 'website' as const
		}
	};
};
