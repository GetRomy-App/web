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

/** Words too generic to carry search intent on their own — dropped when deriving keywords from a title. */
const STOPWORDS = new Set([
	'a',
	'an',
	'the',
	'is',
	'are',
	'was',
	'were',
	'and',
	'or',
	'but',
	'of',
	'to',
	'in',
	'on',
	'for',
	'with',
	'at',
	'by',
	'from',
	'as',
	'it',
	"it's",
	'this',
	'that',
	'you',
	'your',
	'her',
	'his',
	'their',
	'has',
	'have',
	'had',
	'not',
	'no',
	'be',
	'do',
	'did',
	'does',
	'if',
	'so',
	'we',
	'i',
	'he',
	'she',
	'they',
	'them',
	'can',
	'will',
	'would',
	'could',
	'should',
	'than',
	'then',
	'also',
	'never',
	'about',
	'into',
	'out',
	'up',
	'down',
	'still',
	'just',
	'who'
]);

/** Seed terms per editorial tag — merged with title-derived words so every post gets a distinct, on-topic meta keywords tag. */
const TAG_SEED_KEYWORDS: Record<string, string[]> = {
	Engineering: [
		'donor intelligence software',
		'AI prospect research tool',
		'nonprofit fundraising technology'
	],
	Research: ['donor research', 'wealth screening research', 'philanthropy data'],
	'Data Science': ['predictive donor analytics', 'AI donor research', 'wealth indicators'],
	Industry: [
		'nonprofit fundraising trends',
		'major gift fundraising',
		'development office strategy'
	],
	'Field Notes': ['major donor prospecting', 'donor relationships', 'nonprofit fundraising']
};

/** Derives a post-specific meta keywords string from its title and tag, instead of one generic string reused site-wide. */
export function deriveKeywords(title: string, tag: string): string {
	const titleWords = title
		.toLowerCase()
		.replace(/[^a-z0-9\s'-]/g, '')
		.split(/\s+/)
		.filter((w) => w.length > 2 && !STOPWORDS.has(w));

	const uniqueTitleWords = Array.from(new Set(titleWords)).slice(0, 6);
	const seeds = TAG_SEED_KEYWORDS[tag] ?? ['donor intelligence', 'nonprofit fundraising'];

	return Array.from(new Set([...uniqueTitleWords, tag.toLowerCase(), ...seeds, 'Rōmy'])).join(', ');
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
			const tag = data.tag ?? '';
			posts.push({
				slug: entry.name,
				title,
				date: data.date ?? '',
				excerpt: data.excerpt ?? '',
				tag,
				has_benchmarks: data.has_benchmarks ?? false,
				keywords: deriveKeywords(title, tag)
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
		const tag = data.tag ?? '';

		return {
			slug,
			title,
			date: data.date ?? '',
			excerpt: data.excerpt ?? '',
			tag,
			has_benchmarks: data.has_benchmarks ?? false,
			keywords: deriveKeywords(title, tag),
			content: html
		};
	} catch {
		return null;
	}
}
