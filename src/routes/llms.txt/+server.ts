import { getAllPosts } from '$lib/content';

export const prerender = true;

const SITE = 'https://getromy.app';

export async function GET() {
	const allPosts = await getAllPosts();
	const blogPosts = allPosts.filter((p) => !p.has_benchmarks);
	const labsPosts = allPosts.filter((p) => p.has_benchmarks);

	const blogList = blogPosts
		.map((p) => `- [${p.title}](${SITE}/blog/${p.slug}): ${p.excerpt}`)
		.join('\n');

	const labsList = labsPosts
		.map((p) => `- [${p.title}](${SITE}/labs/blog/${p.slug}): ${p.excerpt}`)
		.join('\n');

	const body = `# Rōmy

> Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions.

Rōmy is a donor intelligence platform built for small nonprofit teams. It uses AI-powered prospect research to surface wealth indicators, giving histories, and affinity signals — then distills them into actionable donor profiles.

## Features

- Donor Discovery: AI-powered prospect research with wealth indicators, giving history, and affinity signals
- Fraction of the Cost: No enterprise contracts or per-seat licensing — donor intelligence at a price built for small nonprofits
- Ready to Act On: Every prospect comes with connection points, giving capacity, and outreach angles

## Links

- Website: ${SITE}
- Product: https://intel.getromy.app
- Download (macOS): https://github.com/GetRomy-App/web/releases
- Blog: ${SITE}/blog
- Labs (benchmarks): ${SITE}/labs
- Twitter: https://x.com/RomyFindsMoney
- GitHub: https://github.com/GetRomy-App
- Contact: howard@getromy.app, solomon@getromy.app

## Company

GetRomy LLC

## Blog

Field-facing writing on nonprofit fundraising, donor relations, and prospect research.

${blogList}

## Labs

Benchmarks and research on AI-powered donor prospect research (PIF-Bench).

${labsList}
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=0, s-maxage=3600'
		}
	});
}
