export const SITE_URL = 'https://getromy.app';
export const SITE_NAME = 'Rōmy';
export const DEFAULT_OG_IMAGE = {
	url: `${SITE_URL}/og-image.jpg`,
	width: 1920,
	height: 1080,
	alt: 'Rōmy — donor intelligence for small nonprofits'
};

/** Collapse whitespace/markdown emphasis and cut at a word boundary so SERP snippets aren't truncated mid-word. */
export function snippet(text: string, max = 155): string {
	const clean = text.replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim();
	if (clean.length <= max) return clean;
	const cut = clean.slice(0, max - 1);
	const lastSpace = cut.lastIndexOf(' ');
	return `${cut.slice(0, lastSpace > 80 ? lastSpace : cut.length).replace(/[\s,;:—-]+$/, '')}…`;
}

/** Serialise JSON-LD for a script tag; `<` is escaped so content can never close the tag early. */
export function jsonLdScript(data: unknown): string {
	return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

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
