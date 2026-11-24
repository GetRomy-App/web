/**
 * Shared SEO / GEO constants and helpers.
 *
 * Every page renders its own <Seo /> (src/lib/components/Seo.svelte) so each URL gets a
 * unique title, description, canonical and social card. The root layout only emits the
 * site-wide tags (favicons, theme colour, Organization + WebSite structured data).
 */

export const SITE_URL = 'https://getromy.app';
export const SITE_NAME = 'Rōmy';
export const ORG_NAME = 'GetRomy LLC';
export const TWITTER_HANDLE = '@RomyFindsMoney';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;
export const DEFAULT_OG_IMAGE_WIDTH = 1920;
export const DEFAULT_OG_IMAGE_HEIGHT = 1080;
export const LOGO_URL = `${SITE_URL}/icon-logo.png`;

/** Stable @id values so JSON-LD nodes on different pages link to the same entities. */
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const APP_ID = `${SITE_URL}/#software`;

/** Core topical keywords the whole site is built around. */
export const CORE_KEYWORDS = [
	'donor intelligence',
	'prospect research',
	'AI prospect research',
	'wealth screening',
	'donor research software',
	'major gift fundraising',
	'major donor prospecting',
	'small nonprofit fundraising',
	'nonprofit fundraising software',
	'donor discovery',
	'giving capacity',
	'philanthropic wealth indicators',
	'DonorSearch alternative',
	'iWave alternative',
	'WealthEngine alternative'
];

/** Extra keywords per blog tag, so each article targets its topical cluster. */
const TAG_KEYWORDS: Record<string, string[]> = {
	'Field Notes': [
		'donor stewardship',
		'donor relations',
		'major gift officer',
		'donor retention',
		'relationship fundraising',
		'nonprofit development'
	],
	Industry: [
		'nonprofit fundraising strategy',
		'major gifts',
		'prospect research best practices',
		'development office',
		'fundraising CRM'
	],
	Engineering: ['AI for nonprofits', 'donor intelligence platform', 'wealth screening cost'],
	Research: ['AI benchmark', 'prospect research accuracy', 'AI for nonprofits'],
	'Data Science': ['wealth indicators', 'giving capacity model', 'donor data analysis']
};

export function keywordsFor(tag: string | undefined, extra: string[] = []): string {
	const set = new Set<string>([
		...extra,
		...(tag ? (TAG_KEYWORDS[tag] ?? []) : []),
		...CORE_KEYWORDS.slice(0, 8)
	]);
	return [...set].join(', ');
}

/** Absolute URL for a site path. */
export function absoluteUrl(path: string): string {
	if (/^https?:\/\//.test(path)) return path;
	return SITE_URL + (path.startsWith('/') ? path : `/${path}`);
}

/**
 * Trim long copy to a search-snippet-sized description (~160 chars), cutting on a
 * sentence or word boundary. Post excerpts can run to hundreds of words; Google
 * truncates around 155–160 characters, so we pick the cleanest cut under that.
 */
export function metaDescription(text: string | undefined, max = 160): string {
	if (!text) return '';
	const clean = text.replace(/\s+/g, ' ').trim();
	if (clean.length <= max) return clean;

	// Prefer the end of a sentence if one lands in the back half of the window.
	const window = clean.slice(0, max);
	const sentenceEnd = Math.max(
		window.lastIndexOf('. '),
		window.lastIndexOf('? '),
		window.lastIndexOf('! ')
	);
	if (sentenceEnd > max * 0.5) return window.slice(0, sentenceEnd + 1);

	const lastSpace = window.slice(0, max - 1).lastIndexOf(' ');
	const cut = window.slice(0, lastSpace > 0 ? lastSpace : max - 1).replace(/[\s,;:—–-]+$/, '');
	return `${cut}…`;
}

/** Strip HTML to plain text (for word counts and feeds). */
export function stripHtml(html: string): string {
	return html
		.replace(/<[^>]+>/g, ' ')
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/\s+/g, ' ')
		.trim();
}

export function wordCount(html: string): number {
	const text = stripHtml(html);
	return text ? text.split(' ').length : 0;
}

/** ISO 8601 date (YYYY-MM-DD) or undefined. */
export function isoDate(value: string | undefined): string | undefined {
	if (!value) return undefined;
	const d = new Date(value);
	return isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
}

/**
 * Serialise JSON-LD for injection via {@html}. Escapes `<` so a string value can never
 * close the surrounding <script> tag.
 */
