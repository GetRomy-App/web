import type { PageServerLoad } from './$types';
import { getPost, getAllPosts, getRelatedPosts } from '$lib/content';
import { error } from '@sveltejs/kit';

export const prerender = true;

export async function entries() {
	const posts = await getAllPosts();
	return posts.filter((p) => p.has_benchmarks).map((p) => ({ slug: p.slug }));
}

export const load: PageServerLoad = async ({ params }) => {
	const post = await getPost(params.slug);
	if (!post || !post.has_benchmarks) throw error(404, 'Post not found');
	// Labs has few posts of its own, so related reading points at the field-facing blog.
	const pool = (await getAllPosts()).filter((p) => !p.has_benchmarks);
	const related = getRelatedPosts(post, pool).map(({ slug, title, tag, date }) => ({
		slug,
		title,
		tag,
		date
	}));
	return { post, related };
};
