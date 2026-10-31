import { getAllPosts } from '$lib/content';
import { SITE, metaDescription } from '$lib/seo';

export const prerender = true;

export async function GET() {
	const posts = await getAllPosts();
	const line = (p: (typeof posts)[number], base: string) =>
		`- [${p.title}](${SITE}${base}${p.slug}): ${metaDescription(p.excerpt, 140)}`;

	const blog = posts.filter((p) => !p.has_benchmarks).map((p) => line(p, '/blog/'));
	const labs = posts.filter((p) => p.has_benchmarks).map((p) => line(p, '/labs/blog/'));

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
- Twitter: https://x.com/RomyFindsMoney
- GitHub: https://github.com/GetRomy-App
- Contact: howard@getromy.app, solomon@getromy.app

## Research

- [Rōmy Labs](${SITE}/labs): PIF-Bench v2, an open, rubric-graded benchmark of AI systems on nonprofit development work
${labs.join('\n')}

## Blog

- [Rōmy Blog](${SITE}/blog): Field notes and perspectives on nonprofit fundraising, major gifts, and donor research
- [RSS feed](${SITE}/blog/rss.xml)
${blog.join('\n')}

## Trust and policies

- [Status](${SITE}/status)
- [Security](${SITE}/security)
- [Privacy](${SITE}/privacy)
- [Terms](${SITE}/terms)
- [Sub-processors](${SITE}/subprocessors)

## Company

GetRomy LLC
`;

	return new Response(body, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' }
	});
}
