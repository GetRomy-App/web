/**
 * Shared SEO / GEO helpers: site constants, meta-description trimming and
 * schema.org JSON-LD builders. Every page renders its head tags through
 * `$lib/components/Seo.svelte`, which reads from here.
 */

export const SITE_URL = 'https://getromy.app';
export const SITE_NAME = 'Rōmy';
export const LEGAL_NAME = 'GetRomy LLC';
export const TWITTER_HANDLE = '@RomyFindsMoney';
export const DEFAULT_OG_IMAGE = {
	url: `${SITE_URL}/og/default.png`,
	width: 1200,
	height: 630,
	alt: 'Rōmy — AI donor intelligence and prospect research for small nonprofits'
};
export const BLOG_OG_IMAGE = {
	...DEFAULT_OG_IMAGE,
	url: `${SITE_URL}/og/blog.png`,
	alt: 'The Rōmy blog — fundraising, prospect research and major gifts'
};
export const LABS_OG_IMAGE = {
	...DEFAULT_OG_IMAGE,
	url: `${SITE_URL}/og/labs.png`,
	alt: 'Rōmy Labs — PIF-Bench, an open benchmark of AI on nonprofit development work'
};

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const APP_ID = `${SITE_URL}/#software`;
export const BLOG_ID = `${SITE_URL}/blog#blog`;

export type JsonLd = Record<string, unknown>;

export interface OgImage {
	url: string;
	width?: number;
	height?: number;
	alt?: string;
}

