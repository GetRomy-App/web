/**
 * Shared SEO / GEO helpers. Every page's <head> is built from these so canonicals,
 * descriptions and structured data stay consistent (and never leak between routes).
 */

export const SITE_URL = 'https://getromy.app';
export const SITE_NAME = 'Rōmy';
export const ORG_NAME = 'GetRomy LLC';
export const TWITTER_HANDLE = '@RomyFindsMoney';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;
export const DEFAULT_OG_IMAGE_WIDTH = 1920;
export const DEFAULT_OG_IMAGE_HEIGHT = 1080;
export const LOGO_URL = `${SITE_URL}/icon-logo.png`;

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const SOFTWARE_ID = `${SITE_URL}/#software`;

/** Core terms the whole site should be associated with. */
export const CORE_KEYWORDS = [
	'Rōmy',
	'donor intelligence',
	'prospect research',
	'AI prospect research',
	'wealth screening',
	'donor research software',
	'major gift fundraising',
	'major donor prospecting',
	'small nonprofit fundraising',
	'nonprofit fundraising software',
	'iWave alternative',
	'DonorSearch alternative',
	'WealthEngine alternative'
];

/** Topic keywords per post tag — keeps each article's keyword set relevant, not stuffed. */
const TAG_KEYWORDS: Record<string, string[]> = {
	'Field Notes': [
		'major gifts',
		'donor stewardship',
		'donor relations',
		'major gift officer',
		'planned giving',
		'donor retention',
		'nonprofit fundraising stories',
		'relationship fundraising'
	],
	Industry: [
		'nonprofit fundraising strategy',
		'major gift fundraising',
		'prospect research',
		'wealth screening',
		'development office',
		'fundraising best practices'
	],
	Engineering: [
		'donor intelligence platform',
		'AI prospect research',
		'wealth screening cost',
		'prospect research software',
		'nonprofit technology'
	],
	Research: [
		'AI benchmark',
		'prospect research benchmark',
		'AI for nonprofits',
		'nonprofit AI evaluation'
	],
	'Data Science': [
		'donor data analysis',
		'predictive fundraising',
		'capacity scoring',
		'nonprofit analytics'
	]
};

export function keywordsForTag(tag: string): string[] {
	const extra = TAG_KEYWORDS[tag] ?? [];
	return [
		...new Set([
			...extra,
			'donor intelligence',
			'prospect research',
			'nonprofit fundraising',
			'Rōmy'
		])
	];
}

/**
 * Trim long copy to a search-snippet-sized description (~155 chars) on a word boundary.
 * Search engines truncate anything longer; the full excerpt still ships in og/JSON-LD.
 */
export function metaDescription(text: string, max = 155): string {
	const clean = (text ?? '').replace(/\s+/g, ' ').trim();
	if (clean.length <= max) return clean;
	// Prefer ending on a full sentence if one fits comfortably.
	const sentenceEnd = clean.slice(0, max).search(/[.!?](?=[^.!?]*$)/);
	if (sentenceEnd > max * 0.55) return clean.slice(0, sentenceEnd + 1);
	const cut = clean.slice(0, max - 1);
	const lastSpace = cut.lastIndexOf(' ');
	return `${cut.slice(0, lastSpace > 0 ? lastSpace : cut.length).replace(/[,;:—–-]+$/, '')}…`;
}

/** ISO-8601 date for structured data / article meta; returns '' if unparseable. */
export function isoDate(value: string | undefined): string {
	if (!value) return '';
	const d = new Date(value);
	return isNaN(d.getTime()) ? '' : d.toISOString();
}

export function absoluteUrl(path: string): string {
	if (/^https?:\/\//.test(path)) return path;
	return `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

/** Serialize JSON-LD safely for inline <script> (no `</script>` breakout). */
export function jsonLdScript(data: unknown): string {
	const json = JSON.stringify(data)
		.replace(/</g, '\\u003c')
		.replace(/>/g, '\\u003e')
		.replace(/&/g, '\\u0026');
	return `<script type="application/ld+json">${json}</script>`;
}

/** Rough reading-time + word count from rendered HTML. */
export function wordStats(html: string): { words: number; minutes: number } {
	const text = (html ?? '').replace(/<[^>]+>/g, ' ');
	const words = text.split(/\s+/).filter(Boolean).length;
	return { words, minutes: Math.max(1, Math.round(words / 230)) };
}

export const organizationSchema = {
	'@type': 'Organization',
	'@id': ORG_ID,
	name: ORG_NAME,
	alternateName: ['Rōmy', 'Romy', 'GetRomy'],
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
		'Planned giving',
		'Donor stewardship',
		'Artificial intelligence for nonprofits'
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
	alternateName: ['Romy', 'GetRomy'],
	description: 'AI donor intelligence and prospect research for small nonprofits.',
	inLanguage: 'en-US',
	publisher: { '@id': ORG_ID }
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

export interface ArticleInput {
	title: string;
	description: string;
	path: string;
	date: string;
	tag: string;
	words: number;
	minutes: number;
	keywords: string[];
	section: { name: string; path: string };
}

/** BlogPosting + BreadcrumbList graph for an article page. */
export function articleSchema(a: ArticleInput) {
	const url = absoluteUrl(a.path);
	const published = isoDate(a.date);
	return graph(
		{
			'@type': 'BlogPosting',
			'@id': `${url}#article`,
			mainEntityOfPage: { '@type': 'WebPage', '@id': url },
			url,
			headline: a.title.length > 110 ? `${a.title.slice(0, 107)}…` : a.title,
			name: a.title,
			description: a.description,
			image: {
				'@type': 'ImageObject',
				url: DEFAULT_OG_IMAGE,
				width: DEFAULT_OG_IMAGE_WIDTH,
				height: DEFAULT_OG_IMAGE_HEIGHT
			},
			datePublished: published || undefined,
			dateModified: published || undefined,
			author: { '@id': ORG_ID },
			publisher: { '@id': ORG_ID },
			isPartOf: { '@id': WEBSITE_ID },
			articleSection: a.tag,
			keywords: a.keywords.join(', '),
			wordCount: a.words,
			timeRequired: `PT${a.minutes}M`,
			inLanguage: 'en-US',
			isAccessibleForFree: true
		},
		breadcrumbSchema([{ name: 'Home', path: '/' }, a.section, { name: a.title, path: a.path }])
	);
}
