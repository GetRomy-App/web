import type { PageServerLoad } from './$types';
import type { SeoData } from '$lib/seo';
import { getPost, getAllPosts } from '$lib/content';
import { error } from '@sveltejs/kit';

export const prerender = true;

export async function entries() {
	const posts = await getAllPosts();
	return posts.filter((p) => p.has_benchmarks).map((p) => ({ slug: p.slug }));
}

export const load: PageServerLoad = async ({ params }) => {
	const post = await getPost(params.slug);
	if (!post || !post.has_benchmarks) throw error(404, 'Post not found');

	const seo: SeoData = {
		title: `${post.title} — Rōmy Labs`,
		description: post.excerpt,
		path: `/labs/blog/${post.slug}`,
		type: 'article',
		keywords: `donor intelligence, nonprofit fundraising, prospect research, AI donor research, wealth screening, PIF-Bench, ${post.tag.toLowerCase()}`
	};

	return { post, seo };
};
