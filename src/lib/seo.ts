export const SITE_URL = 'https://getromy.app';
export const SITE_NAME = 'Rōmy';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

/** Collapse whitespace/markdown emphasis and cut at a word boundary so snippets aren't truncated mid-word by Google. */
export function metaDescription(text: string, max = 155): string {
	const clean = text.replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim();
	if (clean.length <= max) return clean;
	const cut = clean.slice(0, max - 1);
	return cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:.—-]+$/, '') + '…';
}
