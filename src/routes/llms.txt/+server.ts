import { getAllPosts } from '$lib/content';

export const prerender = true;

const SITE = 'https://getromy.app';

/** Collapse whitespace so an excerpt stays on one line of the markdown list. */
function oneLine(value: string): string {
	return value.replace(/\s+/g, ' ').trim();
}

export async function GET() {
	const posts = await getAllPosts();
	const blog = posts.filter((p) => !p.has_benchmarks);
	const labs = posts.filter((p) => p.has_benchmarks);

	const line = (base: string, p: (typeof posts)[number]) =>
		`- [${oneLine(p.title)}](${SITE}${base}/${p.slug}): ${oneLine(p.excerpt)}`;

	const body = `# Rōmy

> Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions. It is a donor intelligence and prospect research platform built for small fundraising teams, made by GetRomy LLC.

Rōmy uses AI-powered prospect research to surface wealth indicators, giving histories, and affinity signals, then distills them into actionable donor profiles. There are no enterprise contracts or per-seat licensing.

## Product

- Donor Discovery: AI-powered prospect research with wealth indicators, giving history, and affinity signals
- Fraction of the Cost: No enterprise contracts or per-seat licensing; donor intelligence at a price built for small nonprofits
- Ready to Act On: Every prospect comes with connection points, giving capacity, and outreach angles

## Key pages

- [Home](${SITE}/): Product overview
- [Rōmy app](https://intel.getromy.app): The donor intelligence product
- [Blog](${SITE}/blog): Field notes on major gifts, donor research, and nonprofit fundraising
- [Labs](${SITE}/labs): PIF-Bench, an open rubric-graded benchmark of AI on nonprofit development work
- [Status](${SITE}/status): Live uptime for the app and this site
- [Security](${SITE}/security): Security practices
- [Privacy](${SITE}/privacy): Privacy policy
- [Terms](${SITE}/terms): Terms of service
- [Sub-processors](${SITE}/subprocessors): Sub-processor list

## Labs

${labs.map((p) => line('/labs/blog', p)).join('\n')}

## Blog

${blog.map((p) => line('/blog', p)).join('\n')}

## Links

- Sitemap: ${SITE}/sitemap.xml
- RSS: ${SITE}/blog/rss.xml
- Download (macOS): https://github.com/GetRomy-App/web/releases
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
