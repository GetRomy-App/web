import type { PageServerLoad } from './$types';
import { getPost, getAllPosts } from '$lib/content';
import { postSeo, relatedPosts } from '$lib/seo';
import { error } from '@sveltejs/kit';

export const prerender = true;

export async function entries() {
	const posts = await getAllPosts();
	return posts.filter((p) => !p.has_benchmarks).map((p) => ({ slug: p.slug }));
}

export const load: PageServerLoad = async ({ params }) => {
	const post = await getPost(params.slug);
	if (!post || post.has_benchmarks) throw error(404, 'Post not found');
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { source, ...rest } = post;
	const all = (await getAllPosts()).filter((p) => !p.has_benchmarks);
	const related = relatedPosts(post, all).map(({ slug, title, tag, date }) => ({
		slug,
		title,
		tag,
		date
	}));
	return { post: rest, related, seo: postSeo(post, 'blog') };
};
