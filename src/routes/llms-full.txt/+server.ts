import { getAllPosts, getPost } from '$lib/content';
import { SITE_URL } from '$lib/seo';

export const prerender = true;

/** Every post's full text in one Markdown file, for LLM answer engines (llmstxt.org convention). */
export async function GET() {
	const metas = await getAllPosts();
	const posts = await Promise.all(metas.map((m) => getPost(m.slug)));

	const sections = posts
		.filter((p): p is NonNullable<typeof p> => Boolean(p))
		.map((p) => {
			const url = `${SITE_URL}${p.has_benchmarks ? '/labs/blog' : '/blog'}/${p.slug}`;
			// Drop any Markdoc {% tags %}; keep the prose.
			const text = p.source.replace(/\{%[\s\S]*?%\}/g, '').trim();
			return [
				`# ${p.title}`,
				'',
				`URL: ${url}`,
				`Published: ${p.date}`,
				`Category: ${p.tag}`,
				'Publisher: Rōmy (GetRomy LLC)',
				'',
				`> ${p.excerpt.replace(/\s+/g, ' ')}`,
				'',
				text
			].join('\n');
		});

	const body = `# Rōmy: full text of every post

> Rōmy (${SITE_URL}) is a donor intelligence and AI prospect research platform for small nonprofits. Below is the full text of every post on the Rōmy blog and Rōmy Labs.

---

${sections.join('\n\n---\n\n')}
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=0, s-maxage=3600'
		}
	});
}
