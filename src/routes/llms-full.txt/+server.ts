import { getAllPosts, getPost } from '$lib/content';
import { SITE_URL } from '$lib/seo';

export const prerender = true;

/** Every post in plain Markdown, so AI answer engines can quote and cite Rōmy accurately. */
export async function GET() {
	const metas = await getAllPosts();
	const posts = (await Promise.all(metas.map((m) => getPost(m.slug)))).filter(
		(p): p is NonNullable<typeof p> => p !== null
	);

	const sections = posts.map((p) => {
		const url = p.has_benchmarks ? `${SITE_URL}/labs/blog/${p.slug}` : `${SITE_URL}/blog/${p.slug}`;
		const date = p.date ? new Date(p.date).toISOString().slice(0, 10) : '';
		// Drop the leading H1 — it duplicates the title printed above it.
		const body = p.source.replace(/^#\s+.*\n+/, '');
		return `# ${p.title}

Source: ${url}
Published: ${date}
Section: ${p.tag}
Publisher: Rōmy (GetRomy LLC)

> ${p.excerpt}

${body}`;
	});

	const body = `# Rōmy — full text

> Rōmy is an AI donor intelligence and prospect research platform that helps small nonprofits find new major donors at a fraction of the cost of existing solutions. Website: ${SITE_URL}

${sections.join('\n\n---\n\n')}
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=0, s-maxage=3600'
		}
	});
}
