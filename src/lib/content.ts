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

const CORE_KEYWORDS = [
	'donor intelligence',
	'nonprofit fundraising',
	'prospect research',
	'AI donor research',
	'wealth screening',
	'major donor prospecting'
];

const STOPWORDS = new Set([
	'the',
	'a',
	'an',
	'is',
	'was',
	'were',
	'you',
	'your',
	'her',
	'his',
	'she',
	'he',
	'it',
	'in',
	'on',
	'at',
	'to',
	'of',
	'for',
	'and',
	'or',
	'never',
	'not',
	'do',
	'does',
	'be',
	'been',
	'with',
	'never',
	'that',
	'this',
	'why',
	'who',
	'i',
	'we'
]);

/**
 * Derives a per-post keyword list from the post's tag and title, on top of the
 * site's evergreen core keywords, so each post targets a distinct long-tail
 * query instead of every post shipping the same generic keyword meta tag.
 */
export function getPostKeywords(post: PostMeta): string {
	const titleWords = post.title
		.toLowerCase()
		.replace(/[^a-z0-9\s]/g, '')
		.split(/\s+/)
		.filter((w) => w.length > 2 && !STOPWORDS.has(w));

	const titlePhrase = titleWords.join(' ');
	const tag = post.tag?.toLowerCase();

	const keywords = [...CORE_KEYWORDS];
	if (tag) keywords.push(`${tag} fundraising`);
	if (titlePhrase) keywords.push(titlePhrase);
	keywords.push('nonprofit prospect research blog');

	return Array.from(new Set(keywords)).join(', ');
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
			content: html
		};
	} catch {
		return null;
	}
}
