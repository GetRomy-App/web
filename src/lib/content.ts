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
	/** Search-result title (the on-page headline stays `title`). */
	seo_title: string;
	/** Search-result snippet; falls back to a clipped excerpt. */
	seo_description: string;
	keywords: string[];
}

export interface RelatedPost {
	slug: string;
	title: string;
	date: string;
	tag: string;
}

export interface Post extends PostMeta {
	content: string;
	wordCount: number;
	related: RelatedPost[];
}

function toMeta(slug: string, data: Record<string, unknown>): PostMeta {
	const str = (v: unknown) => (typeof v === 'string' ? v : '');
	return {
		slug,
		title: str(data.title) || slug,
		date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : str(data.date),
		excerpt: str(data.excerpt),
		tag: str(data.tag),
		has_benchmarks: data.has_benchmarks === true,
		seo_title: str(data.seo_title),
		seo_description: str(data.seo_description),
		keywords: Array.isArray(data.keywords)
			? data.keywords.filter((k): k is string => typeof k === 'string')
			: []
	};
}

/** The site-relative URL a post is served from (benchmark posts live under /labs). */
export function postPath(post: Pick<PostMeta, 'slug' | 'has_benchmarks'>): string {
	return post.has_benchmarks ? `/labs/blog/${post.slug}` : `/blog/${post.slug}`;
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
			posts.push(toMeta(entry.name, data));
		} catch {
			// skip entries without index.mdoc
		}
	}

	// Newest first; slug breaks ties so posts sharing a date keep a stable order between builds.
	return posts.sort(
		(a, b) =>
			new Date(b.date).getTime() - new Date(a.date).getTime() || a.slug.localeCompare(b.slug)
	);
}

export async function getPost(slug: string): Promise<Post | null> {
	const filePath = path.join(CONTENT_DIR, slug, 'index.mdoc');
	try {
		const raw = await fs.readFile(filePath, 'utf-8');
		const { data, content: markdocSource } = matter(raw);

		const ast = Markdoc.parse(markdocSource);
		const transformed = Markdoc.transform(ast);
		// The page template already renders the title as the <h1>; drop the body's leading
		// duplicate so each article has exactly one.
		const html = Markdoc.renderers
			.html(transformed)
			.replace(/^(\s*<article>)?\s*<h1[^>]*>[\s\S]*?<\/h1>/, '$1');

		const meta = toMeta(slug, data);
		const wordCount = markdocSource.split(/\s+/).filter(Boolean).length;

		// Next three posts in the same section, wrapping around, so every article links onward.
		const siblings = (await getAllPosts()).filter((p) => p.has_benchmarks === meta.has_benchmarks);
		const index = siblings.findIndex((p) => p.slug === slug);
		const related: RelatedPost[] = [];
		for (let i = 1; i < siblings.length && related.length < 3; i++) {
			const p = siblings[(index + i) % siblings.length];
			related.push({ slug: p.slug, title: p.title, date: p.date, tag: p.tag });
		}

		return { ...meta, content: html, wordCount, related };
	} catch {
		return null;
	}
}

/** The post's markdown body, without frontmatter (used by /llms-full.txt). */
export async function getPostSource(slug: string): Promise<string | null> {
	try {
		const raw = await fs.readFile(path.join(CONTENT_DIR, slug, 'index.mdoc'), 'utf-8');
		return matter(raw).content;
	} catch {
		return null;
	}
}
