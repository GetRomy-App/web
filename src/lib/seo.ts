/**
 * Shared SEO / GEO helpers: site constants, text clipping for meta tags,
 * and schema.org (JSON-LD) builders. Rendered through `Seo.svelte`.
 */

export const SITE_URL = 'https://getromy.app';
export const SITE_NAME = 'Rōmy';
export const PUBLISHER_NAME = 'GetRomy LLC';
export const TWITTER_HANDLE = '@RomyFindsMoney';
export const DEFAULT_OG_IMAGE = '/og-romy.jpg';
export const DEFAULT_OG_IMAGE_ALT =
	'Rōmy — donor intelligence and AI prospect research for small nonprofits';
export const LOGO_URL = `${SITE_URL}/web-app-manifest-512x512.png`;

export const SITE_DESCRIPTION =
	'Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions. AI-powered prospect research, wealth indicators, and giving history — at a price built for small teams.';

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export function absoluteUrl(path: string): string {
	if (/^https?:\/\//.test(path)) return path;
	if (path === '/' || path === '') return `${SITE_URL}/`;
	return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Collapse whitespace and strip the light markdown that shows up in excerpts. */
export function plainText(value: string): string {
	return value.replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim();
}

/** Clip to a search-snippet length on a word boundary, adding an ellipsis when cut. */
export function clip(value: string, max = 158): string {
	const text = plainText(value);
	if (text.length <= max) return text;
	const cut = text.slice(0, max - 1);
	const lastSpace = cut.lastIndexOf(' ');
	const head = (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:—–-]+$/, '');
	return `${head}…`;
}

/** Serialise JSON-LD so it can never close its own script tag. */
export function jsonLdScript(data: unknown): string {
	const json = JSON.stringify(data).replace(/</g, '\\u003c');
	return `<script type="application/ld+json">${json}</` + `script>`;
}

export function toIsoDate(value: string | undefined): string | undefined {
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
		legalName: PUBLISHER_NAME,
		url: `${SITE_URL}/`,
		logo: { '@type': 'ImageObject', url: LOGO_URL, width: 512, height: 512 },
		image: absoluteUrl(DEFAULT_OG_IMAGE),
		description:
			'Rōmy is a donor intelligence platform for small nonprofits: AI-powered prospect research that surfaces wealth indicators, giving history, and affinity signals.',
		knowsAbout: [
			'Donor intelligence',
			'Prospect research',
			'Wealth screening',
			'Major gift fundraising',
			'Nonprofit fundraising',
			'Donor stewardship',
			'Planned giving',
			'AI for nonprofits'
		],
		contactPoint: {
			'@type': 'ContactPoint',
			email: 'solomon@getromy.app',
			contactType: 'sales'
		},
		sameAs: ['https://x.com/RomyFindsMoney', 'https://github.com/GetRomy-App']
	};
}

export function websiteSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'@id': WEBSITE_ID,
		name: SITE_NAME,
		url: `${SITE_URL}/`,
		description: SITE_DESCRIPTION,
		inLanguage: 'en-US',
		publisher: { '@id': ORG_ID }
	};
}

export function softwareSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		'@id': `${SITE_URL}/#software`,
		name: SITE_NAME,
		url: `${SITE_URL}/`,
		applicationCategory: 'BusinessApplication',
		applicationSubCategory: 'Donor prospect research software',
		operatingSystem: 'Web',
		description:
			'Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions. AI-powered prospect research with wealth indicators, giving history, and affinity signals.',
		image: absoluteUrl(DEFAULT_OG_IMAGE),
		screenshot: `${SITE_URL}/screenshot.png`,
		audience: {
			'@type': 'Audience',
			audienceType: 'Small nonprofits, development directors, and fundraisers'
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
		itemListElement: crumbs.map((crumb, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: crumb.name,
			item: absoluteUrl(crumb.path)
		}))
	};
}

export interface ArticleInput {
	type?: 'BlogPosting' | 'TechArticle';
	path: string;
	headline: string;
	description: string;
	date: string;
	section?: string;
	keywords?: string[];
	wordCount?: number;
}

export function articleSchema(input: ArticleInput) {
	const url = absoluteUrl(input.path);
	const published = toIsoDate(input.date);
	return {
		'@context': 'https://schema.org',
		'@type': input.type ?? 'BlogPosting',
		'@id': `${url}#article`,
		mainEntityOfPage: { '@type': 'WebPage', '@id': url },
		url,
		headline: input.headline.length > 110 ? clip(input.headline, 110) : input.headline,
		description: input.description,
		image: absoluteUrl(DEFAULT_OG_IMAGE),
		...(published ? { datePublished: published, dateModified: published } : {}),
		...(input.section ? { articleSection: input.section } : {}),
		...(input.keywords?.length ? { keywords: input.keywords.join(', ') } : {}),
		...(input.wordCount ? { wordCount: input.wordCount } : {}),
		inLanguage: 'en-US',
		author: { '@id': ORG_ID, '@type': 'Organization', name: SITE_NAME, url: `${SITE_URL}/` },
		publisher: { '@id': ORG_ID },
		isPartOf: { '@id': WEBSITE_ID }
	};
}

export function blogSchema(input: {
	path: string;
	name: string;
	description: string;
	posts: { title: string; path: string; date: string; description: string }[];
}) {
	const url = absoluteUrl(input.path);
	return {
		'@context': 'https://schema.org',
		'@type': 'Blog',
		'@id': `${url}#blog`,
		url,
		name: input.name,
		description: input.description,
		inLanguage: 'en-US',
		publisher: { '@id': ORG_ID },
		isPartOf: { '@id': WEBSITE_ID },
		blogPost: input.posts.map((post) => ({
			'@type': 'BlogPosting',
			headline: post.title,
			url: absoluteUrl(post.path),
			description: post.description,
			...(toIsoDate(post.date) ? { datePublished: toIsoDate(post.date) } : {})
		}))
	};
}
