export const SITE_URL = 'https://getromy.app';
export const SITE_NAME = 'Rōmy';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;
export const DEFAULT_OG_IMAGE_ALT = 'Rōmy — donor intelligence for small nonprofits';

/** Collapse whitespace and trim to a SERP-friendly length on a word boundary. */
export function toMetaDescription(text: string, max = 158): string {
	const clean = text
		.replace(/[*_`#>]/g, '')
		.replace(/\s+/g, ' ')
		.trim();
	if (clean.length <= max) return clean;
	const cut = clean.slice(0, max - 1);
	const lastSpace = cut.lastIndexOf(' ');
	return `${cut.slice(0, lastSpace > max * 0.6 ? lastSpace : cut.length).replace(/[\s,;:—–-]+$/, '')}…`;
}

/** Serialise JSON-LD safely for inlining inside a <script> tag. */
export function jsonLdScript(data: unknown): string {
	const json = JSON.stringify(data).replace(/</g, '\\u003c');
	return `<script type="application/ld+json">${json}</script>`;
}

export function absoluteUrl(path: string): string {
	return `${SITE_URL}${path === '/' ? '/' : path}`;
}
