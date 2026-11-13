import fs from 'fs/promises';
import path from 'path';
import { getAllPosts, postPath } from '$lib/content';
import { getAllLegalPages } from '$lib/legal';
import { SITE_URL, clip } from '$lib/seo';

export const prerender = true;

const LEGAL_ROUTES: Record<string, string> = {
	privacy: '/privacy',
	'prospect-privacy': '/privacy/prospects',
	terms: '/terms',
	aup: '/aup',
	cookies: '/cookies',
	dpa: '/dpa',
	security: '/security',
	subprocessors: '/subprocessors'
};

/**
 * llms.txt (https://llmstxt.org): a plain-markdown map of the site for AI assistants and
 * answer engines. The hand-written part lives in content/site/llms-intro.md; the page and
 * article index is generated from the same content as the site, so it never goes stale.
 */
export async function GET() {
	const [intro, posts, legalPages] = await Promise.all([
		fs.readFile(path.join(process.cwd(), 'content', 'site', 'llms-intro.md'), 'utf-8'),
		getAllPosts(),
		getAllLegalPages()
	]);

	const research = posts.filter((p) => p.has_benchmarks);
	const blog = posts.filter((p) => !p.has_benchmarks);

	const line = (p: (typeof posts)[number]) =>
		`- [${p.title}](${SITE_URL}${postPath(p)}): ${p.seo_description || clip(p.excerpt, 200)}`;

	const generated = `## Key pages

- [Rōmy home](${SITE_URL}/): What Rōmy is and who it is for
- [Rōmy Labs](${SITE_URL}/labs): PIF-Bench, an open, rubric-graded benchmark of AI on nonprofit development work
- [Rōmy Blog](${SITE_URL}/blog): Writing and research on nonprofit fundraising, major gifts, and AI donor intelligence
- [Status](${SITE_URL}/status): Live operational status and uptime history
- [Full text of every article](${SITE_URL}/llms-full.txt): The complete blog and research archive as one markdown file
- [RSS feed](${SITE_URL}/rss.xml)
- [Sitemap](${SITE_URL}/sitemap.xml)

## Research

${research.map(line).join('\n')}

## Blog

${blog.map(line).join('\n')}

## Legal

${legalPages
	.filter((p) => LEGAL_ROUTES[p.slug])
	.map(
		(p) =>
			`- [${p.title}](${SITE_URL}${LEGAL_ROUTES[p.slug]})${p.description ? `: ${p.description}` : ''}`
	)
	.join('\n')}

`;

	// Slot the generated index in ahead of the intro's "## Links" section.
	const marker = '## Links';
	const at = intro.indexOf(marker);
	const body =
		at === -1
			? `${intro.trimEnd()}\n\n${generated}`
			: `${intro.slice(0, at)}${generated}${intro.slice(at)}`;

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=0, s-maxage=3600'
		}
	});
}
