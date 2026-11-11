/**
 * Site-wide SEO / GEO constants and JSON-LD builders.
 *
 * Every page renders its head through `<Seo>` (src/lib/components/Seo.svelte), which
 * reads from here. The root layout deliberately renders NO title, description, or
 * canonical, so a page can never inherit the homepage's and get read as its duplicate.
 */

export const SITE_URL = 'https://getromy.app';
export const SITE_NAME = 'Rōmy';
export const ORG_NAME = 'GetRomy LLC';
export const APP_URL = 'https://intel.getromy.app';
export const TWITTER = '@RomyFindsMoney';
export const LOGO_URL = `${SITE_URL}/icon-logo.png`;
export const LOCALE = 'en_US';

export const DEFAULT_IMAGE = {
	url: `${SITE_URL}/og-image.jpg`,
	width: 1920,
	height: 1080,
	alt: 'Rōmy: AI donor prospect research for small nonprofits'
};

export const SAME_AS = ['https://x.com/RomyFindsMoney', 'https://github.com/GetRomy-App'];

/** Core topics the site wants to own, in priority order. */
export const CORE_KEYWORDS = [
	'donor prospect research',
	'prospect research software',
	'ai prospect research',
	'donor intelligence',
	'wealth screening for nonprofits',
	'major donor prospecting',
	'major gift fundraising',
	'fundraising software for small nonprofits',
	'donor research tool',
	'nonprofit fundraising ai'
];

export const HOME_TITLE = 'Rōmy: AI Donor Prospect Research for Small Nonprofits';
export const HOME_DESCRIPTION =
	'Rōmy is AI prospect research software that helps small nonprofits find major donors: wealth indicators, giving history, and affinity signals, without enterprise pricing.';

export function absoluteUrl(path: string): string {
	if (/^https?:\/\//.test(path)) return path;
	return SITE_URL + (path.startsWith('/') ? path : `/${path}`);
}

/** Trim to a sentence or word boundary so meta descriptions don't get cut mid-word in the SERP. */
export function truncate(text: string, max = 160): string {
	const clean = text
		.replace(/[*_`#>]/g, '')
		.replace(/\s+/g, ' ')
		.trim();
	if (clean.length <= max) return clean;
	const slice = clean.slice(0, max);
	const sentenceEnd = Math.max(slice.lastIndexOf('. '), slice.lastIndexOf('? '));
	if (sentenceEnd > max * 0.6) return slice.slice(0, sentenceEnd + 1);
	return slice.slice(0, slice.lastIndexOf(' ')).replace(/[,;:\s—–-]+$/, '') + '…';
}

/** "2026-08-09" → full ISO-8601 so article:published_time and datePublished validate. */
export function isoDate(value: string | undefined): string | undefined {
	if (!value) return undefined;
	const d = new Date(value);
	return isNaN(d.getTime()) ? undefined : d.toISOString();
}

/** Escape a JSON-LD payload so it can sit inside <script> without breaking out. */
export function jsonLd(data: unknown): string {
	return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

export const organizationLd = {
	'@type': 'Organization',
	'@id': `${SITE_URL}/#organization`,
	name: ORG_NAME,
	alternateName: SITE_NAME,
	url: SITE_URL,
	logo: { '@type': 'ImageObject', url: LOGO_URL, width: 256, height: 256 },
	description:
		'GetRomy LLC builds Rōmy, an AI donor intelligence and prospect research platform for small nonprofits.',
	knowsAbout: [
		'Prospect research',
		'Donor intelligence',
		'Wealth screening',
		'Major gift fundraising',
		'Nonprofit fundraising',
		'Donor stewardship',
		'Planned giving',
		'Artificial intelligence'
	],
	contactPoint: {
		'@type': 'ContactPoint',
		email: 'solomon@getromy.app',
		contactType: 'sales',
		availableLanguage: 'English'
	},
	sameAs: SAME_AS
};

export const websiteLd = {
	'@type': 'WebSite',
	'@id': `${SITE_URL}/#website`,
	name: SITE_NAME,
	alternateName: ['Romy', 'GetRomy', 'Rōmy donor intelligence'],
	url: SITE_URL,
	inLanguage: 'en-US',
	publisher: { '@id': `${SITE_URL}/#organization` }
};

export const softwareLd = {
	'@type': 'SoftwareApplication',
	'@id': `${SITE_URL}/#software`,
	name: SITE_NAME,
	alternateName: 'Romy',
	url: SITE_URL,
	installUrl: APP_URL,
	applicationCategory: 'BusinessApplication',
	applicationSubCategory: 'Donor prospect research software',
	operatingSystem: 'Web browser',
	description:
		'Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions. AI-powered prospect research with wealth indicators, giving history, and affinity signals.',
	image: DEFAULT_IMAGE.url,
	screenshot: `${SITE_URL}/screenshot.png`,
	audience: {
		'@type': 'Audience',
		audienceType:
			'Small nonprofits, development directors, major gift officers, executive directors, prospect researchers'
	},
	offers: {
		'@type': 'Offer',
		price: '0',
		priceCurrency: 'USD',
		availability: 'https://schema.org/InStock'
	},
	publisher: { '@id': `${SITE_URL}/#organization` },
	featureList: [
		'AI-powered donor prospect research',
		'Wealth indicator screening',
		'Giving history analysis',
		'Affinity signal detection',
		'Actionable donor profiles with outreach angles',
		'No enterprise contracts or per-seat licensing'
	],
	keywords: CORE_KEYWORDS.join(', ')
};

export interface Crumb {
	name: string;
	path: string;
}

export function breadcrumbLd(crumbs: Crumb[]) {
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

export interface ArticleInput {
	path: string;
	headline: string;
	description: string;
	date?: string;
	section?: string;
	keywords?: string[];
	wordCount?: number;
	type?: 'BlogPosting' | 'Article' | 'TechArticle';
	about?: string[];
}

export function articleLd(a: ArticleInput) {
	const url = absoluteUrl(a.path);
	const published = isoDate(a.date);
	return {
		'@type': a.type ?? 'BlogPosting',
		'@id': `${url}#article`,
		headline: a.headline.slice(0, 110),
		description: a.description,
		url,
		mainEntityOfPage: { '@type': 'WebPage', '@id': url },
		image: [DEFAULT_IMAGE.url],
		datePublished: published,
		dateModified: published,
		inLanguage: 'en-US',
		articleSection: a.section || undefined,
		keywords: a.keywords?.length ? a.keywords.join(', ') : undefined,
		about: a.about?.map((name) => ({ '@type': 'Thing', name })),
		wordCount: a.wordCount,
		isAccessibleForFree: true,
		author: { '@id': `${SITE_URL}/#organization` },
		publisher: { '@id': `${SITE_URL}/#organization` },
		isPartOf: { '@id': `${SITE_URL}/#website` }
	};
}

/** Wrap several nodes in one @graph so crawlers resolve the @id references together. */
export function graph(...nodes: unknown[]) {
	return { '@context': 'https://schema.org', '@graph': nodes.filter(Boolean) };
}
