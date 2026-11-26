/**
 * Central SEO / GEO configuration.
 *
 * Every page renders its own <Seo /> block (src/lib/components/Seo.svelte) so
 * title, description, canonical and Open Graph tags are always page-specific.
 * The root layout only carries site-wide tags (favicons, Organization +
 * WebSite JSON-LD) — never a canonical, which would point every page at `/`.
 */

export const SITE_URL = 'https://getromy.app';
export const SITE_NAME = 'Rōmy';
export const LEGAL_NAME = 'GetRomy LLC';
export const TWITTER_HANDLE = '@RomyFindsMoney';
export const APP_URL = 'https://intel.getromy.app';

/** 1200×630 social card cropped from the real product screenshot. */
export const DEFAULT_OG_IMAGE = {
	url: `${SITE_URL}/og-romy.jpg`,
	width: 1200,
	height: 630,
	alt: 'Rōmy donor intelligence: a wealth profile of a prospective donor'
};

export const LOGO_URL = `${SITE_URL}/icon-logo.png`;

/** Primary search intents the site competes for. */
export const CORE_KEYWORDS = [
	'donor intelligence',
	'prospect research',
	'AI prospect research',
	'donor prospect research software',
	'wealth screening',
	'major gift prospecting',
	'major donor research',
	'nonprofit fundraising',
	'fundraising software for small nonprofits',
	'donor research tool',
	'giving history',
	'philanthropic capacity',
	'development office'
];

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const SOFTWARE_ID = `${SITE_URL}/#software`;

export function absoluteUrl(path: string): string {
	if (/^https?:\/\//.test(path)) return path;
	return SITE_URL + (path.startsWith('/') ? path : `/${path}`);
}

/** Serialize JSON-LD safely for inline <script> injection. */
export function jsonLdScript(data: unknown): string {
	const json = JSON.stringify(data)
		.replace(/</g, '\\u003c')
		.replace(/>/g, '\\u003e')
		.replace(/&/g, '\\u0026');
	return `<script type="application/ld+json">${json}</script>`;
}

/** Normalize a frontmatter date to a full ISO-8601 string (or undefined). */
export function isoDate(value: string | undefined): string | undefined {
	if (!value) return undefined;
	const d = new Date(value);
	return isNaN(d.getTime()) ? undefined : d.toISOString();
}

export function organizationSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		'@id': ORG_ID,
		name: SITE_NAME,
		legalName: LEGAL_NAME,
		alternateName: ['GetRomy', 'Rōmy Donor Intelligence'],
		url: SITE_URL,
		logo: {
			'@type': 'ImageObject',
			url: LOGO_URL,
			width: 256,
			height: 256
		},
		image: DEFAULT_OG_IMAGE.url,
		description:
			'Rōmy is an AI donor intelligence and prospect research platform that helps small nonprofits find new major donors at a fraction of the cost of existing solutions.',
		knowsAbout: [
			'Prospect research',
			'Donor intelligence',
			'Wealth screening',
			'Major gift fundraising',
			'Nonprofit fundraising',
			'Planned giving',
			'Donor stewardship',
			'Philanthropy'
		],
		contactPoint: {
			'@type': 'ContactPoint',
			email: 'solomon@getromy.app',
			contactType: 'sales',
			availableLanguage: ['English']
		},
		sameAs: ['https://x.com/RomyFindsMoney', 'https://github.com/GetRomy-App']
	};
}

export function websiteSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'@id': WEBSITE_ID,
		url: SITE_URL,
		name: SITE_NAME,
		description: 'Donor intelligence and AI prospect research for small nonprofits.',
		inLanguage: 'en-US',
		publisher: { '@id': ORG_ID }
	};
}

export function softwareSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		'@id': SOFTWARE_ID,
		name: SITE_NAME,
		url: SITE_URL,
		installUrl: APP_URL,
		applicationCategory: 'BusinessApplication',
		applicationSubCategory: 'Donor prospect research',
		operatingSystem: 'Web',
		image: DEFAULT_OG_IMAGE.url,
		screenshot: `${SITE_URL}/screenshot.png`,
		description:
			'Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions. AI-powered prospect research with wealth indicators, giving history, and affinity signals.',
		audience: {
			'@type': 'BusinessAudience',
			audienceType: 'Small nonprofits, development directors, and major gift officers'
		},
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD',
			availability: 'https://schema.org/InStock'
		},
		publisher: { '@id': ORG_ID },
		featureList: [
			'AI-powered donor prospect research',
			'Wealth indicator screening',
			'Giving history analysis',
			'Affinity signal detection',
			'Actionable donor profiles',
			'No enterprise contracts required'
		]
	};
}

export interface Crumb {
	name: string;
	path: string;
}

export function breadcrumbSchema(crumbs: Crumb[]) {
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

/** Map a post tag to extra topical keywords so each article targets its own intent. */
const TAG_KEYWORDS: Record<string, string[]> = {
	'Field Notes': [
		'major gift fundraising',
		'donor relationships',
		'donor stewardship',
		'gift officer advice',
		'small nonprofit fundraising'
	],
	Research: ['AI benchmark', 'prospect research benchmark', 'AI for nonprofits'],
	Engineering: ['AI donor research', 'fundraising technology', 'nonprofit technology'],
	'Data Science': ['wealth indicators', 'donor data', 'predictive fundraising'],
	Industry: ['nonprofit sector', 'fundraising trends', 'development office']
};

export function postKeywords(tag: string, title: string): string[] {
	const base = ['donor intelligence', 'prospect research', 'nonprofit fundraising', 'major donors'];
	const fromTag = TAG_KEYWORDS[tag] ?? [];
	return Array.from(new Set([title, ...fromTag, ...base, tag].filter(Boolean)));
}

export interface ArticleInput {
	title: string;
	description: string;
	path: string;
	date: string;
	tag: string;
	wordCount?: number;
	type?: 'BlogPosting' | 'TechArticle';
	section?: string;
}

export function articleSchema(a: ArticleInput) {
	const url = absoluteUrl(a.path);
	const published = isoDate(a.date);
	return {
		'@context': 'https://schema.org',
		'@type': a.type ?? 'BlogPosting',
		'@id': `${url}#article`,
		mainEntityOfPage: { '@type': 'WebPage', '@id': url },
		url,
		headline: a.title.length > 110 ? a.title.slice(0, 107) + '…' : a.title,
		name: a.title,
		description: a.description,
		image: [DEFAULT_OG_IMAGE.url],
		datePublished: published,
		dateModified: published,
		author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
		publisher: { '@id': ORG_ID },
		isPartOf: { '@id': WEBSITE_ID },
		articleSection: a.section ?? a.tag,
		keywords: postKeywords(a.tag, a.title).join(', '),
		wordCount: a.wordCount,
		inLanguage: 'en-US',
		about: [
			{ '@type': 'Thing', name: 'Nonprofit fundraising' },
			{ '@type': 'Thing', name: 'Prospect research' }
		]
	};
}
