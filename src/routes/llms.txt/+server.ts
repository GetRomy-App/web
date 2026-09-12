import { getAllPosts } from '$lib/content';

export const prerender = true;

const SITE = 'https://getromy.app';

function formatDate(value: string): string {
	const d = new Date(value);
	if (isNaN(d.getTime())) return '';
	return d.toISOString().slice(0, 10);
}

export async function GET() {
	const allPosts = await getAllPosts();
	const blogPosts = allPosts.filter((p) => !p.has_benchmarks);
	const labsPosts = allPosts.filter((p) => p.has_benchmarks);

	const blogLines = blogPosts
		.map((p) => `- [${p.title}](${SITE}/blog/${p.slug}) (${formatDate(p.date)}): ${p.excerpt}`)
		.join('\n');

	const labsLines = labsPosts
		.map((p) => `- [${p.title}](${SITE}/labs/blog/${p.slug}) (${formatDate(p.date)}): ${p.excerpt}`)
		.join('\n');

	const body = `# Rōmy

> Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions.

Rōmy is a donor intelligence platform built for small nonprofit teams. It uses AI-powered prospect research to surface wealth indicators, giving histories, and affinity signals — then distills them into actionable donor profiles.

## Features

- Donor Discovery: AI-powered prospect research with wealth indicators, giving history, and affinity signals
- Fraction of the Cost: No enterprise contracts or per-seat licensing — donor intelligence at a price built for small nonprofits
- Ready to Act On: Every prospect comes with connection points, giving capacity, and outreach angles

## Topics

Rōmy writes about nonprofit fundraising, major donor prospecting, prospect research, wealth screening, donor retention, planned giving, and AI-powered donor intelligence for small nonprofit teams.

## Links

- Website: ${SITE}
- Product: https://intel.getromy.app
- Blog: ${SITE}/blog
- Labs (benchmarks & research): ${SITE}/labs
- Sitemap: ${SITE}/sitemap.xml
- Download (macOS): https://github.com/GetRomy-App/web/releases
- Twitter: https://x.com/RomyFindsMoney
- GitHub: https://github.com/GetRomy-App
- Contact: howard@getromy.app, solomon@getromy.app

## Blog (${blogPosts.length} posts, most recent first)

${blogLines}

## Labs — Benchmarks & Research (${labsPosts.length} posts)

${labsLines}

## Company

GetRomy LLC
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=0, s-maxage=3600'
		}
	});
}
