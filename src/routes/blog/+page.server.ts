import type { PageServerLoad } from './$types';
import { getAllPosts } from '$lib/content';

export const prerender = true;

export const load: PageServerLoad = async () => {
	const allPosts = await getAllPosts();
	// Benchmark / research posts live on /labs — keep /blog focused on field-facing writing.
	const posts = allPosts.filter((p) => !p.has_benchmarks);
	return {
		posts,
		seo: {
			title: 'Rōmy Blog — Insights on AI Donor Research & Nonprofit Fundraising',
			description:
				'Technical deep-dives, research findings, and perspectives on nonprofit fundraising, prospect research, and purpose-built AI.',
			keywords:
				'nonprofit fundraising blog, donor intelligence, prospect research, AI for nonprofits, fundraising insights, major donor research, wealth screening, nonprofit fundraising software',
			url: 'https://getromy.app/blog',
			type: 'website' as const
		}
	};
};
