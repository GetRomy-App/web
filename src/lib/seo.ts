/**
 * Shared SEO / GEO helpers: canonical URLs, meta descriptions and schema.org
 * builders. Every page renders its tags through `Seo.svelte` so there is exactly
 * one title, description, canonical and Open Graph set per URL.
 */

export const SITE_URL = 'https://getromy.app';
export const SITE_NAME = 'Rōmy';
export const LEGAL_NAME = 'GetRomy LLC';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;
export const LOGO_URL = `${SITE_URL}/web-app-manifest-512x512.png`;
export const TWITTER_HANDLE = '@RomyFindsMoney';

/** Public sales contacts, as already published on the site. */
export const CONTACT_EMAILS = ['solomon@getromy.app', 'howard@getromy.app'];

export const SITE_TAGLINE = 'AI donor prospect research for small nonprofits';
export const SITE_DESCRIPTION =
	'Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions. AI-powered prospect research, wealth indicators, and giving history — at a price built for small teams.';

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const SOFTWARE_ID = `${SITE_URL}/#software`;
export const BLOG_ID = `${SITE_URL}/blog#blog`;

export function absoluteUrl(path: string): string {
	if (/^https?:\/\//.test(path)) return path;
	if (path === '/' || path === '') return `${SITE_URL}/`;
	return SITE_URL + (path.startsWith('/') ? path : `/${path}`);
}

/**
 * Trim long copy to a search-snippet-sized description without rewriting it:
 * keep whole sentences while they fit, otherwise cut at a word boundary.
 */
export function metaDescription(text: string, max = 160): string {
	const clean = text.replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim();
	if (clean.length <= max) return clean;

	const sentences = clean.match(/[^.!?]+[.!?]+(?=\s|$)/g) ?? [];
	let out = '';
	for (const sentence of sentences) {
		if ((out + sentence).trim().length > max) break;
		out += sentence;
	}
	out = out.trim();
	if (out.length >= 70) return out;

	const cut = clean.slice(0, max - 1);
	return cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:—–-]+$/, '') + '…';
}

/** Search-result title for a post: the headline, plus its topic when both fit. */
export function postTitle(title: string, topic?: string, suffix = SITE_NAME): string {
	const withTopic = `${title} — ${topic} | ${suffix}`;
	if (topic && withTopic.length <= 70) return withTopic;
	return `${title} | ${suffix}`;
}

/** ISO-8601 timestamp for a frontmatter date (YYYY-MM-DD → midnight UTC). */
export function isoDate(value: string | undefined): string | undefined {
	if (!value) return undefined;
	const d = new Date(value);
	return isNaN(d.getTime()) ? undefined : d.toISOString();
}

type Schema = Record<string, unknown>;

export function organizationSchema(): Schema {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		'@id': ORGANIZATION_ID,
		name: SITE_NAME,
		legalName: LEGAL_NAME,
		alternateName: ['Romy', 'GetRomy'],
		url: `${SITE_URL}/`,
		logo: {
			'@type': 'ImageObject',
			url: LOGO_URL,
			width: 512,
			height: 512
		},
		description:
			'Rōmy is a donor intelligence platform that gives small nonprofits AI-powered prospect research — wealth indicators, giving history, and affinity signals.',
		knowsAbout: [
			'Donor prospect research',
			'Wealth screening',
			'Donor intelligence',
			'Major gift fundraising',
			'Nonprofit fundraising',
			'AI for nonprofits'
		],
		contactPoint: {
			'@type': 'ContactPoint',
			email: CONTACT_EMAILS[0],
			contactType: 'sales'
		},
		sameAs: ['https://x.com/RomyFindsMoney', 'https://github.com/GetRomy-App']
	};
}

export function websiteSchema(): Schema {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'@id': WEBSITE_ID,
		url: `${SITE_URL}/`,
		name: SITE_NAME,
		alternateName: 'Romy',
		description: SITE_DESCRIPTION,
		inLanguage: 'en-US',
		publisher: { '@id': ORGANIZATION_ID }
	};
}

export function softwareSchema(): Schema {
	return {
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		'@id': SOFTWARE_ID,
		name: SITE_NAME,
		alternateName: 'Romy',
		url: `${SITE_URL}/`,
		applicationCategory: 'BusinessApplication',
		applicationSubCategory: 'Donor prospect research and wealth screening software',
		operatingSystem: 'Web',
		description:
			'Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions. AI-powered prospect research with wealth indicators, giving history, and affinity signals.',
		audience: {
			'@type': 'Audience',
			audienceType: 'Small nonprofits, development directors, and major gift fundraisers'
		},
		image: DEFAULT_OG_IMAGE,
		screenshot: `${SITE_URL}/screenshot.png`,
		publisher: { '@id': ORGANIZATION_ID },
		featureList: [
			'AI-powered donor prospect research',
			'Wealth indicator screening',
			'Giving history analysis',
			'Affinity signal detection',
			'Actionable donor profiles',
			'No enterprise contracts or per-seat licensing'
		]
	};
}

export interface Crumb {
	name: string;
	path: string;
}

export function breadcrumbSchema(crumbs: Crumb[]): Schema {
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
	title: string;
	description: string;
	date: string;
	section?: string;
	keywords?: string[];
	wordCount?: number;
	about?: string;
	/** Collection this article belongs to. */
	partOf?: { type: string; id: string; name: string; path: string };
}

export function articleSchema(input: ArticleInput): Schema {
	const url = absoluteUrl(input.path);
	const published = isoDate(input.date);
	return {
		'@context': 'https://schema.org',
		'@type': input.type ?? 'BlogPosting',
		'@id': `${url}#article`,
		mainEntityOfPage: { '@type': 'WebPage', '@id': url },
		url,
		headline: input.title.slice(0, 110),
		description: input.description,
		image: [DEFAULT_OG_IMAGE],
		datePublished: published,
		dateModified: published,
		inLanguage: 'en-US',
		author: {
			'@type': 'Organization',
			'@id': ORGANIZATION_ID,
			name: SITE_NAME,
			url: `${SITE_URL}/`
		},
		publisher: { '@id': ORGANIZATION_ID },
		...(input.section ? { articleSection: input.section } : {}),
		...(input.keywords?.length ? { keywords: input.keywords.join(', ') } : {}),
		...(input.about ? { about: { '@type': 'Thing', name: input.about } } : {}),
		...(input.wordCount ? { wordCount: input.wordCount } : {}),
		...(input.partOf
			? {
					isPartOf: {
						'@type': input.partOf.type,
						'@id': input.partOf.id,
						name: input.partOf.name,
						url: absoluteUrl(input.partOf.path)
					}
				}
			: {})
	};
}

/** Serialise schema objects for an inline JSON-LD script without letting content close the tag. */
export function jsonLdScript(schema: Schema | Schema[]): string {
	const json = JSON.stringify(schema).replace(/</g, '\\u003c');
	return `<script type="application/ld+json">${json}</` + `script>`;
}
