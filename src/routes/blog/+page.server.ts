import type { PageServerLoad } from './$types';
import { getAllPosts } from '$lib/content';
import { breadcrumbList, type SeoData } from '$lib/seo';

export const prerender = true;

export const load: PageServerLoad = async () => {
	const allPosts = await getAllPosts();
	// Benchmark / research posts live on /labs — keep /blog focused on field-facing writing.
	const posts = allPosts.filter((p) => !p.has_benchmarks);

	const seo: SeoData = {
		title: 'Rōmy Blog — Insights on AI Donor Research & Nonprofit Fundraising',
		description:
			'Technical deep-dives, research findings, and perspectives on nonprofit fundraising, prospect research, and purpose-built AI.',
		path: '/blog',
		keywords:
			'nonprofit fundraising blog, donor intelligence, prospect research, AI for nonprofits, fundraising insights, major donor prospecting, wealth screening, donor research, nonprofit technology',
		jsonLd: [
			{
				'@context': 'https://schema.org',
				'@type': 'Blog',
				name: 'Rōmy Blog',
				description:
					'Technical deep-dives, research findings, and perspectives on nonprofit fundraising, prospect research, and purpose-built AI.',
				url: 'https://getromy.app/blog',
				publisher: { '@type': 'Organization', name: 'GetRomy LLC' },
				blogPost: posts.slice(0, 20).map((post) => ({
					'@type': 'BlogPosting',
					headline: post.title,
					url: `https://getromy.app/blog/${post.slug}`,
					datePublished: post.date
				}))
			},
			breadcrumbList([
				{ name: 'Home', path: '/' },
				{ name: 'Blog', path: '/blog' }
			])
		]
	};

	return { posts, seo };
};
