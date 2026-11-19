import { getAllPosts } from '$lib/content';
import { SITE_URL, snippet } from '$lib/seo';
import header from '$lib/seo/llms-header.md?raw';

export const prerender = true;

/**
 * llms.txt (https://llmstxt.org) — a plain-language map of the site for AI
 * answer engines. The hand-written intro lives in $lib/seo/llms-header.md;
 * the article index below it is generated from content/posts at build time.
 */
export async function GET() {
	const posts = await getAllPosts();
	const line = (p: (typeof posts)[number]) =>
		`- [${p.title}](${SITE_URL}${p.has_benchmarks ? '/labs/blog' : '/blog'}/${p.slug}): ${p.description || snippet(p.excerpt, 200)}`;

	const research = posts.filter((p) => p.has_benchmarks);
	const guides = posts.filter((p) => !p.has_benchmarks && p.tag !== 'Field Notes');
	const notes = posts.filter((p) => !p.has_benchmarks && p.tag === 'Field Notes');

	const body = `${header.trimEnd()}

## Research

${research.map(line).join('\n')}

## Guides and industry analysis

${guides.map(line).join('\n')}

## Field Notes (essays on major gifts, stewardship and donor relationships)

${notes.map(line).join('\n')}
`;
	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=0, s-maxage=3600'
		}
	});
}
