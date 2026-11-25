import { getAllPosts } from '$lib/content';
import { SITE_URL } from '$lib/seo';

export const prerender = true;

/**
 * llms.txt (https://llmstxt.org) — a plain-Markdown map of the site for AI
 * answer engines. Generated at build time so every post is always listed.
 */
export async function GET() {
	const posts = await getAllPosts();
	const labs = posts.filter((p) => p.has_benchmarks);
	const blog = posts.filter((p) => !p.has_benchmarks);
	const line = (base: string, p: (typeof posts)[number]) =>
		`- [${p.title}](${SITE_URL}${base}${p.slug}): ${p.seo_description.replace(/\s+/g, ' ').trim()}`;

	const body = `# Rōmy

> Rōmy is an AI donor intelligence and prospect research platform that helps small nonprofits find new major donors at a fraction of the cost of enterprise wealth-screening tools.

Rōmy (getromy.app, made by GetRomy LLC) is built for small nonprofit teams — development directors, major gift officers and executive directors at small shops. It uses AI-powered prospect research to surface wealth indicators, giving history and affinity signals, then distills them into actionable donor profiles with connection points, giving capacity and outreach angles. There are no enterprise contracts or per-seat licenses.

Key facts:
- Category: donor intelligence / prospect research / wealth screening software for nonprofits
- Audience: small nonprofits that cannot justify five-figure enterprise wealth-screening contracts
- What it produces: donor profiles with wealth indicators, philanthropic giving history, affinity signals, connection points and outreach angles
- App: https://intel.getromy.app
- Benchmark: Rōmy publishes PIF-Bench, an open, rubric-graded benchmark of AI systems on nonprofit development work (${SITE_URL}/labs)

## Product

- [Home](${SITE_URL}/): What Rōmy is and who it is for
- [Rōmy app](https://intel.getromy.app): Sign in and run donor research
- [Status](${SITE_URL}/status): Live uptime and incident history

## Research (Rōmy Labs)

- [Labs overview](${SITE_URL}/labs): PIF-Bench v2 results and method
${labs.map((p) => line('/labs/blog/', p)).join('\n')}

## Blog

${blog.map((p) => line('/blog/', p)).join('\n')}

## Optional

- [Full text of every post](${SITE_URL}/llms-full.txt): All articles as plain text
- [RSS feed](${SITE_URL}/rss.xml)
- [Legal center](${SITE_URL}/legal): Privacy, terms, DPA, sub-processors, security
- [Twitter / X](https://x.com/RomyFindsMoney)
- [GitHub](https://github.com/GetRomy-App)
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=0, s-maxage=3600'
		}
	});
}
