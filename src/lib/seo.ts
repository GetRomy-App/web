/**
 * Shared SEO / GEO helpers: canonical URLs, meta-description trimming and
 * schema.org (JSON-LD) builders used across every route.
 */

export const SITE_URL = 'https://getromy.app';
export const SITE_NAME = 'Rōmy';
export const LEGAL_NAME = 'GetRomy LLC';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;
export const OG_IMAGE_WIDTH = 1920;
export const OG_IMAGE_HEIGHT = 1080;
export const TWITTER_HANDLE = '@RomyFindsMoney';
export const LOGO_URL = `${SITE_URL}/icon-logo.png`;

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const SOFTWARE_ID = `${SITE_URL}/#software`;
export const BLOG_ID = `${SITE_URL}/blog#blog`;

/** Core topical keywords the whole site competes on. */
export const CORE_KEYWORDS = [
	'donor intelligence',
	'prospect research software',
	'nonprofit prospect research',
	'AI prospect research',
	'wealth screening for nonprofits',
	'major donor prospecting',
	'major gift fundraising',
	'donor research tool',
	'fundraising software for small nonprofits',
	'affordable wealth screening'
];

export function absoluteUrl(path: string): string {
	if (/^https?:\/\//.test(path)) return path;
	return SITE_URL + (path.startsWith('/') ? path : `/${path}`);
}

/** Trim text to a search-snippet-friendly length on a word boundary. */
export function metaDescription(text: string, max = 158): string {
	const clean = (text ?? '').replace(/\s+/g, ' ').trim();
	if (clean.length <= max) return clean;
	const cut = clean.slice(0, max - 1);
	const lastSpace = cut.lastIndexOf(' ');
	return `${cut.slice(0, lastSpace > 80 ? lastSpace : cut.length).replace(/[\s,;:—–-]+$/, '')}…`;
}

/** ISO-8601 date (YYYY-MM-DD) or undefined. */
export function isoDate(value: string | undefined): string | undefined {
	if (!value) return undefined;
	const d = new Date(value);
	if (isNaN(d.getTime())) return undefined;
	return d.toISOString().slice(0, 10);
}

/** Serialize JSON-LD safely for inline <script> injection. */
export function jsonLd(data: unknown): string {
	const json = JSON.stringify(data)
		.replace(/</g, '\\u003c')
		.replace(/>/g, '\\u003e')
		.replace(/&/g, '\\u0026');
	return `<script type="application/ld+json">${json}</script>`;
}

export const organizationSchema = {
	'@type': 'Organization',
	'@id': ORG_ID,
	name: SITE_NAME,
	legalName: LEGAL_NAME,
	alternateName: ['GetRomy', 'Rōmy Donor Intelligence'],
	url: SITE_URL,
	logo: {
		'@type': 'ImageObject',
		url: LOGO_URL
	},
	description:
		'Rōmy is an AI donor intelligence and prospect research platform that helps small nonprofits find new major donors at a fraction of the cost of enterprise wealth screening.',
	foundingLocation: {
		'@type': 'Place',
		name: 'Kerrville, Texas, United States'
	},
	areaServed: 'US',
	knowsAbout: [
		'Prospect research',
		'Donor intelligence',
		'Wealth screening',
		'Major gift fundraising',
		'Planned giving',
		'Donor stewardship',
		'Nonprofit fundraising',
		'Philanthropy',
		'AI for nonprofits'
	],
	contactPoint: {
		'@type': 'ContactPoint',
		email: 'solomon@getromy.app',
		contactType: 'sales',
		availableLanguage: 'English'
	},
	sameAs: ['https://x.com/RomyFindsMoney', 'https://github.com/GetRomy-App']
};

export const websiteSchema = {
	'@type': 'WebSite',
	'@id': WEBSITE_ID,
	url: SITE_URL,
	name: SITE_NAME,
	alternateName: 'Rōmy — Donor Intelligence for Small Nonprofits',
	description:
		'AI donor intelligence, prospect research and wealth screening for small nonprofits — plus field notes on major gifts, stewardship and planned giving.',
	inLanguage: 'en-US',
	publisher: { '@id': ORG_ID }
};

export interface Crumb {
	name: string;
	path: string;
}

export function breadcrumbSchema(crumbs: Crumb[]) {
	return {
		'@type': 'BreadcrumbList',
		itemListElement: crumbs.map((c, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: c.name,
			item: absoluteUrl(c.path)
		}))
	};
}

export function graph(...nodes: unknown[]) {
	return { '@context': 'https://schema.org', '@graph': nodes };
}

export interface ArticleInput {
	path: string;
	headline: string;
	description: string;
	datePublished?: string;
	dateModified?: string;
	section?: string;
	keywords?: string[];
	wordCount?: number;
	type?: 'BlogPosting' | 'Article' | 'TechArticle';
}

export function articleSchema(a: ArticleInput) {
	const url = absoluteUrl(a.path);
	return {
		'@type': a.type ?? 'BlogPosting',
		'@id': `${url}#article`,
		mainEntityOfPage: { '@type': 'WebPage', '@id': url },
		url,
		headline: a.headline.slice(0, 110),
		description: a.description,
		image: {
			'@type': 'ImageObject',
			url: DEFAULT_OG_IMAGE,
			width: OG_IMAGE_WIDTH,
			height: OG_IMAGE_HEIGHT
		},
		datePublished: isoDate(a.datePublished),
		dateModified: isoDate(a.dateModified ?? a.datePublished),
		articleSection: a.section || undefined,
		keywords: a.keywords?.length ? a.keywords.join(', ') : undefined,
		wordCount: a.wordCount,
		inLanguage: 'en-US',
		isAccessibleForFree: true,
		author: { '@id': ORG_ID },
		publisher: { '@id': ORG_ID },
		isPartOf: { '@id': WEBSITE_ID }
	};
}

/** Rough word count of an HTML string. */
export function wordCount(html: string): number {
	const text = html
		.replace(/<[^>]+>/g, ' ')
		.replace(/&[a-z#0-9]+;/gi, ' ')
		.trim();
	return text ? text.split(/\s+/).length : 0;
}
