import type { PageServerLoad } from './$types';
import { getAllPosts } from '$lib/content';

export const load: PageServerLoad = async () => {
	const posts = await getAllPosts();
	return { posts };
};
