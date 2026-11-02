export const SITE_URL = 'https://getromy.app';
export const SITE_NAME = 'Rōmy';
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const DEFAULT_OG_IMAGE = {
	url: `${SITE_URL}/og-image.jpg`,
	width: 1920,
	height: 1080,
	alt: 'Rōmy — donor intelligence for small nonprofits'
};

/** Serialise JSON-LD safely for inline <script> embedding. */
export function jsonLdScript(data: unknown): string {
	const json = JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');
	return `<script type="application/ld+json">${json}</script>`;
}

/** Clamp text for meta descriptions (≈155 chars shows untruncated on Google). */
export function clamp(text: string, max = 160): string {
	const clean = text.replace(/\s+/g, ' ').trim();
	if (clean.length <= max) return clean;
	const cut = clean.slice(0, max - 1);
	return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.\-—\s]+$/, '') + '…';
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

export function wordCount(html: string): number {
	return html
		.replace(/<[^>]+>/g, ' ')
		.split(/\s+/)
		.filter(Boolean).length;
}
