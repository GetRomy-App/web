import type { PageServerLoad } from './$types';
import { getPost, getAllPosts } from '$lib/content';
import { error } from '@sveltejs/kit';

export const prerender = true;

export async function entries() {
	const posts = await getAllPosts();
	return posts.filter((p) => !p.has_benchmarks).map((p) => ({ slug: p.slug }));
}

export const load: PageServerLoad = async ({ params }) => {
	const post = await getPost(params.slug);
	if (!post || post.has_benchmarks) throw error(404, 'Post not found');
	return {
		post,
		seo: {
			title: `${post.title} — Rōmy Blog`,
			description: post.excerpt,
			keywords: `donor intelligence, nonprofit fundraising, prospect research, AI donor research, wealth screening, ${post.tag.toLowerCase()}`,
			url: `https://getromy.app/blog/${post.slug}`,
			type: 'article' as const,
			publishedTime: post.date,
			section: post.tag
		}
	};
};
