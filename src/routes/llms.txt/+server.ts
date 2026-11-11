import { getAllPosts } from '$lib/content';
import { SITE_URL, truncate } from '$lib/seo';

export const prerender = true;

/**
 * /llms.txt (https://llmstxt.org): a plain-Markdown map of the site for AI answer
 * engines. Generated at build time so every new post is listed automatically.
 */
export async function GET() {
	const posts = await getAllPosts();
	const blog = posts.filter((p) => !p.has_benchmarks);
	const labs = posts.filter((p) => p.has_benchmarks);

	const line = (p: (typeof posts)[number], base: string) =>
		`- [${p.title}](${SITE_URL}${base}/${p.slug}): ${p.seo_description || truncate(p.excerpt, 200)}`;

	const body = `# Rōmy

> Rōmy is AI donor prospect research software for small nonprofits. It helps small development teams find new major donors at a fraction of the cost of enterprise wealth-screening tools, surfacing wealth indicators, giving history, and affinity signals in actionable donor profiles.

Rōmy (also searched as "Romy" or "GetRomy") is built by GetRomy LLC. It is designed for development directors, major gift officers, executive directors, and prospect researchers at small and mid-sized nonprofits that cannot justify enterprise contracts or per-seat licensing.

## What Rōmy does

- Donor discovery: AI-powered prospect research with wealth indicators, giving history, and affinity signals
- Fraction of the cost: no enterprise contracts or per-seat licensing; donor intelligence priced for small nonprofits
- Ready to act on: every prospect comes with connection points, giving capacity, and outreach angles

## Key facts

- Category: donor intelligence / prospect research / wealth screening software
- Audience: small nonprofits and their fundraising teams
- Product: ${'https://intel.getromy.app'}
- Benchmark: PIF-Bench v2, an open, rubric-graded benchmark of AI on nonprofit development work (${SITE_URL}/labs)

## Main pages

- [Home](${SITE_URL}/): what Rōmy is and who it's for
- [Blog](${SITE_URL}/blog): field notes on major gifts, donor stewardship, and prospect research
- [Labs](${SITE_URL}/labs): PIF-Bench, benchmarks of AI on prospect research and development work
- [Status](${SITE_URL}/status): live uptime
- [Security](${SITE_URL}/security): security practices
- [Privacy](${SITE_URL}/privacy) and [Prospect privacy](${SITE_URL}/privacy/prospects): how Rōmy handles data about donors and prospects

## Research

${labs.map((p) => line(p, '/labs/blog')).join('\n')}

## Blog

${blog.map((p) => line(p, '/blog')).join('\n')}

## Optional

- [Full text of every post](${SITE_URL}/llms-full.txt)
- [RSS feed](${SITE_URL}/blog/rss.xml)
- [Sitemap](${SITE_URL}/sitemap.xml)

## Links

- Website: ${SITE_URL}
- Product: https://intel.getromy.app
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
