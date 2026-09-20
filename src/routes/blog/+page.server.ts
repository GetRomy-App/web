import type { PageServerLoad } from './$types';
import type { SeoData } from '$lib/seo';
import { getAllPosts } from '$lib/content';

export const prerender = true;

const seo: SeoData = {
	title: 'Rōmy Blog — Insights on AI Donor Research & Nonprofit Fundraising',
	description:
		'Technical deep-dives, research findings, and perspectives on nonprofit fundraising, prospect research, and purpose-built AI.',
	path: '/blog',
	keywords:
		'nonprofit fundraising blog, donor intelligence, prospect research, AI for nonprofits, major donor prospecting, wealth screening, fundraising insights, Rōmy'
};

export const load: PageServerLoad = async () => {
	const allPosts = await getAllPosts();
	// Benchmark / research posts live on /labs — keep /blog focused on field-facing writing.
	const posts = allPosts.filter((p) => !p.has_benchmarks);
	return { posts, seo };
};
