/**
 * Shared SEO / GEO (generative-engine optimization) helpers.
 *
 * These build metadata (keywords, JSON-LD) FROM existing frontmatter —
 * they never invent or alter the underlying title/excerpt/body copy.
 */

const SITE = 'https://getromy.app';
const OG_IMAGE = `${SITE}/og-image.jpg`;
const LOGO = `${SITE}/icon-logo.png`;

const BASE_KEYWORDS = [
	'nonprofit donor intelligence',
	'AI donor research',
	'prospect research tool',
	'wealth screening',
	'major donor prospecting',
	'donor discovery platform'
];

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
	'for',
	'is',
	'was',
	'your',
	'you',
	'with',
	'at',
	'by',
	'from',
	'it',
	'that',
	'this',
	'are',
	'as',
	'be',
	'not',
	'her',
	'his',
	'their',
	'was',
	'were',
	"you're",
	'she',
	'he',
	'they',
	'we',
	'i',
	'but',
	'so',
	'if',
	'than',
	'then'
]);

export interface PostLike {
	slug: string;
	title: string;
	excerpt: string;
	tag: string;
	date: string;
}

/** Derive a unique, per-post keyword list from the post's own title/excerpt/tag. */
export function buildPostKeywords(post: PostLike): string {
	const words = `${post.title} ${post.excerpt}`
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, ' ')
		.split(/\s+/)
		.filter((w) => w.length > 3 && !STOPWORDS.has(w));

	const uniqueWords = Array.from(new Set(words)).slice(0, 8);
	const tagKeyword = post.tag ? post.tag.toLowerCase() : '';

	return Array.from(new Set([tagKeyword, ...uniqueWords, ...BASE_KEYWORDS].filter(Boolean))).join(
		', '
	);
}

/** BlogPosting JSON-LD for a single article page. */
export function blogPostingSchema(post: PostLike, url: string) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: post.title,
		description: post.excerpt,
		image: OG_IMAGE,
		datePublished: post.date,
		dateModified: post.date,
		inLanguage: 'en-US',
		author: {
			'@type': 'Organization',
			name: 'Rōmy',
			url: SITE
		},
		publisher: {
			'@type': 'Organization',
			name: 'GetRomy LLC',
			logo: {
				'@type': 'ImageObject',
				url: LOGO
			}
		},
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': url
		},
		keywords: buildPostKeywords(post),
		articleSection: post.tag,
		url
	};
}

/** BreadcrumbList JSON-LD. */
export function breadcrumbSchema(items: { name: string; url: string }[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: item.name,
			item: item.url
		}))
	};
}

/** CollectionPage + ItemList JSON-LD for a blog/labs index page. */
export function collectionPageSchema(opts: {
	name: string;
	description: string;
	url: string;
	posts: { title: string; url: string }[];
}) {
	return {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: opts.name,
		description: opts.description,
		url: opts.url,
		isPartOf: {
			'@type': 'WebSite',
			name: 'Rōmy',
			url: SITE
		},
		mainEntity: {
			'@type': 'ItemList',
			itemListElement: opts.posts.map((p, i) => ({
				'@type': 'ListItem',
				position: i + 1,
				url: p.url,
				name: p.title
			}))
		}
	};
}

export function jsonLd(data: unknown): string {
	return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

export { SITE, OG_IMAGE, LOGO };
