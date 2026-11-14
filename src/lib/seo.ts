/**
 * Central SEO / GEO (generative-engine optimisation) helpers.
 *
 * Every route renders <Seo /> with a title, description and path; this module
 * owns the site-wide constants, keyword clusters and JSON-LD builders so the
 * metadata stays consistent (one canonical, one title, one og:image per page).
 */

export const SITE_URL = 'https://getromy.app';
export const SITE_NAME = 'Rōmy';
export const ORG_NAME = 'GetRomy LLC';
export const TWITTER = '@RomyFindsMoney';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;
export const DEFAULT_OG_IMAGE_ALT =
	'Rōmy — AI donor intelligence and prospect research for small nonprofits';
export const LOGO_URL = `${SITE_URL}/icon-logo.png`;

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const SOFTWARE_ID = `${SITE_URL}/#software`;

/** The primary search intents Rōmy competes for. */
export const CORE_KEYWORDS = [
	'donor intelligence',
	'prospect research',
	'AI prospect research',
	'donor prospecting',
	'wealth screening',
	'major gift fundraising',
	'major donor prospecting',
	'nonprofit fundraising software',
	'fundraising software for small nonprofits',
	'donor research tool',
	'affordable wealth screening',
	'donor wealth indicators',
	'philanthropic giving history'
];

/** Topic clusters keyed by post tag, so each article targets its own long-tail intents. */
export const TAG_KEYWORDS: Record<string, string[]> = {
	'Field Notes': [
		'major gift fundraising',
		'donor stewardship',
		'donor relationships',
		'donor retention',
		'major gift officer',
		'small nonprofit fundraising',
		'fundraising advice',
		'planned giving',
		'donor cultivation'
	],
	Industry: [
		'nonprofit fundraising strategy',
		'major gifts',
		'wealth screening',
		'capacity scores',
		'donor pipeline',
		'nonprofit development',
		'fundraising trends'
	],
	Research: [
		'AI prospect research benchmark',
		'AI for nonprofits',
		'ChatGPT vs Claude vs Gemini for fundraising',
		'prospect research accuracy',
		'nonprofit AI evaluation'
	],
	Engineering: [
		'donor intelligence engine',
		'AI prospect research cost',
		'wealth screening cost',
		'nonprofit technology'
	],
	'Data Science': [
		'wealth indicators',
		'donor data analysis',
		'giving capacity',
		'philanthropic signals'
	]
};

export function keywordsFor(tag?: string, extra: string[] = []): string {
	const list = [...extra, ...(tag ? (TAG_KEYWORDS[tag] ?? []) : []), ...CORE_KEYWORDS, 'Rōmy'];
	return [...new Set(list.map((k) => k.trim()).filter(Boolean))].join(', ');
}

