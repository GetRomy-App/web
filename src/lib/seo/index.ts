/**
 * Shared SEO / GEO helpers: site constants, description trimming and
 * schema.org JSON-LD builders. Every page renders its head through
 * `$lib/components/Seo.svelte`, which uses these.
 */

export const SITE_URL = 'https://getromy.app';
export const SITE_NAME = 'Rōmy';
export const LEGAL_NAME = 'GetRomy LLC';
export const DEFAULT_OG_IMAGE = {
	url: `${SITE_URL}/og.jpg`,
	width: 1200,
	height: 630,
	alt: 'Rōmy — AI donor prospect research for small nonprofits'
};
export const LOGO_URL = `${SITE_URL}/icon-logo.png`;
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const SOFTWARE_ID = `${SITE_URL}/#software`;

/** Core topics we want search and answer engines to associate with the site. */
export const SITE_KEYWORDS = [
	'nonprofit prospect research',
	'donor prospect research',
	'AI prospect research',
	'donor intelligence',
	'wealth screening for nonprofits',
	'major gift prospecting',
	'major donor research',
	'small nonprofit fundraising',
	'donor research tool',
	'fundraising software for small nonprofits'
];

export function absoluteUrl(path: string): string {
	if (/^https?:\/\//.test(path)) return path;
	return SITE_URL + (path.startsWith('/') ? path : `/${path}`);
}

/** Strip Markdoc/markdown emphasis so excerpts read cleanly in snippets. */
export function plainText(input: string): string {
	return input
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/[*_`]+/g, '')
		.replace(/\s+/g, ' ')
		.trim();
}

/** Trim to a search-snippet-friendly length on a word boundary. */
export function snippet(input: string, max = 158): string {
	const text = plainText(input);
	if (text.length <= max) return text;
	const cut = text.slice(0, max - 1);
	const lastSpace = cut.lastIndexOf(' ');
	return `${cut.slice(0, lastSpace > 80 ? lastSpace : cut.length).replace(/[\s,;:—–-]+$/, '')}…`;
}

/** Safe for embedding inside <script type="application/ld+json">. */
export function jsonLdString(data: unknown): string {
	return JSON.stringify(data)
		.replace(/</g, '\\u003c')
		.replace(/>/g, '\\u003e')
		.replace(/&/g, '\\u0026');
}

export function toIsoDate(value: string | undefined): string | undefined {
	if (!value) return undefined;
	const d = new Date(value);
	return isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
}

export const organizationLd = {
	'@context': 'https://schema.org',
	'@type': 'Organization',
	'@id': ORG_ID,
	name: SITE_NAME,
	legalName: LEGAL_NAME,
	alternateName: ['Romy', 'GetRomy', 'Rōmy Donor Intelligence'],
	url: SITE_URL,
	logo: { '@type': 'ImageObject', url: LOGO_URL, width: 256, height: 256 },
	image: DEFAULT_OG_IMAGE.url,
	description:
		'Rōmy is an AI donor-intelligence and prospect-research platform that helps small nonprofits find new major donors at a fraction of the cost of enterprise wealth screening.',
	knowsAbout: SITE_KEYWORDS,
	contactPoint: {
		'@type': 'ContactPoint',
		email: 'solomon@getromy.app',
		contactType: 'sales',
		availableLanguage: 'en'
	},
	sameAs: ['https://x.com/RomyFindsMoney', 'https://github.com/GetRomy-App']
};

export const websiteLd = {
	'@context': 'https://schema.org',
	'@type': 'WebSite',
	'@id': WEBSITE_ID,
	url: SITE_URL,
	name: SITE_NAME,
	alternateName: 'Romy',
	description: 'AI donor prospect research and donor intelligence for small nonprofits.',
	inLanguage: 'en-US',
	publisher: { '@id': ORG_ID }
};

export interface Crumb {
	name: string;
	path: string;
}

export function breadcrumbLd(crumbs: Crumb[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: crumbs.map((c, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: c.name,
			item: absoluteUrl(c.path)
		}))
	};
}

export interface ArticleInput {
	path: string;
	title: string;
	description: string;
	date: string;
	updated?: string;
	section?: string;
	keywords?: string[];
	wordCount?: number;
}

export function articleLd(a: ArticleInput) {
	const url = absoluteUrl(a.path);
	const published = toIsoDate(a.date);
	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		'@id': `${url}#article`,
		mainEntityOfPage: { '@type': 'WebPage', '@id': url },
		url,
		headline: a.title.length > 110 ? snippet(a.title, 110) : a.title,
		description: a.description,
		image: [DEFAULT_OG_IMAGE.url],
		datePublished: published,
		dateModified: toIsoDate(a.updated) ?? published,
		author: { '@id': ORG_ID, '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
		publisher: { '@id': ORG_ID },
		isPartOf: { '@id': WEBSITE_ID },
		inLanguage: 'en-US',
		articleSection: a.section || undefined,
		keywords: a.keywords?.length ? a.keywords.join(', ') : undefined,
		wordCount: a.wordCount || undefined,
		about: { '@id': SOFTWARE_ID }
	};
}
