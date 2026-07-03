import type { PageServerLoad } from './$types';
import { getAllPosts } from '$lib/content';
import { breadcrumbList, type SeoData } from '$lib/seo';

export const prerender = true;

export const load: PageServerLoad = async () => {
	const allPosts = await getAllPosts();
	// Field-facing posts live on /blog. Labs is benchmarks / research only — no duplicates between the two.
	const posts = allPosts.filter((p) => p.has_benchmarks);

	const seo: SeoData = {
		title: 'Rōmy Labs — AI Donor Research Benchmarks, PIF-Bench Results & Blog',
		description:
			'Rōmy scored 94.6 on PIF-Bench vs. ChatGPT (79.9), Claude (92.2), and Gemini (76.0). See how purpose-built AI donor intelligence compares on accuracy, cost, and speed.',
		path: '/labs',
		keywords:
			'donor research benchmark, AI prospect research comparison, nonprofit fundraising AI, wealth screening accuracy, PIF-Bench, donor intelligence cost comparison, ChatGPT vs Rōmy, prospect research tool, AI donor research, nonprofit fundraising technology',
		jsonLd: [
			{
				'@context': 'https://schema.org',
				'@type': 'CollectionPage',
				name: 'Rōmy Labs — AI Donor Research Benchmarks',
				description:
					'PIF-Bench results comparing Rōmy, Claude, ChatGPT, and Gemini on AI-powered donor prospect research accuracy, cost, and speed.',
				url: 'https://getromy.app/labs'
			},
			breadcrumbList([
				{ name: 'Home', path: '/' },
				{ name: 'Labs', path: '/labs' }
			])
		]
	};

	return { posts, seo };
};
