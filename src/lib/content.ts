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
	keywords: string;
}

export interface Post extends PostMeta {
	content: string;
}

/** Evergreen terms every post should carry, regardless of topic. */
const CORE_KEYWORDS = [
	'donor intelligence',
	'nonprofit fundraising',
	'prospect research',
	'AI donor research',
	'wealth screening'
];

const STOP_WORDS = new Set([
	'a',
	'an',
	'the',
	'and',
	'or',
	'but',
	'of',
	'to',
	'in',
	'on',
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
	'you',
	'your',
	'we',
	'our',
	'at',
	'by',
	'as',
	'that',
	'this',
	'these',
	'those',
	'from',
	'into',
	'about',
	'than',
	'then',
	'so',
	'if',
	'not',
	'no',
	'do',
	'did',
	'does',
	'has',
	'have',
	'had',
	'will',
	'would',
	'can',
	'could',
	'should',
	'who',
	'what',
	'when',
	'where',
	'why',
	'how',
	'i',
	'never',
	'always',
	'after',
	'before',
	'while',
	'out',
	'up',
	'down',
	'off',
	'her',
	'his',
	'their',
	'them',
	'they',
	'was',
	'were'
]);

/**
 * Builds a per-post <meta name="keywords"> value from the evergreen core terms,
 * the post's tag, and the most distinctive words in its title and excerpt.
 * Purely metadata — never touches the post's rendered copy.
 */
export function deriveKeywords(title: string, tag: string, excerpt: string): string {
	const base = [...CORE_KEYWORDS];
	if (tag) base.push(tag.toLowerCase());

	const seen = new Set(base.map((k) => k.toLowerCase()));
	const words = `${title} ${excerpt}`
		.toLowerCase()
		.replace(/[^a-z0-9\s'-]/g, ' ')
		.split(/\s+/)
		.filter((w) => w.length > 3 && !STOP_WORDS.has(w));

	const extra: string[] = [];
	for (const word of words) {
		if (seen.has(word)) continue;
		seen.add(word);
		extra.push(word);
		if (extra.length >= 6) break;
	}

	return [...base, ...extra].join(', ');
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
			const title = data.title ?? entry.name;
			const excerpt = data.excerpt ?? '';
			const tag = data.tag ?? '';
			posts.push({
				slug: entry.name,
				title,
				date: data.date ?? '',
				excerpt,
				tag,
				has_benchmarks: data.has_benchmarks ?? false,
				keywords: data.keywords ?? deriveKeywords(title, tag, excerpt)
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

		const title = data.title ?? slug;
		const excerpt = data.excerpt ?? '';
		const tag = data.tag ?? '';

		return {
			slug,
			title,
			date: data.date ?? '',
			excerpt,
			tag,
			has_benchmarks: data.has_benchmarks ?? false,
			keywords: data.keywords ?? deriveKeywords(title, tag, excerpt),
			content: html
		};
	} catch {
		return null;
	}
}
