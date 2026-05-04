import type { PageServerLoad } from './$types';
import { getLegalPage } from '$lib/legal';
import { error } from '@sveltejs/kit';

export const prerender = true;

export const load: PageServerLoad = async () => {
	const page = await getLegalPage('security');
	if (!page) throw error(404, 'Page not found');
	return { page };
};
