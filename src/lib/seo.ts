export const SITE_URL = 'https://getromy.app';
export const SITE_NAME = 'Rōmy';
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;
export const OG_IMAGE_WIDTH = 1920;
export const OG_IMAGE_HEIGHT = 1080;

/** Search engines show ~155-160 characters; trim at a word boundary so snippets never cut mid-word. */
export function metaDescription(text: string, max = 158): string {
	const clean = text
		.replace(/[*_`#>]/g, '')
		.replace(/\s+/g, ' ')
		.trim();
	if (clean.length <= max) return clean;
	const cut = clean.slice(0, max - 1);
	const lastSpace = cut.lastIndexOf(' ');
	return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:—–-]+$/, '')}…`;
}

/** Serialise JSON-LD for inline <script> use; escapes `<` so content can never close the tag. */
export function jsonLd(data: unknown): string {
	const json = JSON.stringify(data).replace(/</g, '\\u003c');
	return `<script type="application/ld+json">${json}</script>`;
}

export const organizationRef = {
	'@type': 'Organization',
	'@id': `${SITE_URL}/#organization`,
	name: 'GetRomy LLC',
	url: SITE_URL
};

export function breadcrumbs(items: { name: string; path: string }[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: item.name,
			item: `${SITE_URL}${item.path}`
		}))
	};
}

export function articleSchema(opts: {
	title: string;
	description: string;
	path: string;
	date: string;
	section: string;
}) {
	const url = `${SITE_URL}${opts.path}`;
	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		'@id': `${url}#article`,
		mainEntityOfPage: { '@type': 'WebPage', '@id': url },
		headline: opts.title.slice(0, 110),
		description: opts.description,
		url,
		image: [OG_IMAGE],
		datePublished: opts.date,
		dateModified: opts.date,
		articleSection: opts.section,
		inLanguage: 'en-US',
		author: organizationRef,
		publisher: {
			...organizationRef,
			logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon-logo.png` }
		},
		isPartOf: { '@type': 'Blog', name: `${SITE_NAME} Blog`, url: `${SITE_URL}/blog` }
	};
}
