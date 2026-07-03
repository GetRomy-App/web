import type { PageServerLoad } from './$types';
import { getPost, getAllPosts } from '$lib/content';
import { error } from '@sveltejs/kit';
import { breadcrumbList, keywordsFromTitle, type SeoData } from '$lib/seo';

export const prerender = true;

export async function entries() {
	const posts = await getAllPosts();
	return posts.filter((p) => !p.has_benchmarks).map((p) => ({ slug: p.slug }));
}

export const load: PageServerLoad = async ({ params }) => {
	const post = await getPost(params.slug);
	if (!post || post.has_benchmarks) throw error(404, 'Post not found');

	const postUrl = `https://getromy.app/blog/${post.slug}`;
	const keywords = keywordsFromTitle(post.title, [
		post.tag.toLowerCase(),
		'nonprofit fundraising',
		'donor intelligence',
		'prospect research',
		'major donor prospecting',
		'AI donor research'
	]);

	const seo: SeoData = {
		title: `${post.title} — Rōmy Blog`,
		description: post.excerpt,
		path: `/blog/${post.slug}`,
		type: 'article',
		keywords,
		article: {
			publishedTime: post.date,
			modifiedTime: post.date,
			section: post.tag,
			tag: post.tag
		},
		jsonLd: [
			{
				'@context': 'https://schema.org',
				'@type': 'BlogPosting',
				headline: post.title,
				description: post.excerpt,
				datePublished: post.date,
				dateModified: post.date,
				url: postUrl,
				mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
				keywords,
				articleSection: post.tag,
				image: 'https://getromy.app/og-image.jpg',
				author: { '@type': 'Organization', name: 'GetRomy LLC', url: 'https://getromy.app' },
				publisher: {
					'@type': 'Organization',
					name: 'GetRomy LLC',
					logo: { '@type': 'ImageObject', url: 'https://getromy.app/icon-logo.png' }
				}
			},
			breadcrumbList([
				{ name: 'Home', path: '/' },
				{ name: 'Blog', path: '/blog' },
				{ name: post.title, path: `/blog/${post.slug}` }
			])
		]
	};

	return { post, seo };
};
