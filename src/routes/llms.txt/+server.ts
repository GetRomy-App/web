import { getAllPosts } from '$lib/content';
import { SITE_URL } from '$lib/seo';

export const prerender = true;

/** One-line, markdown-safe summary for a link list. */
function oneLine(text: string): string {
	return text.replace(/\s+/g, ' ').trim();
}

/**
 * /llms.txt — a markdown map of the site for AI assistants and answer engines
 * (https://llmstxt.org). Generated from the content directory so it never goes stale.
 */
export async function GET() {
	const posts = await getAllPosts();
	const labs = posts.filter((p) => p.has_benchmarks);
	const blog = posts.filter((p) => !p.has_benchmarks);

	const link = (path: string, title: string, description: string) =>
		`- [${title}](${SITE_URL}${path}): ${oneLine(description)}`;

	const body = `# Rōmy

> Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions.

Rōmy is a donor intelligence platform built for small nonprofit teams. It uses AI-powered prospect research to surface wealth indicators, giving histories, and affinity signals — then distills them into actionable donor profiles.

## Features

- Donor Discovery: AI-powered prospect research with wealth indicators, giving history, and affinity signals
- Fraction of the Cost: No enterprise contracts or per-seat licensing — donor intelligence at a price built for small nonprofits
- Ready to Act On: Every prospect comes with connection points, giving capacity, and outreach angles

## Key pages

- [Rōmy home](${SITE_URL}/): Product overview — donor intelligence and AI prospect research for small nonprofits
- [Rōmy Labs](${SITE_URL}/labs): PIF-Bench v2, an open, rubric-graded benchmark of AI systems on nonprofit development work
- [Rōmy Blog](${SITE_URL}/blog): Field notes and research on nonprofit fundraising, major gifts, donor stewardship, and prospect research
- [Status](${SITE_URL}/status): Live uptime and incident history
- [Legal](${SITE_URL}/legal): Privacy policy, terms, security, and sub-processors

## Research

${labs.map((p) => link(`/labs/blog/${p.slug}`, p.title, p.seoDescription)).join('\n')}
- [PIF-Bench on GitHub](https://github.com/getromy-app/pif-bench): Rubrics, tasks, and every graded verdict

## Blog

${blog.map((p) => link(`/blog/${p.slug}`, p.title, p.seoDescription)).join('\n')}

## Links

- Website: ${SITE_URL}
- Product: https://intel.getromy.app
- Sitemap: ${SITE_URL}/sitemap.xml
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
