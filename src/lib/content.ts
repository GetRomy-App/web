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
	/** Optional SEO overrides. Visible copy (title/excerpt) is never changed for SEO. */
	seo_title: string;
	seo_description: string;
	keywords: string[];
}

export interface Post extends PostMeta {
	content: string;
	wordCount: number;
}

function seoFields(data: Record<string, unknown>) {
	return {
		seo_title: typeof data.seo_title === 'string' ? data.seo_title : '',
		seo_description: typeof data.seo_description === 'string' ? data.seo_description : '',
		keywords: Array.isArray(data.keywords) ? data.keywords.map(String) : []
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
				...seoFields(data)
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
			...seoFields(data),
			content: html,
			wordCount: markdocSource.split(/\s+/).filter(Boolean).length
		};
	} catch {
		return null;
	}
}

/** Raw Markdown body (frontmatter stripped) for machine-readable feeds such as /llms-full.txt. */
export async function getPostMarkdown(slug: string): Promise<string> {
	try {
		const raw = await fs.readFile(path.join(CONTENT_DIR, slug, 'index.mdoc'), 'utf-8');
		return matter(raw).content.trim();
	} catch {
		return '';
	}
}
