import type { PageServerLoad } from './$types';
import { getPost } from '$lib/content';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const post = await getPost(params.slug);
	if (!post) throw error(404, 'Post not found');
	return { post };
};
