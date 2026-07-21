import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import Markdoc from '@markdoc/markdoc';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'posts');

const KEYWORD_STOPWORDS = new Set([
	'the',
	'and',
	'for',
	'with',
	'from',
	'that',
	'this',
	'your',
	'you',
	'her',
	'his',
	'she',
	'was',
	'were',
	'when',
	'what',
	'why',
	'how',
	'who',
	'have',
	'has',
	'had',
	'are',
	'not',
	'but',
	'about',
	'into',
	'than',
	'then',
	'them',
	'they',
	'their',
	'there',
	'were',
	'been',
	'being',
	'were',
	'wasnt',
	'didnt',
	'dont',
	'doesnt',
	'still',
	'never',
	'ever',
	'only',
	'just',
	'over',
	'after',
	'before',
	'while',
	'goes',
	'went',
	'even'
]);

const BASE_BLOG_KEYWORDS = [
	'donor intelligence',
	'nonprofit fundraising',
	'prospect research',
	'AI donor research',
	'wealth screening'
];

/** Per-post keyword tag built from the base blog terms, the post's category tag, and its most
 *  distinctive title words — so every post gets a distinct <meta name="keywords"> instead of one
 *  list repeated across every URL. */
export function deriveKeywords(title: string, tag: string): string {
	const titleWords = title
		.toLowerCase()
		.replace(/[^a-z0-9\s'-]/g, '')
		.split(/\s+/)
		.filter((w) => w.length > 3 && !KEYWORD_STOPWORDS.has(w));

	const combined = [...BASE_BLOG_KEYWORDS, tag.toLowerCase(), ...titleWords].filter(Boolean);

	return Array.from(new Set(combined)).slice(0, 14).join(', ');
}

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
