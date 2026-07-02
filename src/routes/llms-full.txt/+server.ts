import type { RequestHandler } from './$types';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { getAllPosts } from '$lib/content';
import { SITE_URL, SITE_NAME } from '$lib/seo';

export const prerender = true;

const CONTENT_DIR = path.join(process.cwd(), 'content', 'posts');

export const GET: RequestHandler = async () => {
	const posts = await getAllPosts();

	const sections = await Promise.all(
		posts.map(async (post) => {
			const raw = await fs.readFile(path.join(CONTENT_DIR, post.slug, 'index.mdoc'), 'utf-8');
			const { content } = matter(raw);
			const url = `${SITE_URL}${post.has_benchmarks ? '/labs/blog/' : '/blog/'}${post.slug}`;

			return `# ${post.title}

URL: ${url}
Date: ${post.date}
Category: ${post.tag}

${content.trim()}`;
		})
	);

	const body = `# ${SITE_NAME} — Full Blog Content

> Plain-text export of every published post for retrieval and citation by AI systems. See ${SITE_URL}/llms.txt for a concise overview.

${sections.join('\n\n---\n\n')}
`;

	return new Response(body, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' }
	});
};
