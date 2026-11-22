import type { PageServerLoad } from './$types';
import { getAllPosts } from '$lib/content';
import { PIF_REPO } from '$lib/benchmarks';
import { LABS_OG_IMAGE, ORG_ID, SITE_URL, breadcrumbJsonLd } from '$lib/seo';

export const prerender = true;

const DESCRIPTION =
	'PIF-Bench v2 grades AI systems on 25 real development-office tasks with 331 pass/fail checks, graded blind. Claude.ai met 83%, Rōmy 74%, Gemini 67%, ChatGPT 60%.';

export const load: PageServerLoad = async () => {
	const allPosts = await getAllPosts();
	// Field-facing posts live on /blog. Labs is benchmarks / research only — no duplicates between the two.
	const posts = allPosts.filter((p) => p.has_benchmarks);

	const seo = {
		title: 'PIF-Bench v2: AI Benchmark for Nonprofit Prospect Research | Rōmy Labs',
		socialTitle: 'Rōmy Labs — PIF-Bench v2',
		description: DESCRIPTION,
		path: '/labs',
		image: LABS_OG_IMAGE,
		keywords: [
			'AI prospect research benchmark',
			'donor research benchmark',
			'AI for nonprofit fundraising',
			'PIF-Bench',
			'ChatGPT vs Claude vs Gemini',
			'rubric-graded benchmark',
			'gift compliance AI',
			'prospect research tool comparison'
		],
		jsonLd: [
			{
				'@context': 'https://schema.org',
				'@type': 'Dataset',
				name: 'PIF-Bench v2',
				description: DESCRIPTION,
				url: `${SITE_URL}/labs`,
				creator: { '@id': ORG_ID },
				publisher: { '@id': ORG_ID },
				isAccessibleForFree: true,
				keywords: [
					'AI benchmark',
					'prospect research',
					'nonprofit development',
					'fundraising',
					'LLM evaluation'
				],
				sameAs: PIF_REPO
			},
			breadcrumbJsonLd([
				{ name: 'Rōmy', path: '/' },
				{ name: 'Labs', path: '/labs' }
			])
		]
	};

	return { posts, seo };
};
