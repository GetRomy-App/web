export const SITE_URL = 'https://getromy.app';
export const SITE_NAME = 'Rōmy';
export const TWITTER_HANDLE = '@RomyFindsMoney';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;
export const DEFAULT_OG_IMAGE_ALT =
	'Rōmy — AI donor research and prospect intelligence for small nonprofits';

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Absolute URL for a site path ("/blog" → "https://getromy.app/blog"). */
export function absoluteUrl(path: string): string {
	return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

/** Trim to a search-snippet length on a word boundary. */
export function truncate(text: string, max = 160): string {
	const clean = text.replace(/\s+/g, ' ').trim();
	if (clean.length <= max) return clean;
	const cut = clean.slice(0, max - 1);
	return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:\-—–\s]+$/, '') + '…';
}

/** Serialise JSON-LD for inline <script>; escapes "<" so content can't close the tag. */
export function jsonLdScript(data: unknown): string {
	const json = JSON.stringify(data).replace(/</g, '\\u003c');
	return `<script type="application/ld+json">${json}</script>`;
}

export function breadcrumbs(items: { name: string; path: string }[]) {
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

export function articleSchema(opts: {
	title: string;
	description: string;
	path: string;
	date: string;
	section: string;
	keywords?: string[];
}) {
	const url = absoluteUrl(opts.path);
	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		'@id': `${url}#article`,
		headline: opts.title,
		description: opts.description,
		url,
		mainEntityOfPage: { '@type': 'WebPage', '@id': url },
		datePublished: opts.date,
		dateModified: opts.date,
		articleSection: opts.section,
		keywords: opts.keywords?.join(', '),
		inLanguage: 'en-US',
		image: DEFAULT_OG_IMAGE,
		author: { '@id': ORGANIZATION_ID },
		publisher: { '@id': ORGANIZATION_ID },
		isPartOf: { '@id': WEBSITE_ID }
	};
}
