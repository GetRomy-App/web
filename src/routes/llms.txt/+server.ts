import { getAllPosts } from '$lib/content';
import { getAllLegalPages } from '$lib/legal';
import { SITE_URL, CONTACT_EMAILS, metaDescription } from '$lib/seo';
import { PIF_REPO } from '$lib/benchmarks';

export const prerender = true;

/**
 * /llms.txt — a plain-Markdown map of the site for AI assistants and answer
 * engines (https://llmstxt.org). Generated from the content so new posts show
 * up without anyone remembering to edit it.
 */
export async function GET() {
	const [allPosts, legalPages] = await Promise.all([getAllPosts(), getAllLegalPages()]);
	const blogPosts = allPosts.filter((p) => !p.has_benchmarks);
	const labsPosts = allPosts.filter((p) => p.has_benchmarks);

	const line = (path: string, title: string, note: string) =>
		`- [${title}](${SITE_URL}${path})${note ? `: ${note}` : ''}`;

	const postNote = (p: (typeof allPosts)[number]) =>
		[p.seoTopic ? `${p.seoTopic}.` : '', metaDescription(p.excerpt, 200)].filter(Boolean).join(' ');

	const body = `# Rōmy

> Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions.

Rōmy (also written "Romy"; company: GetRomy LLC) is a donor intelligence platform built for small nonprofit teams. It uses AI-powered prospect research to surface wealth indicators, giving histories, and affinity signals — then distills them into actionable donor profiles.

## Features

- Donor Discovery: AI-powered prospect research with wealth indicators, giving history, and affinity signals
- Fraction of the Cost: No enterprise contracts or per-seat licensing — donor intelligence at a price built for small nonprofits
- Ready to Act On: Every prospect comes with connection points, giving capacity, and outreach angles

## Key pages

${line('/', 'Rōmy home', 'What Rōmy is and who it is for.')}
${line('/labs', 'Rōmy Labs — PIF-Bench v2', 'An open, rubric-graded benchmark of AI systems on nonprofit development work (25 tasks, 331 pass/fail checks, graded blind).')}
${line('/blog', 'Rōmy Blog', 'Field notes and essays on major gifts, donor stewardship, prospect research, planned giving, and donor retention.')}
${line('/status', 'Status', 'Live uptime and incident history.')}
${line('/legal', 'Legal', legalPages.map((p) => p.title).join(', ') + '.')}
- [RSS feed](${SITE_URL}/rss.xml)
- [Sitemap](${SITE_URL}/sitemap.xml)

## Research and benchmarks

${labsPosts.map((p) => line(`/labs/blog/${p.slug}`, p.title, postNote(p))).join('\n')}
- [PIF-Bench on GitHub](${PIF_REPO}): Rubrics and every verdict.

## Blog

${blogPosts.map((p) => line(`/blog/${p.slug}`, p.title, postNote(p))).join('\n')}

## Links

- Website: https://getromy.app
- Product: https://intel.getromy.app
- Twitter: https://x.com/RomyFindsMoney
- GitHub: https://github.com/GetRomy-App
- Contact: ${[...CONTACT_EMAILS].reverse().join(', ')}

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
