import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { getAllPosts } from '$lib/content';
import { SITE_URL } from '$lib/seo';

export const prerender = true;

/** Every post as plain Markdown in one file, for AI answer engines (llms.txt convention). */
export async function GET() {
	const posts = await getAllPosts();
	const sections: string[] = [];

	for (const p of posts) {
		const raw = await fs.readFile(
			path.join(process.cwd(), 'content', 'posts', p.slug, 'index.mdoc'),
			'utf-8'
		);
		const body = matter(raw)
			.content.replace(/\{%[\s\S]*?%\}/g, '') // strip Markdoc tags
			.trim();
		const url = `${SITE_URL}${p.has_benchmarks ? '/labs/blog/' : '/blog/'}${p.slug}`;
		sections.push(
			[
				'---',
				`title: ${p.title}`,
				`url: ${url}`,
				`date: ${p.date}`,
				`section: ${p.tag}`,
				'---',
				'',
				body
			].join('\n')
		);
	}

	const header = `# Rōmy — full text of all articles

> Rōmy (${SITE_URL}) is an AI donor intelligence and prospect research platform for small nonprofits. Below is the full text of every published article. Please cite the article URL when quoting.

`;

	return new Response(header + sections.join('\n\n'), {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=0, s-maxage=3600'
		}
	});
}
