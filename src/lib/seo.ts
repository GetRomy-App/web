/**
 * Shared SEO / GEO constants and JSON-LD builders.
 *
 * Every page renders its own <Seo> block (title, description, canonical,
 * Open Graph, Twitter, JSON-LD). The root layout only carries tags that are
 * truly site-wide, so no page ever ships a second canonical or description.
 */

export const SITE_URL = 'https://getromy.app';
export const SITE_NAME = 'Rōmy';
export const BRAND_SUFFIX = ' | Rōmy';
export const ORG_NAME = 'GetRomy LLC';
export const TWITTER = '@RomyFindsMoney';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;
export const DEFAULT_OG_IMAGE_ALT =
	'Rōmy — AI donor intelligence and prospect research for small nonprofits';
export const LOGO_URL = `${SITE_URL}/icon-logo.png`;

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const SOFTWARE_ID = `${SITE_URL}/#software`;

export const HOME_TITLE = 'Rōmy — AI Donor Intelligence & Prospect Research for Small Nonprofits';
export const HOME_DESCRIPTION =
	'Find new major donors for your small nonprofit. Rōmy is AI prospect research with wealth indicators, giving history and affinity signals — without the enterprise wealth-screening price tag.';

export const CORE_KEYWORDS = [
	'donor intelligence',
	'prospect research',
	'AI prospect research',
	'wealth screening',
	'major gift prospecting',
	'donor research software',
	'nonprofit fundraising software',
	'small nonprofit fundraising',
	'wealth screening alternative',
	'affordable prospect research tool'
];

export function absoluteUrl(path: string): string {
	if (/^https?:\/\//.test(path)) return path;
	return SITE_URL + (path.startsWith('/') ? path : `/${path}`);
}

/** Normalise a date-ish string to full ISO 8601, or undefined. */
export function isoDate(value: string | undefined): string | undefined {
	if (!value) return undefined;
	const d = new Date(value);
	return isNaN(d.getTime()) ? undefined : d.toISOString();
}

/** Clamp a description to ~158 chars on a word boundary for SERP snippets. */
export function snippet(text: string, max = 158): string {
	const clean = text.replace(/\s+/g, ' ').trim();
	if (clean.length <= max) return clean;
	const cut = clean.slice(0, max - 1);
	return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:—–-]+$/, '') + '…';
}

export const organizationLd = {
	'@type': 'Organization',
	'@id': ORG_ID,
	name: ORG_NAME,
	alternateName: ['Rōmy', 'Romy', 'GetRomy'],
	url: SITE_URL,
	logo: { '@type': 'ImageObject', url: LOGO_URL, width: 256, height: 256 },
	description:
		'Rōmy is an AI donor intelligence and prospect research platform built for small nonprofits.',
	knowsAbout: [
		'Prospect research',
		'Donor intelligence',
		'Wealth screening',
		'Major gift fundraising',
		'Donor stewardship',
		'Nonprofit fundraising',
		'Planned giving'
	],
	contactPoint: {
		'@type': 'ContactPoint',
		email: 'solomon@getromy.app',
		contactType: 'sales',
		availableLanguage: 'English'
	},
	sameAs: ['https://x.com/RomyFindsMoney', 'https://github.com/GetRomy-App']
};

export const websiteLd = {
	'@type': 'WebSite',
	'@id': WEBSITE_ID,
	url: SITE_URL,
	name: SITE_NAME,
	alternateName: 'Romy',
	description: HOME_DESCRIPTION,
	inLanguage: 'en-US',
	publisher: { '@id': ORG_ID }
};

export const softwareLd = {
	'@type': 'SoftwareApplication',
	'@id': SOFTWARE_ID,
	name: 'Rōmy',
	alternateName: 'Romy',
	url: SITE_URL,
	applicationCategory: 'BusinessApplication',
	applicationSubCategory: 'Donor prospect research and wealth screening',
	operatingSystem: 'Web browser',
	description:
		'AI prospect research for small nonprofits: wealth indicators, giving history, affinity signals and outreach angles distilled into actionable donor profiles, without enterprise contracts or per-seat licensing.',
	image: DEFAULT_OG_IMAGE,
	screenshot: `${SITE_URL}/screenshot.png`,
	audience: {
		'@type': 'Audience',
		audienceType:
			'Small nonprofits, development directors, major gift officers, prospect researchers'
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
		'Actionable donor profiles with outreach angles',
		'No enterprise contracts or per-seat licensing'
	]
};

export function breadcrumbLd(items: { name: string; path: string }[]) {
	return {
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
	headline: string;
	description: string;
	date: string;
	modified?: string;
	section?: string;
	keywords?: string[];
	wordCount?: number;
	type?: 'BlogPosting' | 'TechArticle' | 'Article';
}

export function articleLd(a: ArticleInput) {
	const url = absoluteUrl(a.path);
	const published = isoDate(a.date);
	return {
		'@type': a.type ?? 'BlogPosting',
		'@id': `${url}#article`,
		mainEntityOfPage: { '@type': 'WebPage', '@id': url },
		url,
		headline: a.headline.slice(0, 110),
		description: a.description,
		image: [DEFAULT_OG_IMAGE],
		datePublished: published,
		dateModified: isoDate(a.modified) ?? published,
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

/** Wrap one or more nodes in a single @graph document. */
export function ldGraph(...nodes: object[]): string {
	// Escape `<` so the JSON can never close the surrounding <script> tag.
	return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }).replace(
		/</g,
		'\\u003c'
	);
}
