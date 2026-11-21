import type { PageServerLoad } from './$types';
import { getPost, getAllPosts } from '$lib/content';
import { error } from '@sveltejs/kit';
import { wordCountOf } from '$lib/seo';

export const prerender = true;

export async function entries() {
	const posts = await getAllPosts();
	return posts.filter((p) => p.has_benchmarks).map((p) => ({ slug: p.slug }));
}

export const load: PageServerLoad = async ({ params }) => {
	const post = await getPost(params.slug);
	if (!post || !post.has_benchmarks) throw error(404, 'Post not found');
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { source, ...rest } = post;
	return { post: { ...rest, wordCount: wordCountOf(post.content) } };
};
