export const SITE_URL = 'https://getromy.app';
export const SITE_NAME = 'Rōmy';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

/** Serialise JSON-LD for inline <script> use, escaping characters that could end the tag early. */
export function jsonLdScript(data: unknown): string {
	const json = JSON.stringify(data)
		.replace(/</g, '\\u003c')
		.replace(/\u2028/g, '\\u2028')
		.replace(/\u2029/g, '\\u2029');
	return `<script type="application/ld+json">${json}</script>`;
}

/** Trim long copy to a search-snippet length at a word boundary. Source text is never modified. */
export function metaDescription(text: string, max = 160): string {
	const clean = text.replace(/[*_`#>]/g, '').replace(/\s+/g, ' ').trim();
	if (clean.length <= max) return clean;
	const cut = clean.slice(0, max - 1);
	return cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:—–-]+$/, '') + '…';
}

export function breadcrumbs(items: { name: string; path: string }[]) {
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
