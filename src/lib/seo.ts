export const SITE_URL = 'https://getromy.app';
export const SITE_NAME = 'Rōmy';
export const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

/** Trim text to a search-snippet-friendly length at a word boundary. */
export function snippet(text: string, max = 158): string {
	const clean = text.replace(/\s+/g, ' ').trim();
	if (clean.length <= max) return clean;
	const cut = clean.slice(0, max - 1);
	const lastSpace = cut.lastIndexOf(' ');
	return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:—-]+$/, '') + '…';
}

/** Keep <title> inside the ~60 character display window where possible. */
export function titleWithBrand(title: string, suffix: string): string {
	const full = `${title} — ${suffix}`;
	return full.length <= 65 ? full : title;
}

export function jsonLdScript(data: unknown): string {
	return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}
