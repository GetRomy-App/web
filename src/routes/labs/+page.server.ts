import type { PageServerLoad } from './$types';
import { getAllPosts } from '$lib/content';
import type { SeoData } from '$lib/seo';

export const prerender = true;

export const load: PageServerLoad = async () => {
	const allPosts = await getAllPosts();
	// Field-facing posts live on /blog. Labs is benchmarks / research only — no duplicates between the two.
	const posts = allPosts.filter((p) => p.has_benchmarks);

	const seo: SeoData = {
		title: 'Rōmy Labs — AI Donor Research Benchmarks, PIF-Bench Results & Blog',
		description:
			'Rōmy scored 94.6 on PIF-Bench vs. ChatGPT (79.9), Claude (92.2), and Gemini (76.0). See how purpose-built AI donor intelligence compares on accuracy, cost, and speed.',
		keywords:
			'donor research benchmark, AI prospect research comparison, nonprofit fundraising AI, wealth screening accuracy, PIF-Bench, donor intelligence cost comparison, ChatGPT vs Rōmy, prospect research tool, AI wealth screening benchmark',
		path: '/labs',
		type: 'website'
	};

	return { posts, seo };
};