/** Strip Markdown emphasis/links so excerpts read cleanly in snippets. */
export function plainText(value: string): string {
	return value
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/[*_`#>]/g, '')
		.replace(/\s+/g, ' ')
		.trim();
}

/**
 * Trim to a SERP-friendly length on a sentence or word boundary.
 * Google shows ~155–160 characters of a meta description.
 */
export function truncate(value: string, max = 158): string {
	const text = plainText(value);
	if (text.length <= max) return text;
	const slice = text.slice(0, max);
	const sentenceEnd = Math.max(
		slice.lastIndexOf('. '),
		slice.lastIndexOf('? '),
		slice.lastIndexOf('! ')
	);
	if (sentenceEnd > max * 0.55) return slice.slice(0, sentenceEnd + 1);
	const wordEnd = slice.lastIndexOf(' ');
	return `${slice.slice(0, wordEnd > 0 ? wordEnd : max).replace(/[,;:—–-]+$/, '')}…`;
}

export function absoluteUrl(path: string): string {
	if (/^https?:\/\//.test(path)) return path;
	return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/** ISO-8601 date, or undefined when unparseable. */
export function isoDate(value?: string): string | undefined {
	if (!value) return undefined;
	const d = new Date(value);
	return isNaN(d.getTime()) ? undefined : d.toISOString();
}

export function wordCount(html: string): number {
	return html
		.replace(/<[^>]+>/g, ' ')
		.split(/\s+/)
		.filter(Boolean).length;
}

/** Serialise JSON-LD safely for inline <script> injection. */
export function jsonLd(data: unknown): string {
	return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

// ---------------------------------------------------------------------------
// JSON-LD builders
// ---------------------------------------------------------------------------

export const organizationSchema = {
	'@type': 'Organization',
	'@id': ORG_ID,
	name: ORG_NAME,
	alternateName: ['Rōmy', 'Romy', 'GetRomy'],
	url: SITE_URL,
	logo: {
		'@type': 'ImageObject',
		url: LOGO_URL
	},
	image: DEFAULT_OG_IMAGE,
	description:
		'Rōmy is an AI donor intelligence and prospect research platform that helps small nonprofits find new major donors at a fraction of the cost of enterprise wealth screening.',
	knowsAbout: [
		'Prospect research',
		'Donor intelligence',
		'Wealth screening',
		'Major gift fundraising',
		'Nonprofit fundraising',
		'Philanthropy',
		'Donor stewardship',
		'Artificial intelligence for nonprofits'
	],
	contactPoint: {
		'@type': 'ContactPoint',
		email: 'solomon@getromy.app',
		contactType: 'sales',
		availableLanguage: ['English']
	},
	sameAs: ['https://x.com/RomyFindsMoney', 'https://github.com/GetRomy-App']
};

export const websiteSchema = {
	'@type': 'WebSite',
	'@id': WEBSITE_ID,
	url: SITE_URL,
	name: SITE_NAME,
	alternateName: ['Romy', 'GetRomy', 'Rōmy Donor Intelligence'],
	description:
		'AI donor intelligence and prospect research for small nonprofits, plus field notes on major gift fundraising.',
	publisher: { '@id': ORG_ID },
	inLanguage: 'en-US'
};

export const softwareSchema = {
	'@type': 'SoftwareApplication',
	'@id': SOFTWARE_ID,
	name: 'Rōmy',
	alternateName: 'Romy',
	url: SITE_URL,
	applicationCategory: 'BusinessApplication',
	applicationSubCategory: 'Nonprofit prospect research and donor intelligence',
	operatingSystem: 'Web',
	image: DEFAULT_OG_IMAGE,
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
			'Small nonprofits, development directors, major gift officers, prospect researchers'
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

export function breadcrumbSchema(items: { name: string; path: string }[]) {
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

export function graph(...nodes: unknown[]) {
	return { '@context': 'https://schema.org', '@graph': nodes };
}

interface ArticleInput {
	title: string;
	description: string;
	path: string;
	date: string;
	tag: string;
	html: string;
	type?: 'BlogPosting' | 'TechArticle';
}

export function articleSchema({
	title,
	description,
	path,
	date,
	tag,
	html,
	type = 'BlogPosting'
}: ArticleInput) {
	const url = absoluteUrl(path);
	const published = isoDate(date);
	return {
		'@type': type,
		'@id': `${url}#article`,
		headline: title.length > 110 ? truncate(title, 110) : title,
		name: title,
		description,
		url,
		mainEntityOfPage: { '@type': 'WebPage', '@id': url },
		datePublished: published,
		dateModified: published,
		inLanguage: 'en-US',
		articleSection: tag,
		keywords: keywordsFor(tag),
		wordCount: wordCount(html),
		image: { '@type': 'ImageObject', url: DEFAULT_OG_IMAGE, width: 1920, height: 1080 },
		author: { '@id': ORG_ID },
		publisher: { '@id': ORG_ID },
		isPartOf: { '@id': WEBSITE_ID },
		about: [
			{ '@type': 'Thing', name: 'Major gift fundraising' },
			{ '@type': 'Thing', name: 'Prospect research' },
			{ '@type': 'Thing', name: 'Donor intelligence' }
		]
	};
}
