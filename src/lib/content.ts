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

const KEYWORD_STOPWORDS = new Set([
	'a',
	'an',
	'the',
	'and',
	'or',
	'but',
	'of',
	'in',
	'on',
	'at',
	'to',
	'for',
	'with',
	'from',
	'by',
	'is',
	'are',
	'was',
	'were',
	'be',
	'been',
	'it',
	'its',
	'your',
	'you',
	'her',
	'his',
	'their',
	'our',
	'my',
	'this',
	'that',
	'these',
	'those',
	'who',
	'what',
	'when',
	'where',
	'why',
	'how',
	'not',
	'no',
	'if',
	'as',
	'than',
	'then',
	'too',
	'so',
	'do',
	'did',
	'does',
	'have',
	'has',
	'had',
	'can',
	'will',
	'would',
	'could',
	'should'
]);

const BASE_KEYWORDS = [
	'donor intelligence',
	'nonprofit fundraising',
	'prospect research',
	'AI donor research',
	'wealth screening'
];

/**
 * Builds a per-post meta keywords string from the shared base terms plus the
 * post's own tag and any distinctive words pulled from its title — so every
 * post gets a keywords tag tied to what it's actually about, instead of one
 * identical string reused across every post.
 */
export function deriveKeywords(title: string, tag: string): string {
	const titleWords = title
		.toLowerCase()
		.replace(/[^a-z0-9\s'-]/g, ' ')
		.split(/\s+/)
		.filter((word) => word.length > 3 && !KEYWORD_STOPWORDS.has(word));

	const terms = [...BASE_KEYWORDS, tag.toLowerCase(), ...titleWords].filter(Boolean);

	return Array.from(new Set(terms)).slice(0, 14).join(', ');
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
