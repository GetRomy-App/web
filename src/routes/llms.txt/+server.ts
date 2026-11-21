import { getAllPosts } from '$lib/content';
import { SITE_URL, postDescription } from '$lib/seo';
import base from '$lib/llms/base.md?raw';

export const prerender = true;

/**
 * llms.txt (https://llmstxt.org): a plain-Markdown map of the site for LLM
 * answer engines. The hand-written summary, links and contact lines live in
 * src/lib/llms/base.md; every post is appended at build time so the list is
 * never stale.
 */
export async function GET() {
	const posts = await getAllPosts();
	const labs = posts.filter((p) => p.has_benchmarks);
	const blog = posts.filter((p) => !p.has_benchmarks);
	const line = (path: string) => (p: (typeof posts)[number]) =>
		`- [${p.title}](${SITE_URL}${path}/${p.slug}): ${postDescription(p, 220)}`;

	const generated = `
## Key facts

- What it is: donor intelligence, AI prospect research and wealth screening software for nonprofits
- Who it is for: small nonprofits, development directors, major gift officers and prospect researchers
- How it differs from enterprise wealth screening: no enterprise contracts or per-seat licensing; prospect research from about $0.10 per prospect (see the engineering write-up below)
- Output: donor profiles with connection points, giving capacity, giving history and outreach angles
- Brand spelling: "Rōmy" (with a macron over the o), made by GetRomy LLC

## Research (Rōmy Labs)

- [Rōmy Labs](${SITE_URL}/labs): open, rubric-graded benchmarks of AI on nonprofit development work (PIF-Bench)
${labs.map(line('/labs/blog')).join('\n')}

## Blog: field notes on major gift fundraising

- [The Rōmy Blog](${SITE_URL}/blog)
${blog.map(line('/blog')).join('\n')}

## Optional

- [Full text of every post](${SITE_URL}/llms-full.txt)
- [RSS feed](${SITE_URL}/blog/rss.xml)
- [Status](${SITE_URL}/status)
- [Security overview](${SITE_URL}/security)
- [Privacy policy](${SITE_URL}/privacy)
- [Terms of service](${SITE_URL}/terms)
`;

	return new Response(`${base.trimEnd()}\n${generated}`, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=0, s-maxage=3600'
		}
	});
}
