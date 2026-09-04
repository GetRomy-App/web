/**
 * SEO/GEO metadata helpers.
 *
 * Keeps keyword derivation and structured-data shapes in one place so blog
 * and labs post pages stay consistent without duplicating logic.
 */

const SITE = 'https://getromy.app';

const BASE_KEYWORDS = [
	'donor intelligence',
	'nonprofit fundraising',
	'prospect research',
	'AI donor research',
	'wealth screening'
];

const STOP_WORDS = new Set([
	'the',
	'a',
	'an',
	'is',
	'are',
	'was',
	'were',
	'of',
	'to',
	'in',
	'on',
	'for',
	'and',
	'or',
	'but',
	'be',
	'with',
	'at',
	'by',
	'from',
	'this',
	'that',
	'it',
	'you',
	'your',
	'we',
	'our',
	'how',
	'why',
	'what',
	'who',
	'her',
	'his',
	'their',
	'not',
	'have',
	'has',
	'had',
	'youre',
	'dont',
	'didnt'
]);

interface KeywordSource {
	title: string;
	tag: string;
	excerpt: string;
}

/** Derive a per-post keyword list from the post's own title/excerpt/tag, layered on the brand's core terms. */
export function deriveKeywords(post: KeywordSource): string {
	const words = `${post.title} ${post.excerpt}`
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, ' ')
		.split(/\s+/)
		.filter((w) => w.length > 3 && !STOP_WORDS.has(w));

	const uniqueWords = Array.from(new Set(words)).slice(0, 6);
	const tagKeyword = post.tag?.trim().toLowerCase();

	const all = [...BASE_KEYWORDS, tagKeyword, ...uniqueWords].filter((v): v is string => Boolean(v));

	return Array.from(new Set(all)).slice(0, 12).join(', ');
}

interface PostSchemaInput {
	title: string;
	excerpt: string;
	date: string;
	tag: string;
	slug: string;
	path: string; // '/blog/<slug>' or '/labs/blog/<slug>'
}

/** BlogPosting JSON-LD for an individual post page. */
export function postJsonLd(post: PostSchemaInput) {
	const url = `${SITE}${post.path}`;
	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: post.title,
		description: post.excerpt,
		datePublished: post.date,
		dateModified: post.date,
		url,
		mainEntityOfPage: { '@type': 'WebPage', '@id': url },
		image: `${SITE}/og-image.jpg`,
		keywords: post.tag,
		author: {
			'@type': 'Organization',
			name: 'GetRomy LLC',
			url: SITE
		},
		publisher: {
			'@type': 'Organization',
			name: 'GetRomy LLC',
			url: SITE,
			logo: {
				'@type': 'ImageObject',
				url: `${SITE}/icon-logo.png`
			}
		}
	};
}

interface Crumb {
	name: string;
	path: string; // relative, e.g. '/', '/blog', '/blog/my-post'
}

/** BreadcrumbList JSON-LD from an ordered list of crumbs. */
export function breadcrumbJsonLd(crumbs: Crumb[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: crumbs.map((crumb, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: crumb.name,
			item: `${SITE}${crumb.path}`
		}))
	};
}
