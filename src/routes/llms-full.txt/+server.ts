import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { getAllPosts } from '$lib/content';
import { LLMS_INTRO, postUrl } from '$lib/llms';

export const prerender = true;

/** Every post's full Markdown, so answer engines can quote and cite Rōmy accurately. */
export async function GET() {
	const posts = await getAllPosts();
	const sections = await Promise.all(
		posts.map(async (p) => {
			const raw = await fs.readFile(
				path.join(process.cwd(), 'content', 'posts', p.slug, 'index.mdoc'),
				'utf-8'
			);
			const body = matter(raw)
				.content.replace(/^\s*#\s+.*\n/, '')
				.replace(/\{%[^%]*%\}/g, '')
				.trim();
			return `---

# ${p.title}

URL: ${postUrl(p)}
Published: ${p.date}
Section: ${p.tag}
Topics: ${p.keywords.join(', ')}

${body}
`;
		})
	);

	return new Response(`${LLMS_INTRO}\n${sections.join('\n')}`, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
}
