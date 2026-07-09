import { getAllPosts } from '$lib/content';
import type { RequestHandler } from './$types';

export const prerender = true;

const SITE_URL = 'https://getromy.app';

export const GET: RequestHandler = async () => {
	const posts = await getAllPosts();
	const fieldPosts = posts.filter((p) => !p.has_benchmarks);
	const labsPosts = posts.filter((p) => p.has_benchmarks);

	const postLine = (p: (typeof posts)[number], base: string) =>
		`- [${p.title}](${SITE_URL}${base}/${p.slug}): ${p.excerpt}`;

	const body = `# Rōmy

> Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions.

Rōmy is a donor intelligence platform built for small nonprofit teams. It uses AI-powered prospect research to surface wealth indicators, giving histories, and affinity signals — then distills them into actionable donor profiles.

## Features

- Donor Discovery: AI-powered prospect research with wealth indicators, giving history, and affinity signals
- Fraction of the Cost: No enterprise contracts or per-seat licensing — donor intelligence at a price built for small nonprofits
- Ready to Act On: Every prospect comes with connection points, giving capacity, and outreach angles

## Links

- Website: ${SITE_URL}
- Product: https://intel.getromy.app
- Download (macOS): https://github.com/GetRomy-App/web/releases
- Sitemap: ${SITE_URL}/sitemap.xml
- Twitter: https://x.com/RomyFindsMoney
- GitHub: https://github.com/GetRomy-App
- Contact: howard@getromy.app, solomon@getromy.app

## Blog

Writing and research on nonprofit fundraising, prospect research, and donor intelligence: ${SITE_URL}/blog

${fieldPosts.map((p) => postLine(p, '/blog')).join('\n')}

## Labs

Benchmarks and technical research comparing Rōmy to general-purpose AI and enterprise wealth-screening tools: ${SITE_URL}/labs

${labsPosts.map((p) => postLine(p, '/labs/blog')).join('\n')}

## Company

GetRomy LLC
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8'
		}
	});
};
