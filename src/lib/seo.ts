export const SITE_URL = 'https://getromy.app';
export const SITE_NAME = 'Rōmy';
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;
export const OG_IMAGE_ALT = 'Rōmy — donor intelligence for small nonprofits';

/** Serialise JSON-LD for a <script> tag, escaping `<` so content can't close the tag early. */
export function jsonLd(data: Record<string, unknown>): string {
	const json = JSON.stringify(data).replace(/</g, '\\u003c');
	return `<script type="application/ld+json">${json}</script>`;
}

/** Trim to a search-snippet-friendly length on a word boundary. */
export function snippet(text: string, max = 158): string {
	const clean = text.replace(/\s+/g, ' ').trim();
	if (clean.length <= max) return clean;
	const cut = clean.slice(0, max - 1);
	return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:—-]+$/, '') + '…';
}

export function breadcrumbs(items: { name: string; path: string }[]): Record<string, unknown> {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: item.name,
			item: SITE_URL + item.path
		}))
	};
}

export const PUBLISHER = {
	'@type': 'Organization',
	'@id': `${SITE_URL}/#organization`,
	name: 'GetRomy LLC',
	url: SITE_URL,
	logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon-logo.png` }
};
