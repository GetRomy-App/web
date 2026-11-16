/** Site-wide SEO constants and JSON-LD builders. */

export const SITE_URL = 'https://getromy.app';
export const SITE_NAME = 'Rōmy';
export const ORG_NAME = 'GetRomy LLC';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og.png`;
export const DEFAULT_OG_IMAGE_ALT =
	'Rōmy — AI donor intelligence and prospect research for small nonprofits';
export const TWITTER_HANDLE = '@RomyFindsMoney';

export const DEFAULT_DESCRIPTION =
	"AI donor intelligence for small nonprofits: Rōmy's prospect research, wealth screening, and giving history find new major donors at a fraction of the cost.";

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const SOFTWARE_ID = `${SITE_URL}/#software`;

export function absoluteUrl(path: string): string {
	if (/^https?:\/\//.test(path)) return path;
	return SITE_URL + (path.startsWith('/') ? path : `/${path}`);
}

/** Clamp a description to ~158 chars on a word boundary so SERPs don't truncate mid-word. */
export function clampDescription(text: string, max = 158): string {
	const clean = text.replace(/\s+/g, ' ').trim();
	if (clean.length <= max) return clean;
	const cut = clean.slice(0, max - 1);
	const lastSpace = cut.lastIndexOf(' ');
	return `${cut.slice(0, lastSpace > 80 ? lastSpace : cut.length).replace(/[\s,;:—–-]+$/, '')}…`;
}

/** ISO date (YYYY-MM-DD) or undefined. */
export function isoDate(value: string | undefined): string | undefined {
	if (!value) return undefined;
	const d = new Date(value);
	return isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: item.name,
			item: absoluteUrl(item.path)
		}))
	};
}

export interface ArticleLdInput {
	path: string;
	headline: string;
	alternativeHeadline?: string;
	description: string;
	date: string;
	section?: string;
	keywords?: string[];
	wordCount?: number;
	type?: 'BlogPosting' | 'TechArticle' | 'Article';
	isPartOf?: { '@type': string; '@id': string; name: string };
}

export function articleLd(input: ArticleLdInput) {
	const url = absoluteUrl(input.path);
	const published = isoDate(input.date);
	return {
		'@context': 'https://schema.org',
		'@type': input.type ?? 'BlogPosting',
		'@id': `${url}#article`,
		mainEntityOfPage: { '@type': 'WebPage', '@id': url },
		url,
		headline: input.headline,
		...(input.alternativeHeadline ? { alternativeHeadline: input.alternativeHeadline } : {}),
		description: input.description,
		image: [DEFAULT_OG_IMAGE],
		...(published ? { datePublished: published, dateModified: published } : {}),
		inLanguage: 'en-US',
		...(input.section ? { articleSection: input.section } : {}),
		...(input.keywords?.length ? { keywords: input.keywords.join(', ') } : {}),
		...(input.wordCount ? { wordCount: input.wordCount } : {}),
		author: { '@type': 'Organization', '@id': ORG_ID, name: SITE_NAME, url: SITE_URL },
		publisher: { '@id': ORG_ID },
		...(input.isPartOf ? { isPartOf: input.isPartOf } : {}),
		about: [
			{ '@type': 'Thing', name: 'Nonprofit fundraising' },
			{ '@type': 'Thing', name: 'Prospect research' }
		]
	};
}

/** Serialize JSON-LD safely for inline <script> (prevents `</script>` breakouts). */
export function jsonLdScript(data: unknown): string {
	const json = JSON.stringify(data).replace(/</g, '\\u003c');
	return `<script type="application/ld+json">${json}</script>`;
}
