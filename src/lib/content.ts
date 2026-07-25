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

const CORE_TERMS = [
	'donor intelligence',
	'nonprofit fundraising',
	'prospect research',
	'AI donor research',
	'wealth screening'
];

const STOPWORDS = new Set([
	'the',
	'a',
	'an',
	'and',
	'or',
	'but',
	'of',
	'to',
	'in',
	'on',
	'for',
	'is',
	'are',
	'was',
	'were',
	'be',
	'her',
	'his',
	'their',
	'your',
	'our',
	'you',
	'we',
	'it',
	'its',
	'at',
	'by',
	'with',
	'from',
	'that',
	'this',
	'these',
	'those',
	'as',
	'if',
	'than',
	'then',
	'so',
	'not',
	'no',
	'do',
	'does',
	'did',
	'has',
	'have',
	'had',
	'i',
	'she',
	'he',
	'they',
	'most',
	'people',
	'doing',
	'about',
	'into',
	'under',
	'over',
	'very',
	'just',
	'like',
	'there',
	'here',
	'when',
	'where',
	'what',
	'which',
	'while',
	'some',
	'any',
	'each',
	'every',
	'such',
	'same',
	'also',
	'even',
	'still',
	'much',
	'many',
	'long',
	'short',
	'will',
	'would',
	'should',
	'could',
	'must',
	'might',
	'first',
	'more',
	'been',
	'being',
	'were',
	'gets',
	'get',
	'got',
	'one',
	'two',
	'three',
	'quietly',
	'almost',
	'never',
	'always',
	'because',
	'after',
	'before',
	'again',
	'only'
]);

/** Derive per-post keyword phrases from the title/tag/excerpt without altering the source copy. */
function deriveKeywords(meta: { title: string; tag: string; excerpt: string }): string {
	const tokenize = (text: string) =>
		text
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, ' ')
			.split(/\s+/)
			.filter((w) => w.length > 3 && !STOPWORDS.has(w));

	const tag = meta.tag ? meta.tag.toLowerCase() : '';
	const seen = new Set<string>([...CORE_TERMS, tag]);
	const phrases: string[] = [];
	for (const w of [...tokenize(meta.title), ...tokenize(meta.excerpt)]) {
		if (seen.has(w)) continue;
		seen.add(w);
		phrases.push(w);
		if (phrases.length >= 6) break;
	}

	return [...CORE_TERMS, ...(tag ? [tag] : []), ...phrases].join(', ');
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
				keywords: deriveKeywords({ title, tag, excerpt })
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
			keywords: deriveKeywords({ title, tag, excerpt }),
			content: html
		};
	} catch {
		return null;
	}
}
