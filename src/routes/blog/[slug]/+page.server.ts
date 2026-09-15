import type { PageServerLoad } from './$types';
import type { SeoData } from '$lib/seo';
import { articleJsonLd, breadcrumbJsonLd } from '$lib/seo';
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

	const path = `/blog/${post.slug}`;
	const seo: SeoData = {
		title: `${post.title} — Rōmy Blog`,
		description: post.excerpt,
		keywords: `donor intelligence, nonprofit fundraising, prospect research, AI donor research, wealth screening, ${post.tag.toLowerCase()}`,
		path,
		type: 'article',
		publishedTime: post.date,
		section: post.tag,
		jsonLd: [
			articleJsonLd({
				title: post.title,
				description: post.excerpt,
				path,
				datePublished: post.date,
				section: post.tag
			}),
			breadcrumbJsonLd([
				{ name: 'Home', path: '/' },
				{ name: 'Blog', path: '/blog' },
				{ name: post.title, path }
			])
		]
	};

	return { post, seo };
};
