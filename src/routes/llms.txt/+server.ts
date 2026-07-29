import { getAllPosts } from '$lib/content';

export const prerender = true;

const SITE_URL = 'https://getromy.app';

export async function GET() {
	const posts = await getAllPosts();
	const blogPosts = posts.filter((p) => !p.has_benchmarks);
	const labsPosts = posts.filter((p) => p.has_benchmarks);

	const blogList = blogPosts
		.map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.excerpt}`)
		.join('\n');

	const labsList = labsPosts
		.map((p) => `- [${p.title}](${SITE_URL}/labs/blog/${p.slug}): ${p.excerpt}`)
		.join('\n');

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
- Twitter: https://x.com/RomyFindsMoney
- GitHub: https://github.com/GetRomy-App
- Contact: howard@getromy.app, solomon@getromy.app

## Blog

Field notes and essays on nonprofit fundraising, donor research, and major gifts.

${blogList}

## Research

Benchmarks and technical write-ups on Rōmy's AI donor research (PIF-Bench and related work).

${labsList}

## Company

GetRomy LLC
`;

	return new Response(body, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' }
	});
}
