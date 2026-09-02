/**
 * Shared SEO/GEO helpers — metadata only, never touches post content.
 *
 * Keyword lists and JSON-LD are derived at render time from existing
 * frontmatter (title, excerpt, tag, date). Adding a post or changing its
 * title automatically produces correct, unique metadata with no manual
 * per-post edits.
 */

export const SITE = 'https://getromy.app';
export const SITE_NAME = 'Rōmy';
export const OG_IMAGE = `${SITE}/og-image.jpg`;
export const OG_IMAGE_WIDTH = 1920;
export const OG_IMAGE_HEIGHT = 1080;

/** Terms that describe the product itself — appended to every page's keyword list. */
const BASE_KEYWORDS = [
	'donor intelligence',
	'nonprofit fundraising software',
	'AI prospect research',
	'wealth screening',
	'major donor prospecting'
];

const STOPWORDS = new Set([
	'the',
	'a',
	'an',
	'is',
	'are',
	'was',
	'were',
	'to',
	'of',
	'in',
	'on',
	'at',
	'for',
	'and',
	'or',
	'but',
	'her',
	'his',
	'its',
	'you',
	'your',
	'we',
	'i',
	'that',
	'this',
	'it',
	'be',
	'as',
	'with',
	'not'
]);

/** Pull meaningful (non-stopword) words out of a title/excerpt for long-tail keyword coverage. */
function significantWords(text: string): string[] {
	return Array.from(
		new Set(
			text
				.toLowerCase()
				.replace(/[^a-z0-9\s'-]/g, ' ')
				.split(/\s+/)
				.filter((w) => w.length > 3 && !STOPWORDS.has(w))
		)
	);
}

/**
 * Build a unique, per-post meta-keywords string from real frontmatter —
 * no two posts collapse to the same tag-only list.
 */
export function postKeywords(title: string, tag: string, excerpt: string): string {
	const words = [...significantWords(title), ...significantWords(excerpt).slice(0, 6)];
	const specific = words.slice(0, 10);
	const tagTerm = tag ? [tag.toLowerCase()] : [];
	return Array.from(new Set([...specific, ...tagTerm, ...BASE_KEYWORDS])).join(', ');
}

export interface BlogPostingInput {
	title: string;
	description: string;
	url: string;
	datePublished: string;
	tag: string;
}

/** BlogPosting structured data — read by rich-result crawlers and GEO/AI answer engines alike. */
export function blogPostingJsonLd(post: BlogPostingInput) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: post.title,
		description: post.description,
		image: OG_IMAGE,
		datePublished: post.datePublished,
		dateModified: post.datePublished,
		articleSection: post.tag || undefined,
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': post.url
		},
		author: {
			'@type': 'Organization',
			name: SITE_NAME,
			url: SITE
		},
		publisher: {
			'@type': 'Organization',
			name: 'GetRomy LLC',
			logo: {
				'@type': 'ImageObject',
				url: `${SITE}/icon-logo.png`
			}
		}
	};
}

export interface Crumb {
	name: string;
	url: string;
}

/** BreadcrumbList structured data for a page's position in the site hierarchy. */
export function breadcrumbJsonLd(crumbs: Crumb[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: crumbs.map((crumb, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: crumb.name,
			item: crumb.url
		}))
	};
}

export interface BlogListInput {
	name: string;
	description: string;
	url: string;
	posts: { title: string; slug: string; date: string }[];
	basePath: string;
}

/** Blog collection structured data — gives crawlers/AI engines the full, current post list in one place. */
export function blogJsonLd(input: BlogListInput) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Blog',
		name: input.name,
		description: input.description,
		url: input.url,
		blogPost: input.posts.map((post) => ({
			'@type': 'BlogPosting',
			headline: post.title,
			datePublished: post.date,
			url: `${SITE}${input.basePath}/${post.slug}`
		}))
	};
}