export function jsonLd(data: unknown): string {
	return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

export const organizationSchema = {
	'@type': 'Organization',
	'@id': ORG_ID,
	name: ORG_NAME,
	alternateName: [SITE_NAME, 'GetRomy'],
	url: SITE_URL,
	logo: {
		'@type': 'ImageObject',
		url: LOGO_URL,
		width: 256,
		height: 256
	},
	description:
		'GetRomy LLC builds Rōmy, an AI donor intelligence and prospect research platform for small nonprofits.',
	knowsAbout: [
		'Donor intelligence',
		'Prospect research',
		'Wealth screening',
		'Major gift fundraising',
		'Nonprofit fundraising',
		'Philanthropy',
		'Artificial intelligence'
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
	alternateName: 'GetRomy',
	description: 'Donor intelligence and AI prospect research for small nonprofits.',
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

export interface ArticleInput {
	slug: string;
	title: string;
	date: string;
	excerpt: string;
	tag: string;
	wordCount?: number;
}

/** BlogPosting + BreadcrumbList for an article page. */
export function articleSchema(
	post: ArticleInput,
	opts: { path: string; sectionName: string; sectionPath: string; keywords: string }
) {
	const url = absoluteUrl(opts.path);
	const published = isoDate(post.date);
	const headline = post.title.length > 110 ? `${post.title.slice(0, 109)}…` : post.title;
	return [
		{
			'@type': 'BlogPosting',
			'@id': `${url}#article`,
			headline,
			name: post.title,
			description: metaDescription(post.excerpt, 300),
			abstract: post.excerpt,
			url,
			mainEntityOfPage: { '@type': 'WebPage', '@id': url },
			datePublished: published,
			dateModified: published,
			inLanguage: 'en-US',
			articleSection: post.tag,
			keywords: opts.keywords,
			...(post.wordCount
				? {
						wordCount: post.wordCount,
						timeRequired: `PT${Math.max(1, Math.round(post.wordCount / 230))}M`
					}
				: {}),
			image: {
				'@type': 'ImageObject',
				url: DEFAULT_OG_IMAGE,
				width: DEFAULT_OG_IMAGE_WIDTH,
				height: DEFAULT_OG_IMAGE_HEIGHT
			},
			author: { '@id': ORG_ID },
			publisher: { '@id': ORG_ID },
			isPartOf: {
				'@type': 'Blog',
				'@id': `${absoluteUrl(opts.sectionPath)}#blog`,
				name: opts.sectionName,
				url: absoluteUrl(opts.sectionPath)
			},
			about: [
				{ '@type': 'Thing', name: 'Major gift fundraising' },
				{ '@type': 'Thing', name: 'Donor relations' },
				{ '@type': 'Thing', name: 'Prospect research' }
			]
		},
		breadcrumbSchema([
			{ name: 'Rōmy', path: '/' },
			{ name: opts.sectionName, path: opts.sectionPath },
			{ name: post.title, path: opts.path }
		])
	];
}

/** Blog / CollectionPage + ItemList for an index page. */
export function blogIndexSchema(
	posts: { slug: string; title: string; date: string; excerpt: string }[],
	opts: { path: string; name: string; description: string; postPath: (slug: string) => string }
) {
	const url = absoluteUrl(opts.path);
	return [
		{
			'@type': 'Blog',
			'@id': `${url}#blog`,
			url,
			name: opts.name,
			description: opts.description,
			inLanguage: 'en-US',
			publisher: { '@id': ORG_ID },
			isPartOf: { '@id': WEBSITE_ID },
			blogPost: posts.map((p) => ({
				'@type': 'BlogPosting',
				'@id': `${absoluteUrl(opts.postPath(p.slug))}#article`,
				headline: p.title.length > 110 ? `${p.title.slice(0, 109)}…` : p.title,
				url: absoluteUrl(opts.postPath(p.slug)),
				datePublished: isoDate(p.date),
				description: metaDescription(p.excerpt)
			}))
		},
		{
			'@type': 'ItemList',
			'@id': `${url}#list`,
			numberOfItems: posts.length,
			itemListElement: posts.map((p, i) => ({
				'@type': 'ListItem',
				position: i + 1,
				url: absoluteUrl(opts.postPath(p.slug)),
				name: p.title
			}))
		},
		breadcrumbSchema([
			{ name: 'Rōmy', path: '/' },
			{ name: opts.name, path: opts.path }
		])
	];
}
