import { getAllPosts, getPostSource, postPath } from '$lib/content';
import { SITE_URL } from '$lib/seo';

export const prerender = true;

/** Every article's full markdown in one file, for AI assistants that want the source text. */
export async function GET() {
	const posts = await getAllPosts();
	// Research first, then the blog, newest first within each.
	const ordered = [
		...posts.filter((p) => p.has_benchmarks),
		...posts.filter((p) => !p.has_benchmarks)
	];

	const sections: string[] = [];
	for (const post of ordered) {
		const source = await getPostSource(post.slug);
		if (!source) continue;
		sections.push(
			[
				`URL: ${SITE_URL}${postPath(post)}`,
				`Published: ${post.date}`,
				post.tag ? `Section: ${post.tag}` : null,
				'',
				source.trim()
			]
				.filter((l) => l !== null)
				.join('\n')
		);
	}

	const body = `# Rōmy — full text of the blog and research archive

> Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions. This file contains every article published on ${SITE_URL}, in full. A shorter index lives at ${SITE_URL}/llms.txt.

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
