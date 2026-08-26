/**
 * Shared SEO/GEO helpers: canonical URLs, per-post keyword derivation, and
 * structured data (JSON-LD) builders. Centralised so every route emits
 * consistent, accurate metadata — no per-page copy/paste drift.
 */

export const SITE_URL = 'https://getromy.app';
export const SITE_NAME = 'Rōmy';
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;
export const OG_IMAGE_WIDTH = 1920;
export const OG_IMAGE_HEIGHT = 1080;

export function absoluteUrl(pathname: string): string {
	return `${SITE_URL}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
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
	'is',
	'was',
	'were',
	'are',
	'be',
	'your',
	'you',
	'we',
	'it',
	'its',
	'this',
	'that',
	'with',
	'from',
	'by',
	'as',
	'than',
	'then',
	'into',
	'about',
	'her',
	'his',
	'their',
	'our',
	'my',
	'who',
	'what',
	'when',
	'where',
	'why',
	'how',
	'not',
	'no',
	'yes',
	'do',
	'did',
	'does',
	'has',
	'have',
	'had',
	'can',
	'could',
	'will',
	'would',
	'should',
	'if',
	'so',
	'up',
	'down',
	'out',
	'off',
	'over',
	'under',
	'again',
	'once',
	'here',
	'there',
	'all',
	'any',
	'both',
	'each',
	'few',
	'more',
	'most',
	'other',
	'some',
	'such',
	'only',
	'own',
	'same',
	'too',
	'very',
	'just',
	'also'
]);

/** Topic keywords that reflect what each editorial tag actually covers on the site. */
const TAG_KEYWORDS: Record<string, string[]> = {
	'Field Notes': [
		'donor stories',
		'major gift fundraising',
		'nonprofit development',
		'donor relationships'
	],
	Industry: [
		'nonprofit fundraising industry',
		'donor intelligence trends',
		'fundraising technology'
	],
	'Data Science': ['AI donor research', 'prospect research data', 'fundraising analytics'],
	Engineering: ['donor intelligence platform', 'AI prospect research engineering'],
	Research: ['nonprofit fundraising research', 'donor prospecting research']
};

const BASE_KEYWORDS = [
	'Rōmy',
	'donor intelligence',
	'nonprofit fundraising',
	'prospect research',
	'AI donor research'
];

function titleTerms(title: string, max = 6): string[] {
	const seen = new Set<string>();
	const out: string[] = [];
	for (const raw of title.split(/\s+/)) {
		const word = raw.replace(/[’'"“”—–,.!?:;()]/g, '');
		if (word.length <= 3 || STOPWORDS.has(word.toLowerCase())) continue;
		const key = word.toLowerCase();
		if (seen.has(key)) continue;
		seen.add(key);
		out.push(word);
		if (out.length >= max) break;
	}
	return out;
}

/**
 * Builds a per-post keywords string from the post's own title and tag,
 * rather than one static list reused across every article. Keeps the
 * <meta name="keywords"> and article:tag values specific to what the post
 * is actually about.
 */
export function deriveKeywords(title: string, tag: string): string {
	const tagTerms = TAG_KEYWORDS[tag] ?? [];
	const combined = [...BASE_KEYWORDS, ...tagTerms, tag, ...titleTerms(title)];

	const seen = new Set<string>();
	const out: string[] = [];
	for (const term of combined) {
		const key = term.toLowerCase();
		if (seen.has(key)) continue;
		seen.add(key);
		out.push(term);
	}
	return out.slice(0, 15).join(', ');
}

export interface ArticleLdInput {
	title: string;
	excerpt: string;
	date: string;
	tag: string;
	slug: string;
	path: string; // e.g. /blog/my-post or /labs/blog/my-post
}

/** BlogPosting structured data — matches the visible header, byline, and body of the article page. */
export function buildArticleLd(post: ArticleLdInput) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: post.title,
		description: post.excerpt,
		datePublished: post.date,
		dateModified: post.date,
		url: absoluteUrl(post.path),
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': absoluteUrl(post.path)
		},
		image: OG_IMAGE,
		articleSection: post.tag,
		author: {
			'@type': 'Organization',
			name: SITE_NAME,
			url: SITE_URL
		},
		publisher: {
			'@type': 'Organization',
			name: 'GetRomy LLC',
			logo: {
				'@type': 'ImageObject',
				url: `${SITE_URL}/icon-logo.png`
			}
		}
	};
}

export interface BreadcrumbItem {
	name: string;
	path: string;
}

/** BreadcrumbList structured data — mirrors the in-page back/breadcrumb links, never invents a hierarchy that isn't shown. */
export function buildBreadcrumbLd(items: BreadcrumbItem[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: item.name,
			item: absoluteUrl(item.path)
		}))
	};
}

export interface BlogListLdInput {
	name: string;
	description: string;
	path: string;
	posts: { title: string; slug: string; date: string; excerpt: string; path: string }[];
}

/** Blog collection structured data — lists exactly the posts rendered on the listing page, in the same order. */
export function buildBlogLd(input: BlogListLdInput) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Blog',
		name: input.name,
		description: input.description,
		url: absoluteUrl(input.path),
		blogPost: input.posts.map((post) => ({
			'@type': 'BlogPosting',
			headline: post.title,
			datePublished: post.date,
			description: post.excerpt,
			url: absoluteUrl(post.path)
		}))
	};
}
