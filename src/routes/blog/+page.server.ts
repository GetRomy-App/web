import type { PageServerLoad } from './$types';
import { getAllPosts } from '$lib/content';
import { BLOG_ID, BLOG_OG_IMAGE, ORG_ID, SITE_URL, breadcrumbJsonLd } from '$lib/seo';

export const prerender = true;

const TITLE = 'Nonprofit Fundraising Blog: Major Gifts & Prospect Research | Rōmy';
const DESCRIPTION =
	'Field notes and research on major gift fundraising, prospect research, donor stewardship, planned giving and AI donor intelligence for small nonprofits.';

export const load: PageServerLoad = async () => {
	const allPosts = await getAllPosts();
	// Benchmark / research posts live on /labs — keep /blog focused on field-facing writing.
	const posts = allPosts.filter((p) => !p.has_benchmarks);

	const seo = {
		title: TITLE,
		socialTitle: 'The Rōmy Blog — Field Notes on Fundraising & Donor Research',
		description: DESCRIPTION,
		path: '/blog',
		image: BLOG_OG_IMAGE,
		keywords: [
			'nonprofit fundraising blog',
			'major gift fundraising',
			'prospect research',
			'donor stewardship',
			'planned giving',
			'wealth screening',
			'donor retention',
			'small nonprofit fundraising',
			'AI for nonprofits'
		],
		jsonLd: [
			{
				'@context': 'https://schema.org',
				'@type': 'Blog',
				'@id': BLOG_ID,
				name: 'Rōmy Blog',
				url: `${SITE_URL}/blog`,
				description: DESCRIPTION,
				inLanguage: 'en-US',
				publisher: { '@id': ORG_ID },
				blogPost: posts.map((p) => ({
					'@type': 'BlogPosting',
					headline: p.title,
					url: `${SITE_URL}/blog/${p.slug}`,
					datePublished: p.date,
					description: p.seo_description || undefined,
					keywords: p.keywords.join(', ') || undefined
				}))
			},
			breadcrumbJsonLd([
				{ name: 'Rōmy', path: '/' },
				{ name: 'Blog', path: '/blog' }
			])
		]
	};

	return { posts, seo };
};
