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
	/** Search-facing title (no brand suffix). Falls back to `title`. */
	seo_title: string;
	/** ≤158-char search snippet. Falls back to `excerpt`. */
	seo_description: string;
	keywords: string[];
}

export interface Post extends PostMeta {
	content: string;
	/** Raw Markdoc body (used for llms-full.txt). */
	source: string;
	wordCount: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toMeta(slug: string, data: Record<string, any>): PostMeta {
	const title = data.title ?? slug;
	const excerpt = data.excerpt ?? '';
	return {
		slug,
		title,
		date: data.date ?? '',
		excerpt,
		tag: data.tag ?? '',
		has_benchmarks: data.has_benchmarks ?? false,
		seo_title: data.seo_title || title,
		seo_description: data.seo_description || excerpt,
		keywords: Array.isArray(data.keywords) ? data.keywords.map(String) : []
	};
}

export function postPath(post: Pick<PostMeta, 'slug' | 'has_benchmarks'>): string {
	return post.has_benchmarks ? `/labs/blog/${post.slug}` : `/blog/${post.slug}`;
}

/**
 * Pick related posts for internal linking: shared keywords weigh most, then same tag,
 * then recency. Deterministic so prerendered pages are stable.
 */
export function relatedPosts(current: PostMeta, all: PostMeta[], count = 3): PostMeta[] {
	const kw = new Set(current.keywords);
	return all
		.filter((p) => p.slug !== current.slug && p.has_benchmarks === current.has_benchmarks)
		.map((p) => {
			const shared = p.keywords.filter((k) => kw.has(k)).length;
			const score = shared * 10 + (p.tag === current.tag ? 1 : 0);
			return { p, score };
		})
		.sort(
			(a, b) =>
				b.score - a.score ||
				new Date(b.p.date).getTime() - new Date(a.p.date).getTime() ||
				a.p.slug.localeCompare(b.p.slug)
		)
		.slice(0, count)
		.map(({ p }) => p);
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
			...toMeta(slug, data),
			content: html,
			source: markdocSource.trim(),
			wordCount: markdocSource.split(/\s+/).filter(Boolean).length
		};
	} catch {
		return null;
	}
}
