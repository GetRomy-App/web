import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import Markdoc from '@markdoc/markdoc';
import { metaDescription } from './seo';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'posts');

export interface PostMeta {
	slug: string;
	title: string;
	date: string;
	excerpt: string;
	tag: string;
	has_benchmarks: boolean;
	/** Search-facing <title> override (frontmatter `seo_title`); the on-page H1 stays `title`. */
	seoTitle: string;
	/** Search-snippet description (frontmatter `seo_description`); falls back to a trimmed excerpt. */
	seoDescription: string;
	/** Topic keywords (frontmatter `keywords`) — used for meta tags, JSON-LD and related posts. */
	keywords: string[];
}

export interface Post extends PostMeta {
	content: string;
	wordCount: number;
}

function toKeywords(value: unknown): string[] {
	if (Array.isArray(value)) return value.map((k) => String(k).trim()).filter(Boolean);
	if (typeof value === 'string')
		return value
			.split(',')
			.map((k) => k.trim())
			.filter(Boolean);
	return [];
}

function toMeta(slug: string, data: Record<string, unknown>): PostMeta {
	const excerpt = (data.excerpt as string) ?? '';
	return {
		slug,
		title: (data.title as string) ?? slug,
		date: (data.date as string) ?? '',
		excerpt,
		tag: (data.tag as string) ?? '',
		has_benchmarks: (data.has_benchmarks as boolean) ?? false,
		seoTitle: (data.seo_title as string) ?? '',
		seoDescription: (data.seo_description as string) || metaDescription(excerpt),
		keywords: toKeywords(data.keywords)
	};
}

/**
 * Pick the posts most related to `post`: most shared keywords first, then same
 * tag, then closest publish date. Gives every article contextual internal links.
 */
export function getRelatedPosts(post: PostMeta, pool: PostMeta[], limit = 3): PostMeta[] {
	const mine = new Set(post.keywords.map((k) => k.toLowerCase()));
	const when = new Date(post.date).getTime() || 0;

	return pool
		.filter((p) => p.slug !== post.slug)
		.map((p) => ({
			post: p,
			shared: p.keywords.filter((k) => mine.has(k.toLowerCase())).length,
			sameTag: p.tag === post.tag ? 1 : 0,
			distance: Math.abs((new Date(p.date).getTime() || 0) - when)
		}))
		.sort((a, b) => b.shared - a.shared || b.sameTag - a.sameTag || a.distance - b.distance)
		.slice(0, limit)
		.map((entry) => entry.post);
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
		// Posts open with their title as a markdown H1, and the page template already
		// renders the title as the page's H1 — drop the duplicate so each page has one.
		const html = Markdoc.renderers
			.html(transformed)
			.replace(/^(\s*<article>)?\s*<h1[^>]*>[\s\S]*?<\/h1>/, '$1');

		return {
			...toMeta(slug, data),
			content: html,
			wordCount: markdocSource.split(/\s+/).filter(Boolean).length
		};
	} catch {
		return null;
	}
}
