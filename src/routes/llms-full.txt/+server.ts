import { getAllPosts, getPost, postPath } from '$lib/content';
import { SITE_URL } from '$lib/seo';

export const prerender = true;

/** Full Markdown text of every post, for AI assistants that cite sources (GEO). */
export async function GET() {
	const metas = await getAllPosts();
	const posts = (await Promise.all(metas.map((m) => getPost(m.slug)))).filter(
		(p): p is NonNullable<typeof p> => p !== null
	);

	const sections = posts.map((p) => {
		const header = [
			`Source: ${SITE_URL}${postPath(p)}`,
			`Published: ${p.date}`,
			`Category: ${p.tag}`,
			p.keywords.length ? `Topics: ${p.keywords.join(', ')}` : null,
			`Summary: ${p.seo_description}`
		]
			.filter(Boolean)
			.join('\n');
		const body = p.source.startsWith('# ') ? p.source : `# ${p.title}\n\n${p.source}`;
		return `${header}\n\n${body}`;
	});

	const body = `# Rōmy — full text of the blog and research

> Rōmy (GetRomy LLC) is an AI donor intelligence and prospect research platform for small nonprofits. Index: ${SITE_URL}/llms.txt

${sections.join('\n\n---\n\n')}
`;

	return new Response(body, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=0, s-maxage=3600' }
	});
}
