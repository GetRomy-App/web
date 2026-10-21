export const SITE_URL = 'https://getromy.app';
export const SITE_NAME = 'Rōmy';
export const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;
export const DEFAULT_IMAGE_ALT =
	'Rōmy — donor intelligence for small nonprofits, shown on a prospect research screen';
export const TWITTER_HANDLE = '@RomyFindsMoney';

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Condense text to a search-snippet-sized description, cutting at a word boundary. */
export function metaDescription(text: string, max = 158): string {
	const clean = text
		.replace(/\s+/g, ' ')
		.replace(/[*_`#]/g, '')
		.trim();
	if (clean.length <= max) return clean;
	const cut = clean.slice(0, max - 1);
	const lastSpace = cut.lastIndexOf(' ');
	return `${cut.slice(0, lastSpace > max * 0.6 ? lastSpace : cut.length).replace(/[\s,;:—–-]+$/, '')}…`;
}

/** Serialise JSON-LD so it is safe inside an inline <script> element. */
export function jsonLdScript(data: unknown): string {
	const json = JSON.stringify(data)
		.replace(/</g, '\\u003c')
		.replace(/[\u2028\u2029]/g, '');
	return `<script type="application/ld+json">${json}</script>`;
}

export function breadcrumbs(trail: { name: string; path: string }[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: trail.map((item, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: item.name,
			item: `${SITE_URL}${item.path}`
		}))
	};
}

export function articleJsonLd(post: {
	title: string;
	excerpt: string;
	date: string;
	tag: string;
	path: string;
}) {
	const url = `${SITE_URL}${post.path}`;
	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		'@id': `${url}#article`,
		headline: post.title.slice(0, 110),
		description: metaDescription(post.excerpt),
		datePublished: post.date,
		dateModified: post.date,
		articleSection: post.tag,
		inLanguage: 'en-US',
		url,
		mainEntityOfPage: { '@type': 'WebPage', '@id': url },
		image: DEFAULT_IMAGE,
		isPartOf: { '@id': WEBSITE_ID },
		author: { '@id': ORGANIZATION_ID },
		publisher: { '@id': ORGANIZATION_ID }
	};
}
