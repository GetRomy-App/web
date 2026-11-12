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
	/** Search-only metadata. None of it is shown on the page; the title and excerpt stay as written. */
	seo_title: string;
	seo_description: string;
	keywords: string[];
	about: string[];
	/** Optional last-substantive-edit date (YYYY-MM-DD); falls back to `date`. */
	updated: string;
}

export interface Post extends PostMeta {
	content: string;
	wordCount: number;
}

function stringList(value: unknown): string[] {
	if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
	if (typeof value === 'string')
		return value
			.split(',')
			.map((v) => v.trim())
			.filter(Boolean);
	return [];
}

function toMeta(slug: string, data: Record<string, unknown>): PostMeta {
	const text = (v: unknown) => (v == null ? '' : String(v));
	return {
		slug,
		title: text(data.title) || slug,
		date: text(data.date),
		excerpt: text(data.excerpt),
		tag: text(data.tag),
		has_benchmarks: Boolean(data.has_benchmarks),
		seo_title: text(data.seo_title),
		seo_description: text(data.seo_description),
		keywords: stringList(data.keywords),
		about: stringList(data.about),
		updated: text(data.updated)
	};
}

/** Where a post lives: benchmark / research posts are on /labs, everything else on /blog. */
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

	return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPost(slug: string): Promise<Post | null> {
	const filePath = path.join(CONTENT_DIR, slug, 'index.mdoc');
	try {
		const raw = await fs.readFile(filePath, 'utf-8');
		const { data, content: markdocSource } = matter(raw);

		const ast = Markdoc.parse(markdocSource);
		// Every post opens with "# Title", which the page template already renders as its <h1>.
		// Drop the duplicate from the rendered body so each page has exactly one <h1>.
		const first = ast.children[0];
		if (first?.type === 'heading' && first.attributes.level === 1) ast.children.shift();
		const transformed = Markdoc.transform(ast);
		const html = Markdoc.renderers.html(transformed);
		const wordCount = html
			.replace(/<[^>]+>/g, ' ')
			.split(/\s+/)
			.filter(Boolean).length;

		return { ...toMeta(slug, data), content: html, wordCount };
	} catch {
		return null;
	}
}

/**
 * Posts to link from the foot of a post: the nearest neighbours by date within the same
 * section (blog vs labs), preferring the same tag. Gives every post inbound internal links
 * beyond the index page.
 */
export async function getRelatedPosts(slug: string, count = 3): Promise<PostMeta[]> {
	const all = await getAllPosts();
	const current = all.find((p) => p.slug === slug);
	if (!current) return [];
	const pool = all.filter((p) => p.has_benchmarks === current.has_benchmarks);
	const index = pool.findIndex((p) => p.slug === slug);
	const sameTag = (p: PostMeta) => (p.tag === current.tag ? 0 : 1);
	return pool
		.map((p, i) => ({ p, distance: Math.abs(i - index) }))
		.filter(({ p }) => p.slug !== slug)
		.sort((a, b) => sameTag(a.p) - sameTag(b.p) || a.distance - b.distance)
		.slice(0, count)
		.map(({ p }) => p);
}
