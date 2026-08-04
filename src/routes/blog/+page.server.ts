import type { PageServerLoad } from './$types';
import { getAllPosts } from '$lib/content';
import type { SeoData } from '$lib/seo';

export const prerender = true;

export const load: PageServerLoad = async () => {
	const allPosts = await getAllPosts();
	// Benchmark / research posts live on /labs — keep /blog focused on field-facing writing.
	const posts = allPosts.filter((p) => !p.has_benchmarks);

	const seo: SeoData = {
		title: 'Rōmy Blog — Insights on AI Donor Research & Nonprofit Fundraising',
		description:
			'Technical deep-dives, research findings, and perspectives on nonprofit fundraising, prospect research, and purpose-built AI.',
		keywords:
			'nonprofit fundraising blog, donor intelligence, prospect research, AI for nonprofits, fundraising insights, major donor prospecting, wealth screening, planned giving, development officer resources',
		path: '/blog',
		type: 'website'
	};

	return { posts, seo };
};
