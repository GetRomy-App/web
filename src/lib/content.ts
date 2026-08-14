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

const STOPWORDS = new Set([
	'the',
	'a',
	'an',
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
	'is',
	'was',
	'were',
	'are',
	'be',
	'been',
	'it',
	'its',
	"it's",
	'this',
	'that',
	'you',
	'your',
	'his',
	'her',
	'their',
	'our',
	'my',
	'we',
	'they',
	'he',
	'she',
	'not',
	'no',
	'never',
	'nobody',
	'yet',
	'who',
	'what',
	'when',
	'where',
	'why',
	'how',
	'as',
	'by',
	'from',
	'up',
	'down',
	'into',
	'about',
	'than',
	'then',
	'so',
	'if',
	'do',
	'did',
	'does',
	'had',
	'has',
	'have',
	"didn't",
	"wasn't",
	"wouldn't",
	"you're",
	"you've"
]);

const BASE_KEYWORDS = [
	'donor intelligence',
	'nonprofit fundraising',
	'prospect research',
	'AI donor research',
	'wealth screening'
];

/**
 * Derives a comma-separated meta-keywords string for a post from its title,
 * excerpt, and tag — no post body content is read or altered.
 */
export function deriveKeywords(post: Pick<PostMeta, 'title' | 'excerpt' | 'tag'>): string {
	const words = `${post.title} ${post.excerpt}`
		.toLowerCase()
		.replace(/[^a-z0-9'\s-]/g, ' ')
		.split(/\s+/)
		.filter((w) => w.length > 3 && !STOPWORDS.has(w));

	const seen = new Set<string>(BASE_KEYWORDS.map((k) => k.toLowerCase()));
	const extracted: string[] = [];
	for (const word of words) {
		if (seen.has(word)) continue;
		seen.add(word);
		extracted.push(word);
		if (extracted.length >= 8) break;
	}

	const tagKeyword = post.tag ? [post.tag.toLowerCase()] : [];
	return [...BASE_KEYWORDS, ...tagKeyword, ...extracted].join(', ');
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
