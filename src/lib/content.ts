import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import Markdoc from '@markdoc/markdoc';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'posts');

export interface PostMeta {
	slug: string;
	title: string;
	date: string;
	excerpt: string;
	tag: string;
	has_benchmarks: boolean;
}

export interface Post extends PostMeta {
	content: string;
	/** Plain-text word count of the rendered body (for structured data / reading time). */
	wordCount: number;
}

/** Neighbouring posts for internal linking: same tag first, then nearest by date. */
export async function getRelatedPosts(slug: string, limit = 3): Promise<PostMeta[]> {
	const all = await getAllPosts();
	const current = all.find((p) => p.slug === slug);
	if (!current) return [];
	const pool = all.filter((p) => p.slug !== slug && p.has_benchmarks === current.has_benchmarks);
	const t = new Date(current.date).getTime();
	const distance = (p: PostMeta) => Math.abs(new Date(p.date).getTime() - t);
	return pool
		.sort((a, b) => {
			const tagA = a.tag === current.tag ? 0 : 1;
			const tagB = b.tag === current.tag ? 0 : 1;
			return tagA - tagB || distance(a) - distance(b);
		})
		.slice(0, limit);
}

export async function getAllPosts(): Promise<PostMeta[]> {
	let entries: Awaited<ReturnType<typeof fs.readdir>>;
	try {
		entries = await fs.readdir(CONTENT_DIR, { withFileTypes: true });
	} catch {
		return [];
	}

	const posts: PostMeta[] = [];

	for (const entry of entries) {
		if (!entry.isDirectory()) continue;

		const filePath = path.join(CONTENT_DIR, entry.name, 'index.mdoc');
		try {
			const raw = await fs.readFile(filePath, 'utf-8');
			const { data } = matter(raw);
			posts.push({
				slug: entry.name,
				title: data.title ?? entry.name,
				date: data.date ?? '',
				excerpt: data.excerpt ?? '',
				tag: data.tag ?? '',
				has_benchmarks: data.has_benchmarks ?? false
			});
		} catch {
			// skip entries without index.mdoc
		}
	}

	return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPost(slug: string): Promise<Post | null> {
	const filePath = path.join(CONTENT_DIR, slug, 'index.mdoc');
	try {
		const raw = await fs.readFile(filePath, 'utf-8');
		const { data, content: markdocSource } = matter(raw);

		const ast = Markdoc.parse(markdocSource);
		const transformed = Markdoc.transform(ast);
		const html = Markdoc.renderers.html(transformed);
		const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

		return {
			slug,
			title: data.title ?? slug,
			date: data.date ?? '',
			excerpt: data.excerpt ?? '',
			tag: data.tag ?? '',
			has_benchmarks: data.has_benchmarks ?? false,
			content: html,
			wordCount: text ? text.split(' ').length : 0
		};
	} catch {
		return null;
	}
}
