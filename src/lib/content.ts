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

const STOPWORDS = new Set([
	'a',
	'an',
	'the',
	'is',
	'are',
	'was',
	'were',
	'be',
	'been',
	'and',
	'or',
	'but',
	'for',
	'nor',
	'so',
	'yet',
	'of',
	'in',
	'on',
	'at',
	'to',
	'from',
	'with',
	'without',
	'by',
	'about',
	'into',
	'over',
	'after',
	'before',
	'her',
	'his',
	'their',
	'its',
	'your',
	'our',
	'you',
	'we',
	'it',
	'this',
	'that',
	'has',
	'have',
	'had',
	'not',
	'no',
	'as',
	'if',
	'when',
	'why',
	'how',
	'what',
	'who'
]);

const TAG_KEYWORDS: Record<string, string[]> = {
	'Field Notes': ['major gift fundraising', 'donor relationships', 'nonprofit development'],
	Industry: ['nonprofit fundraising trends', 'philanthropy industry', 'donor intelligence'],
	Research: ['fundraising research', 'donor data analysis', 'prospect research'],
	Engineering: ['fundraising technology', 'AI donor research', 'nonprofit software'],
	'Data Science': ['donor data science', 'wealth screening data', 'AI prospect research']
};

/**
 * Builds a per-post meta keywords list from the post's own title and tag
 * instead of repeating one static, identical list across every article.
 */
export function postKeywords(post: PostMeta): string[] {
	const titleWords = post.title
		.toLowerCase()
		.replace(/[^a-z0-9\s]/g, '')
		.split(/\s+/)
		.filter((w) => w.length > 2 && !STOPWORDS.has(w));

	const unique = Array.from(new Set(titleWords)).slice(0, 5);
	const tagPhrases = TAG_KEYWORDS[post.tag] ?? ['nonprofit fundraising', 'donor intelligence'];

	return Array.from(new Set([...unique, ...tagPhrases, 'Rōmy']));
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
