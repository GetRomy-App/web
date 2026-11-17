/**
 * Shared SEO constants + helpers. Every page renders its head tags through
 * `$lib/components/seo/Seo.svelte`, which is the single source of truth for
 * title / description / canonical / Open Graph / Twitter / JSON-LD.
 */

export const SITE_URL = 'https://getromy.app';
export const SITE_NAME = 'Rōmy';
export const ORG_NAME = 'GetRomy LLC';
export const TWITTER_HANDLE = '@RomyFindsMoney';

export const DEFAULT_OG_IMAGE = {
	url: `${SITE_URL}/og.png`,
	width: 1200,
	height: 630,
	alt: 'Rōmy — donor intelligence and AI prospect research for small nonprofits'
};

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Absolute URL for a site path ("/blog/foo" → "https://getromy.app/blog/foo"). */
export function absoluteUrl(path: string): string {
	if (/^https?:\/\//.test(path)) return path;
	if (path === '/' || path === '') return `${SITE_URL}/`;
	return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Trim free text down to a search-snippet-sized meta description, cutting at a
 * sentence boundary when one falls in range and at a word boundary otherwise.
 */
export function metaDescription(text: string, max = 160): string {
	const clean = (text ?? '').replace(/\s+/g, ' ').trim();
	if (clean.length <= max) return clean;

	const window = clean.slice(0, max + 1);
	const sentenceEnd = Math.max(
		window.lastIndexOf('. '),
		window.lastIndexOf('? '),
		window.lastIndexOf('! ')
	);
	if (sentenceEnd >= 90) return window.slice(0, sentenceEnd + 1);

	const cut = window.slice(0, max - 1);
	const lastSpace = cut.lastIndexOf(' ');
	return `${cut.slice(0, lastSpace > 0 ? lastSpace : cut.length).replace(/[\s,;:—–-]+$/, '')}…`;
}

/** Serialise JSON-LD so it can't break out of its <script> tag. */
export function jsonLdScript(data: unknown): string {
	const json = JSON.stringify(data).replace(/</g, '\\u003c');
	return `<script type="application/ld+json">${json}</` + `script>`;
}

export interface Crumb {
	name: string;
	path: string;
}

export function breadcrumbLd(crumbs: Crumb[]) {
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

export const organizationLd = {
	'@context': 'https://schema.org',
	'@type': 'Organization',
	'@id': ORG_ID,
	name: SITE_NAME,
	legalName: ORG_NAME,
	alternateName: 'GetRomy',
	url: `${SITE_URL}/`,
	logo: {
		'@type': 'ImageObject',
		url: `${SITE_URL}/web-app-manifest-512x512.png`,
		width: 512,
		height: 512
	},
	description:
		'Rōmy is a donor intelligence platform for small nonprofits: AI-powered prospect research with wealth indicators, giving history, and affinity signals.',
	knowsAbout: [
		'Donor prospect research',
		'Wealth screening',
		'Nonprofit fundraising',
		'Major gift fundraising',
		'Donor intelligence',
		'AI for nonprofits'
	],
	contactPoint: {
		'@type': 'ContactPoint',
		email: 'solomon@getromy.app',
		contactType: 'sales'
	},
	sameAs: ['https://x.com/RomyFindsMoney', 'https://github.com/GetRomy-App']
};

export const websiteLd = {
	'@context': 'https://schema.org',
	'@type': 'WebSite',
	'@id': WEBSITE_ID,
	url: `${SITE_URL}/`,
	name: SITE_NAME,
	description: 'Donor intelligence and AI prospect research for small nonprofits.',
	inLanguage: 'en-US',
	publisher: { '@id': ORG_ID }
};

interface ArticleInput {
	path: string;
	headline: string;
	description: string;
	date: string;
	section?: string;
	keywords?: string[];
	wordCount?: number;
	blogName: string;
	blogPath: string;
}

export function articleLd(post: ArticleInput) {
	const url = absoluteUrl(post.path);
	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		'@id': `${url}#article`,
		mainEntityOfPage: { '@type': 'WebPage', '@id': url },
		url,
		headline: post.headline,
		description: post.description,
		datePublished: post.date || undefined,
		dateModified: post.date || undefined,
		inLanguage: 'en-US',
		articleSection: post.section || undefined,
		keywords: post.keywords?.length ? post.keywords.join(', ') : undefined,
		wordCount: post.wordCount || undefined,
		image: [DEFAULT_OG_IMAGE.url],
		author: { '@id': ORG_ID },
		publisher: { '@id': ORG_ID },
		isPartOf: {
			'@type': 'Blog',
			'@id': `${absoluteUrl(post.blogPath)}#blog`,
			name: post.blogName,
			url: absoluteUrl(post.blogPath)
		}
	};
}
