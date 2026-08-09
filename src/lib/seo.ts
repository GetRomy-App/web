/**
 * Shared SEO / GEO (generative-engine optimization) helpers.
 *
 * Centralizes the bits that repeat across every route's <svelte:head> —
 * canonical site URL, default social-preview image, and the keyword /
 * structured-data builders for blog-style pages — so metadata stays
 * consistent without duplicating literals in every +page.svelte.
 */

export const SITE_URL = 'https://getromy.app';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;
export const OG_IMAGE_WIDTH = 1920;
export const OG_IMAGE_HEIGHT = 1080;

/** Terms core to what Rōmy is, applied to every post regardless of tag. */
const CORE_KEYWORDS = [
	'donor intelligence',
	'nonprofit fundraising',
	'prospect research',
	'AI donor research',
	'wealth screening',
	'major donor prospecting'
];

/** Extra long-tail terms layered on by the post's tag. */
const TAG_KEYWORDS: Record<string, string[]> = {
	'Field Notes': [
		'donor stewardship stories',
		'major gift case studies',
		'planned giving',
		'donor retention'
	],
	Industry: [
		'nonprofit fundraising trends',
		'major gift officer strategy',
		'development office operations'
	],
	Research: ['donor research methodology', 'prospect research best practices'],
	Engineering: ['donor intelligence platform', 'AI fundraising technology'],
	'Data Science': ['donor data science', 'predictive major gift modeling']
};

/** Build a comma-separated keywords list for a post, scoped by its tag. */
export function postKeywords(tag: string): string {
	const extra = TAG_KEYWORDS[tag] ?? [];
	const all = [...CORE_KEYWORDS, ...(tag ? [tag.toLowerCase()] : []), ...extra];
	return Array.from(new Set(all)).join(', ');
}

export interface SeoPost {
	slug: string;
	title: string;
	excerpt: string;
	date: string;
	tag: string;
}

/** BlogPosting JSON-LD for a single post page. */
export function blogPostingJsonLd(post: SeoPost, basePath: string) {
	const url = `${SITE_URL}${basePath}/${post.slug}`;
	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: post.title,
		description: post.excerpt,
		datePublished: post.date,
		dateModified: post.date,
		url,
		mainEntityOfPage: { '@type': 'WebPage', '@id': url },
		image: DEFAULT_OG_IMAGE,
		inLanguage: 'en-US',
		articleSection: post.tag,
		keywords: postKeywords(post.tag),
		isPartOf: {
			'@type': 'Blog',
			'@id': `${SITE_URL}${basePath}`
		},
		publisher: {
			'@type': 'Organization',
			name: 'GetRomy LLC',
			url: SITE_URL,
			logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon-logo.png` }
		},
		author: {
			'@type': 'Organization',
			name: 'Rōmy',
			url: SITE_URL
		}
	};
}

/** BreadcrumbList JSON-LD — takes an ordered list of {name, path}. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: item.name,
			item: `${SITE_URL}${item.path}`
		}))
	};
}

/** Blog collection JSON-LD (an ItemList of the posts shown on a listing page). */
export function blogItemListJsonLd(posts: SeoPost[], basePath: string, name: string) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Blog',
		'@id': `${SITE_URL}${basePath}`,
		name,
		url: `${SITE_URL}${basePath}`,
		blogPost: posts.map((p) => ({
			'@type': 'BlogPosting',
			headline: p.title,
			url: `${SITE_URL}${basePath}/${p.slug}`,
			datePublished: p.date
		}))
	};
}
