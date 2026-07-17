export const SITE_URL = 'https://getromy.app';
export const OG_IMAGE = {
	url: `${SITE_URL}/og-image.jpg`,
	width: 1920,
	height: 1080
};

const CORE_KEYWORDS = [
	'donor intelligence',
	'nonprofit fundraising',
	'prospect research',
	'AI donor research',
	'wealth screening',
	'major donor prospecting'
];

// Extra long-tail terms layered in per post tag, on top of CORE_KEYWORDS.
const TAG_KEYWORDS: Record<string, string[]> = {
	'Field Notes': [
		'donor stewardship',
		'donor relationships',
		'individual giving',
		'donor retention strategy'
	],
	Industry: [
		'nonprofit fundraising trends',
		'philanthropy industry analysis',
		'fundraising strategy for nonprofits'
	],
	Research: [
		'AI prospect research benchmark',
		'donor intelligence research',
		'nonprofit AI benchmark'
	],
	Engineering: [
		'donor intelligence platform engineering',
		'fundraising software development',
		'AI infrastructure for nonprofits'
	],
	'Data Science': [
		'donor data science',
		'predictive fundraising analytics',
		'wealth screening data model'
	]
};

export interface KeywordablePost {
	title: string;
	tag: string;
}

// Meta-keywords carry little ranking weight on their own, but they're free
// long-tail signal and cheap for GEO crawlers that still read them.
export function postKeywords(post: KeywordablePost): string {
	const tagTerms = TAG_KEYWORDS[post.tag] ?? [];
	return [...tagTerms, post.tag.toLowerCase(), ...CORE_KEYWORDS].join(', ');
}

export interface SchemaPost {
	slug: string;
	title: string;
	date: string;
	excerpt: string;
	tag: string;
}

export function blogPostingSchema(post: SchemaPost, path: string) {
	const url = `${SITE_URL}${path}`;
	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: post.title,
		description: post.excerpt,
		url,
		datePublished: post.date,
		dateModified: post.date,
		keywords: postKeywords(post),
		articleSection: post.tag,
		image: OG_IMAGE.url,
		author: {
			'@type': 'Organization',
			name: 'Rōmy',
			url: SITE_URL
		},
		publisher: {
			'@type': 'Organization',
			name: 'GetRomy LLC',
			url: SITE_URL,
			logo: {
				'@type': 'ImageObject',
				url: `${SITE_URL}/icon-logo.png`
			}
		},
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': url
		}
	};
}

export interface BreadcrumbItem {
	name: string;
	path: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
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

export function collectionPageSchema(
	name: string,
	description: string,
	path: string,
	posts: SchemaPost[],
	postPathPrefix: string
) {
	return {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name,
		description,
		url: `${SITE_URL}${path}`,
		mainEntity: {
			'@type': 'ItemList',
			itemListElement: posts.map((post, i) => ({
				'@type': 'ListItem',
				position: i + 1,
				url: `${SITE_URL}${postPathPrefix}/${post.slug}`,
				name: post.title
			}))
		}
	};
}
