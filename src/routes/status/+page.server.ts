import type { PageServerLoad } from './$types';
import { loadStatusPageData } from '$lib/status';

export const prerender = true;

export const load: PageServerLoad = async () => {
	return await loadStatusPageData();
};
