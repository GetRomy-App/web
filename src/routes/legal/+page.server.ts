import type { PageServerLoad } from './$types';
import { getAllLegalPages } from '$lib/legal';

export const prerender = true;

export const load: PageServerLoad = async () => {
	const pages = await getAllLegalPages();
	return { pages };
};
