import { getAllPosts, getPost } from '$lib/content';
import { SITE_URL } from '$lib/seo';

export const prerender = true;

/** Every post as plain Markdown in one file, for AI answer engines and LLM crawlers. */
export async function GET() {
	const metas = await getAllPosts();
	const posts = (await Promise.all(metas.map((m) => getPost(m.slug)))).filter(
		(p): p is NonNullable<typeof p> => Boolean(p)
	);

	const sections = posts.map((p) => {
		const url = `${SITE_URL}${p.has_benchmarks ? '/labs/blog/' : '/blog/'}${p.slug}`;
		const body = p.source.replace(/\{%[^%]*%\}/g, '').trim();
		return [
			`---`,
			`title: ${p.title}`,
			`url: ${url}`,
			`date: ${p.date}`,
			p.tag ? `category: ${p.tag}` : '',
			p.keywords.length ? `topics: ${p.keywords.join(', ')}` : '',
			`publisher: Rōmy (GetRomy LLC)`,
			`---`,
			'',
			body.startsWith('# ') ? body : `# ${p.title}\n\n${body}`
		]
			.filter((l) => l !== '')
			.join('\n');
	});

	const body = `# Rōmy — full text of the blog and research

> Rōmy (${SITE_URL}) is an AI donor intelligence and prospect research platform for small nonprofits, made by GetRomy LLC. This file contains every published post in full. Index: ${SITE_URL}/llms.txt

${sections.join('\n\n')}
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=0, s-maxage=3600'
		}
	});
}
