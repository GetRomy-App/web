import { getAllPosts } from '$lib/content';
import { SITE_URL } from '$lib/seo';

export const prerender = true;

export async function GET() {
	const posts = await getAllPosts();
	const line = (base: string, p: (typeof posts)[number]) =>
		`- [${p.title}](${SITE_URL}${base}/${p.slug}): ${p.excerpt.replace(/\s+/g, ' ').trim()}`;

	const blog = posts.filter((p) => !p.has_benchmarks).map((p) => line('/blog', p));
	const labs = posts.filter((p) => p.has_benchmarks).map((p) => line('/labs/blog', p));

	const body = `# Rōmy

> Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions.

Rōmy is a donor intelligence platform built for small nonprofit teams. It uses AI-powered prospect research to surface wealth indicators, giving histories, and affinity signals — then distills them into actionable donor profiles. Rōmy is made by GetRomy LLC.

## Features

- Donor Discovery: AI-powered prospect research with wealth indicators, giving history, and affinity signals
- Fraction of the Cost: No enterprise contracts or per-seat licensing — donor intelligence at a price built for small nonprofits
- Ready to Act On: Every prospect comes with connection points, giving capacity, and outreach angles

## Key pages

- [Home](${SITE_URL}/): What Rōmy is and who it is for
- [Blog](${SITE_URL}/blog): Field notes on major donor prospecting, stewardship and fundraising
- [Rōmy Labs](${SITE_URL}/labs): PIF-Bench, an open rubric-graded benchmark of AI on nonprofit development work
- [Status](${SITE_URL}/status): Live operational status and uptime history
- [Security](${SITE_URL}/security): Security practices
- [Privacy](${SITE_URL}/privacy): Privacy policy
- [Legal](${SITE_URL}/legal): Terms, DPA, subprocessors and other legal documents

## Labs

${labs.join('\n') || '- (none yet)'}

## Blog

${blog.join('\n')}

## Links

- Product: https://intel.getromy.app
- Download (macOS): https://github.com/GetRomy-App/web/releases
- RSS: ${SITE_URL}/rss.xml
- Twitter: https://x.com/RomyFindsMoney
- GitHub: https://github.com/GetRomy-App
- Contact: howard@getromy.app, solomon@getromy.app

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
