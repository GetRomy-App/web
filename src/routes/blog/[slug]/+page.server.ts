import type { PageServerLoad } from './$types';
import { getPost, getAllPosts } from '$lib/content';
import { wordCount } from '$lib/seo';
import { error } from '@sveltejs/kit';

export const prerender = true;

export async function entries() {
	const posts = await getAllPosts();
	return posts.filter((p) => !p.has_benchmarks).map((p) => ({ slug: p.slug }));
}

export const load: PageServerLoad = async ({ params }) => {
	const post = await getPost(params.slug);
	if (!post || post.has_benchmarks) throw error(404, 'Post not found');

	// Internal links: up to three other posts, ranked by shared keywords, then same tag, then recency.
	const all = (await getAllPosts()).filter((p) => !p.has_benchmarks && p.slug !== post.slug);
	const mine = new Set(post.keywords.map((k) => k.toLowerCase()));
	const related = all
		.map((p) => ({
			p,
			score:
				p.keywords.filter((k) => mine.has(k.toLowerCase())).length * 10 +
				(p.tag === post.tag ? 1 : 0)
		}))
		.sort((a, b) => b.score - a.score || (a.p.date < b.p.date ? 1 : -1))
		.slice(0, 3)
		.map(({ p }) => ({ slug: p.slug, title: p.title, tag: p.tag, date: p.date }));

	return { post, related, wordCount: wordCount(post.content) };
};
