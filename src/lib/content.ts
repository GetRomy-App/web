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
	/** Search-optimised <title> (brand appended by the page). Falls back to `title`. */
	seo_title: string;
	/** Meta description (≤158 chars). Falls back to a trimmed `excerpt`. */
	description: string;
	/** Target search phrases for this post. */
	keywords: string[];
	/** Last substantive update (YYYY-MM-DD). Falls back to `date`. */
	updated: string;
}

export interface Post extends PostMeta {
	content: string;
}

function seoFields(data: Record<string, unknown>, title: string, date: string) {
	const keywords = Array.isArray(data.keywords)
		? (data.keywords as unknown[]).map(String)
		: typeof data.keywords === 'string'
			? data.keywords
					.split(',')
					.map((k) => k.trim())
					.filter(Boolean)
			: [];
	return {
		seo_title: typeof data.seo_title === 'string' && data.seo_title ? data.seo_title : title,
		description: typeof data.description === 'string' ? data.description : '',
		keywords,
		updated: typeof data.updated === 'string' && data.updated ? data.updated : date
	};
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
				has_benchmarks: data.has_benchmarks ?? false,
				...seoFields(data, data.title ?? entry.name, data.date ?? '')
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

		return {
			slug,
			title: data.title ?? slug,
			date: data.date ?? '',
			excerpt: data.excerpt ?? '',
			tag: data.tag ?? '',
			has_benchmarks: data.has_benchmarks ?? false,
			...seoFields(data, data.title ?? slug, data.date ?? ''),
			content: html
		};
	} catch {
		return null;
	}
}
