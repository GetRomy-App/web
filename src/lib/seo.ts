/**
 * Shared SEO / GEO constants and JSON-LD builders.
 *
 * Every page renders its own <Seo> head (title, description, canonical, OG, Twitter,
 * structured data). The root layout only emits site-wide tags, so no page ever ships
 * two <title>s or two canonicals.
 */

export const SITE_URL = 'https://getromy.app';
export const SITE_NAME = 'Rōmy';
export const ORG_NAME = 'GetRomy LLC';
export const APP_URL = 'https://intel.getromy.app';
export const TWITTER = '@RomyFindsMoney';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
export const DEFAULT_OG_IMAGE_ALT =
	'Rōmy — donor intelligence and AI prospect research for small nonprofits';
export const LOGO_URL = `${SITE_URL}/icon-logo.png`;
export const SAME_AS = ['https://x.com/RomyFindsMoney', 'https://github.com/GetRomy-App'];

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const SOFTWARE_ID = `${SITE_URL}/#software`;

export const HOME_TITLE = 'Rōmy — AI Prospect Research & Donor Intelligence for Small Nonprofits';
export const HOME_DESCRIPTION =
	'Find new major donors with AI prospect research built for small nonprofits. Wealth screening, giving history and affinity signals — without enterprise pricing.';

export const CORE_KEYWORDS = [
	'donor intelligence',
	'prospect research',
	'AI prospect research',
	'wealth screening',
	'major gift prospecting',
	'donor research tool',
	'nonprofit fundraising software',
	'small nonprofit fundraising'
];

export function absoluteUrl(path: string): string {
	if (/^https?:\/\//.test(path)) return path;
	return SITE_URL + (path.startsWith('/') ? path : `/${path}`);
}

/** ISO-8601 date with a timezone so Google's Article parser accepts it. */
export function isoDate(value: string | undefined): string | undefined {
	if (!value) return undefined;
	const d = new Date(value);
	if (isNaN(d.getTime())) return undefined;
	return d.toISOString();
}

/** Trim text to a sentence/word boundary under `max` chars (for meta descriptions). */
export function clip(text: string, max = 158): string {
	const clean = text.replace(/\s+/g, ' ').trim();
	if (clean.length <= max) return clean;
	const cut = clean.slice(0, max - 1);
	const sentence = cut.lastIndexOf('. ');
	if (sentence > max * 0.6) return cut.slice(0, sentence + 1);
	return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:—–-]+$/, '') + '…';
}

/** Escape JSON for safe embedding inside a <script> tag. */
export function jsonLdScript(data: unknown): string {
	const json = JSON.stringify(data)
		.replace(/</g, '\\u003c')
		.replace(/>/g, '\\u003e')
		.replace(/&/g, '\\u0026');
	return `<script type="application/ld+json">${json}</script>`;
}

export const organizationLd = {
	'@context': 'https://schema.org',
	'@type': 'Organization',
	'@id': ORG_ID,
	name: ORG_NAME,
	brand: { '@type': 'Brand', name: SITE_NAME },
	url: SITE_URL,
	logo: { '@type': 'ImageObject', url: LOGO_URL, width: 256, height: 256 },
	description:
		'Rōmy is a donor intelligence and AI prospect research platform for small nonprofits.',
	email: 'howard@getromy.app',
	contactPoint: {
		'@type': 'ContactPoint',
		email: 'solomon@getromy.app',
		contactType: 'sales',
		availableLanguage: 'English'
	},
	knowsAbout: [
		'Prospect research',
		'Donor intelligence',
		'Wealth screening',
		'Major gift fundraising',
		'Donor stewardship',
		'Planned giving',
		'Nonprofit fundraising'
	],
	sameAs: SAME_AS
};

export const websiteLd = {
	'@context': 'https://schema.org',
	'@type': 'WebSite',
	'@id': WEBSITE_ID,
	url: SITE_URL,
	name: SITE_NAME,
	description: HOME_DESCRIPTION,
	inLanguage: 'en-US',
	publisher: { '@id': ORG_ID }
};

export const softwareLd = {
	'@context': 'https://schema.org',
	'@type': 'SoftwareApplication',
	'@id': SOFTWARE_ID,
	name: SITE_NAME,
	url: SITE_URL,
	applicationCategory: 'BusinessApplication',
	applicationSubCategory: 'Donor prospect research',
	operatingSystem: 'Web browser',
	image: DEFAULT_OG_IMAGE,
	screenshot: `${SITE_URL}/screenshot.png`,
	description:
		'Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions. AI-powered prospect research with wealth indicators, giving history, and affinity signals.',
	audience: {
		'@type': 'Audience',
		audienceType: 'Small nonprofits, development directors and major gift officers'
	},
	offers: {
		'@type': 'Offer',
		price: '0',
		priceCurrency: 'USD',
		availability: 'https://schema.org/InStock',
		url: APP_URL
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
	headline: string;
	description: string;
	date: string;
	section?: string;
	keywords?: string[];
	wordCount?: number;
	type?: 'BlogPosting' | 'Article' | 'TechArticle';
}

export function articleLd(a: ArticleInput) {
	const url = absoluteUrl(a.path);
	const published = isoDate(a.date);
	return {
		'@context': 'https://schema.org',
		'@type': a.type ?? 'BlogPosting',
		'@id': `${url}#article`,
		mainEntityOfPage: { '@type': 'WebPage', '@id': url },
		url,
		headline: a.headline.slice(0, 110),
		description: a.description,
		image: [DEFAULT_OG_IMAGE],
		datePublished: published,
		dateModified: published,
		inLanguage: 'en-US',
		articleSection: a.section || undefined,
		keywords: a.keywords?.length ? a.keywords.join(', ') : undefined,
		wordCount: a.wordCount,
		author: { '@type': 'Organization', '@id': ORG_ID, name: ORG_NAME, url: SITE_URL },
		publisher: { '@id': ORG_ID },
		isPartOf: { '@id': WEBSITE_ID },
		about: { '@id': SOFTWARE_ID }
	};
}
