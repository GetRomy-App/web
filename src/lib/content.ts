import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import Markdoc from '@markdoc/markdoc';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'posts');

function toMeta(slug: string, data: Record<string, unknown>, body: string): PostMeta {
	const str = (v: unknown) => (typeof v === 'string' ? v : v instanceof Date ? v.toISOString().slice(0, 10) : '');
	const title = str(data.title) || slug;
	const excerpt = str(data.excerpt);
	return {
		slug,
		title,
		date: str(data.date),
		excerpt,
		tag: str(data.tag),
		has_benchmarks: Boolean(data.has_benchmarks),
		seo_title: str(data.seo_title) || title,
		seo_description: str(data.seo_description) || excerpt,
		keywords: Array.isArray(data.keywords) ? data.keywords.map(String) : [],
		updated: str(data.updated),
		wordCount: body.split(/\s+/).filter(Boolean).length
	};
}

export interface PostMeta {
	slug: string;
	title: string;
	date: string;
	excerpt: string;
	tag: string;
	has_benchmarks: boolean;
	/** Search-facing title (without brand suffix). Falls back to `title`. */
	seo_title: string;
	/** Search-facing meta description. Falls back to `excerpt`. */
	seo_description: string;
	keywords: string[];
	/** Optional "updated" date for dateModified / sitemap lastmod. */
	updated: string;
	wordCount: number;
}

export interface Post extends PostMeta {
	content: string;
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
			const { data, content } = matter(raw);
			posts.push(toMeta(entry.name, data, content));
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

		return { ...toMeta(slug, data, markdocSource), content: html };
	} catch {
		return null;
	}
}
