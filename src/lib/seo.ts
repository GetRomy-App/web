export const SITE_URL = 'https://getromy.app';
export const SITE_NAME = 'Rōmy';
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

/** Collapse whitespace and trim to a SERP-friendly length, cutting on a word boundary. */
export function metaDescription(text: string, max = 158): string {
	const clean = text
		.replace(/[*_`#>]/g, '')
		.replace(/\s+/g, ' ')
		.trim();
	if (clean.length <= max) return clean;
	const cut = clean.slice(0, max - 1);
	const lastSpace = cut.lastIndexOf(' ');
	return `${cut.slice(0, lastSpace > 80 ? lastSpace : cut.length).replace(/[\s,;:—–-]+$/, '')}…`;
}

/** Serialise a JSON-LD node as a script tag, escaping `<` so content can't close the tag. */
export function jsonLd(node: Record<string, unknown>): string {
	return `<script type="application/ld+json">${JSON.stringify(node).replace(/</g, '\\u003c')}</script>`;
}

export function breadcrumbs(trail: { name: string; path: string }[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: trail.map((item, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: item.name,
			item: SITE_URL + item.path
		}))
	};
}

export function articleSchema(opts: {
	path: string;
	title: string;
	description: string;
	date: string;
	section: string;
}) {
	const url = SITE_URL + opts.path;
	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		'@id': `${url}#article`,
		mainEntityOfPage: { '@type': 'WebPage', '@id': url },
		headline: opts.title.slice(0, 110),
		description: opts.description,
		datePublished: opts.date,
		dateModified: opts.date,
		articleSection: opts.section,
		image: OG_IMAGE,
		inLanguage: 'en-US',
		author: { '@type': 'Organization', name: 'GetRomy LLC', url: SITE_URL },
		publisher: {
			'@type': 'Organization',
			name: 'GetRomy LLC',
			url: SITE_URL,
			logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon-logo.png` }
		}
	};
}
