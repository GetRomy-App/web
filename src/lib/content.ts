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

/** Extra search terms per post tag, layered on top of the core product keywords below. */
const TAG_KEYWORDS: Record<string, string> = {
	'Field Notes':
		'major donor fundraising stories, donor stewardship, planned giving, donor relationships, nonprofit development officer',
	Industry:
		'nonprofit fundraising trends, philanthropy industry analysis, fundraising strategy, nonprofit sector insights',
	Research:
		'AI donor research benchmark, prospect research accuracy, donor intelligence testing, fundraising AI evaluation',
	Engineering:
		'donor intelligence software engineering, fundraising technology build, AI product development, nonprofit software architecture',
	'Data Science':
		'donor data science, wealth screening models, predictive fundraising analytics, giving capacity modeling'
};

const STOPWORDS = new Set([
	'the',
	'a',
	'an',
	'and',
	'or',
	'of',
	'to',
	'in',
	'on',
	'at',
	'is',
	'are',
	'for',
	'with',
	'your',
	'you',
	'was',
	'her',
	'his',
	'it',
	'its',
	'be',
	'as',
	'by',
	'who',
	'that',
	'this',
	'not',
	'we',
	'has',
	'have'
]);

/**
 * Per-post SEO keyword list: core product terms + tag-specific phrases + a few
 * distinctive words pulled from the post's own title. Doesn't touch the post's
 * title/excerpt/body — only the <meta name="keywords"> generated from them.
 */
export function getPostKeywords(post: Pick<PostMeta, 'title' | 'tag'>): string {
	const base =
		'donor intelligence, nonprofit fundraising, prospect research, AI donor research, wealth screening';
	const tagKeywords = TAG_KEYWORDS[post.tag] ?? post.tag.toLowerCase();
	const titlePhrase = post.title
		.toLowerCase()
		.replace(/[^a-z0-9\s]/g, '')
		.split(/\s+/)
		.filter((w) => w.length > 3 && !STOPWORDS.has(w))
		.slice(0, 5)
		.join(' ');

	return [base, tagKeywords, titlePhrase].filter(Boolean).join(', ');
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
