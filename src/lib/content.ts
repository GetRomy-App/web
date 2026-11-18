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
	/** Short search-facing topic appended to the <title> (frontmatter `seo_topic`). */
	seoTopic: string;
	/** Search phrases the post answers (frontmatter `keywords`). */
	keywords: string[];
}

export interface Post extends PostMeta {
	content: string;
	wordCount: number;
}

function toKeywords(value: unknown): string[] {
	if (!Array.isArray(value)) return [];
	return value.filter((k): k is string => typeof k === 'string' && k.trim().length > 0);
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
				seoTopic: data.seo_topic ?? '',
				keywords: toKeywords(data.keywords)
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
		// The body repeats the title as a leading "# Heading", which the page hides in
		// favour of its own <h1>. Drop it from the markup so each post has a single h1.
		const html = Markdoc.renderers
			.html(transformed)
			.replace(/^(\s*<article>)?\s*<h1[^>]*>[\s\S]*?<\/h1>/, '$1');

		return {
			slug,
			title: data.title ?? slug,
			date: data.date ?? '',
			excerpt: data.excerpt ?? '',
			tag: data.tag ?? '',
			has_benchmarks: data.has_benchmarks ?? false,
			seoTopic: data.seo_topic ?? '',
			keywords: toKeywords(data.keywords),
			content: html,
			wordCount: markdocSource.split(/\s+/).filter(Boolean).length
		};
	} catch {
		return null;
	}
}

/**
 * A few posts to link from the foot of an article: the ones published just
 * before it (wrapping round), so every post is reachable from another post.
 */
export function getRelatedPosts(posts: PostMeta[], slug: string, count = 3): PostMeta[] {
	const index = posts.findIndex((p) => p.slug === slug);
	if (index === -1 || posts.length < 2) return [];
	const related: PostMeta[] = [];
	for (let i = 1; i < posts.length && related.length < count; i++) {
		related.push(posts[(index + i) % posts.length]);
	}
	return related;
}