export function absoluteUrl(path: string): string {
	if (/^https?:\/\//.test(path)) return path;
	if (path === '/' || path === '') return `${SITE_URL}/`;
	return SITE_URL + (path.startsWith('/') ? path : `/${path}`);
}

/** Trim to a search-snippet friendly length (~155 chars) on a word boundary. */
export function metaDescription(text: string, max = 155): string {
	const clean = text.replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim();
	if (clean.length <= max) return clean;
	const cut = clean.slice(0, max - 1);
	const lastSpace = cut.lastIndexOf(' ');
	return `${cut.slice(0, lastSpace > 80 ? lastSpace : cut.length).replace(/[\s,;:—–-]+$/, '')}…`;
}

/** Serialise JSON-LD safely for inlining inside a <script> tag. */
export function serializeJsonLd(data: JsonLd): string {
	return JSON.stringify(data)
		.replace(/</g, '\\u003c')
		.replace(/>/g, '\\u003e')
		.replace(/&/g, '\\u0026')
		.replace(/\u2028/g, '\\u2028')
		.replace(/\u2029/g, '\\u2029');
}

export const organizationJsonLd: JsonLd = {
	'@context': 'https://schema.org',
	'@type': 'Organization',
	'@id': ORG_ID,
	name: SITE_NAME,
	legalName: LEGAL_NAME,
	alternateName: ['Romy', 'GetRomy', 'Rōmy Donor Intelligence'],
	url: SITE_URL,
	logo: {
		'@type': 'ImageObject',
		url: `${SITE_URL}/icon-logo.png`
	},
	image: DEFAULT_OG_IMAGE.url,
	description:
		'Rōmy is an AI donor intelligence and prospect research platform that helps small nonprofits find new major donors at a fraction of the cost of enterprise wealth screening.',
	knowsAbout: [
		'Prospect research',
		'Wealth screening',
		'Donor intelligence',
		'Major gift fundraising',
		'Nonprofit fundraising',
		'Planned giving',
		'Donor stewardship',
		'AI for nonprofits'
	],
	contactPoint: {
		'@type': 'ContactPoint',
		email: 'solomon@getromy.app',
		contactType: 'sales'
	},
	sameAs: ['https://x.com/RomyFindsMoney', 'https://github.com/GetRomy-App']
};

export const websiteJsonLd: JsonLd = {
	'@context': 'https://schema.org',
	'@type': 'WebSite',
	'@id': WEBSITE_ID,
	name: SITE_NAME,
	alternateName: ['Romy', 'GetRomy'],
	url: `${SITE_URL}/`,
	inLanguage: 'en-US',
	publisher: { '@id': ORG_ID }
};

export const softwareJsonLd: JsonLd = {
	'@context': 'https://schema.org',
	'@type': 'SoftwareApplication',
	'@id': APP_ID,
	name: SITE_NAME,
	alternateName: 'Rōmy Donor Intelligence',
	url: 'https://intel.getromy.app',
	applicationCategory: 'BusinessApplication',
	applicationSubCategory: 'Nonprofit prospect research and wealth screening',
	operatingSystem: 'Web',
	image: DEFAULT_OG_IMAGE.url,
	screenshot: `${SITE_URL}/screenshot.png`,
	description:
		'Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions. AI-powered prospect research with wealth indicators, giving history, and affinity signals.',
	offers: {
		'@type': 'Offer',
		price: '0',
		priceCurrency: 'USD',
		availability: 'https://schema.org/InStock'
	},
	publisher: { '@id': ORG_ID },
	audience: {
		'@type': 'Audience',
		audienceType:
			'Small nonprofits, development directors, major gift officers and prospect researchers'
	},
	featureList: [
		'AI-powered donor prospect research',
		'Wealth indicator screening',
		'Giving history analysis',
		'Affinity signal detection',
		'Actionable donor profiles',
		'No enterprise contracts required'
	]
};

export function breadcrumbJsonLd(items: { name: string; path: string }[]): JsonLd {
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

export interface ArticleInput {
	path: string;
	title: string;
	description: string;
	date: string;
	section?: string;
	keywords?: string[];
	wordCount?: number;
	image?: OgImage;
	isPartOf?: { name: string; path: string };
}

export function articleJsonLd(a: ArticleInput): JsonLd {
	const url = absoluteUrl(a.path);
	const image = a.image ?? DEFAULT_OG_IMAGE;
	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		'@id': `${url}#article`,
		mainEntityOfPage: { '@type': 'WebPage', '@id': url },
		url,
		headline: a.title.length > 110 ? metaDescription(a.title, 110) : a.title,
		description: a.description,
		datePublished: a.date,
		dateModified: a.date,
		inLanguage: 'en-US',
		articleSection: a.section || undefined,
		keywords: a.keywords?.length ? a.keywords.join(', ') : undefined,
		wordCount: a.wordCount || undefined,
		image: { '@type': 'ImageObject', url: image.url, width: image.width, height: image.height },
		author: { '@id': ORG_ID, '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
		publisher: { '@id': ORG_ID },
		isPartOf: a.isPartOf
			? { '@type': 'Blog', name: a.isPartOf.name, url: absoluteUrl(a.isPartOf.path) }
			: undefined,
		about: a.keywords?.slice(0, 3).map((k) => ({ '@type': 'Thing', name: k }))
	};
}

export interface PostLike {
	slug: string;
	title: string;
	date: string;
	excerpt: string;
	tag: string;
	seo_title: string;
	seo_description: string;
	keywords: string[];
	wordCount: number;
}

/** Everything `<Seo>` needs for a blog or labs article. */
export function postSeo(post: PostLike, kind: 'blog' | 'labs') {
	const path = kind === 'blog' ? `/blog/${post.slug}` : `/labs/blog/${post.slug}`;
	const section =
		kind === 'blog' ? { name: 'Blog', path: '/blog' } : { name: 'Labs', path: '/labs' };
	const description = post.seo_description || metaDescription(post.excerpt || post.title);
	const searchTitle = post.seo_title || post.title;
	const image = kind === 'blog' ? BLOG_OG_IMAGE : LABS_OG_IMAGE;
	const keywords = post.keywords;
	return {
		title: `${searchTitle} | ${SITE_NAME}`,
		socialTitle: post.title,
		description,
		path,
		type: 'article' as const,
		image,
		keywords,
		published: post.date,
		section: post.tag,
		tags: keywords,
		jsonLd: [
			articleJsonLd({
				path,
				title: post.title,
				description,
				date: post.date,
				section: post.tag,
				keywords,
				wordCount: post.wordCount,
				image,
				isPartOf: { name: kind === 'blog' ? 'Rōmy Blog' : 'Rōmy Labs', path: section.path }
			}),
			breadcrumbJsonLd([{ name: SITE_NAME, path: '/' }, section, { name: post.title, path }])
		]
	};
}

/** Pick the most related posts by shared keywords, then tag, then recency. */
export function relatedPosts<T extends PostLike>(current: PostLike, all: T[], count = 3): T[] {
	const kw = new Set(current.keywords.map((k) => k.toLowerCase()));
	return all
		.filter((p) => p.slug !== current.slug)
		.map((p) => ({
			p,
			score:
				p.keywords.filter((k) => kw.has(k.toLowerCase())).length * 3 +
				(p.tag === current.tag ? 1 : 0)
		}))
		.sort((a, b) => b.score - a.score || (a.p.date < b.p.date ? 1 : -1))
		.slice(0, count)
		.map(({ p }) => p);
}
