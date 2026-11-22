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
	/** Search-result title (without brand suffix). Falls back to `title`. */
	seo_title: string;
	/** ~155-char meta description. Falls back to a trimmed `excerpt`. */
	seo_description: string;
	keywords: string[];
	wordCount: number;
}

export interface Post extends PostMeta {
	content: string;
	/** Raw Markdoc source (used for llms-full.txt and feeds). */
	source: string;
}

function toKeywords(value: unknown): string[] {
	if (Array.isArray(value)) return value.map(String).filter(Boolean);
	if (typeof value === 'string')
		return value
			.split(',')
			.map((k) => k.trim())
			.filter(Boolean);
	return [];
}

function countWords(source: string): number {
	return source
		.replace(/\{%[^%]*%\}/g, ' ')
		.replace(/[#>*_`[\]()|-]/g, ' ')
		.split(/\s+/)
		.filter(Boolean).length;
}

function toMeta(slug: string, data: Record<string, unknown>, source: string): PostMeta {
	return {
		slug,
		title: (data.title as string) ?? slug,
		date: (data.date as string) ?? '',
		excerpt: (data.excerpt as string) ?? '',
		tag: (data.tag as string) ?? '',
		has_benchmarks: (data.has_benchmarks as boolean) ?? false,
		seo_title: (data.seo_title as string) || '',
		seo_description: (data.seo_description as string) || '',
		keywords: toKeywords(data.keywords),
		wordCount: countWords(source)
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

		return {
			...toMeta(slug, data, markdocSource),
			content: html,
			source: markdocSource
		};
	} catch {
		return null;
	}
}
