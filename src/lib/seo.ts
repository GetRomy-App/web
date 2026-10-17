export const SITE_URL = 'https://getromy.app';
export const SITE_NAME = 'Rōmy';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

/** Serialise JSON-LD for inline <script> use; escapes "<" so content can't close the tag. */
export function jsonLd(data: Record<string, unknown>): string {
	const json = JSON.stringify(data).replace(/</g, '\\u003c');
	return `<script type="application/ld+json">${json}</script>`;
}

/** Append the brand suffix only when the full title still fits a SERP title (~60 chars). */
export function withBrand(title: string, suffix: string): string {
	const full = `${title} — ${suffix}`;
	return full.length <= 62 ? full : title;
}

/** Trim to a SERP-friendly description length on a word boundary. */
export function clip(text: string, max = 158): string {
	const t = text.replace(/\s+/g, ' ').trim();
	if (t.length <= max) return t;
	const cut = t.slice(0, max - 1);
	return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:—-]+$/, '') + '…';
}

export function toIsoDate(value: string): string | undefined {
	const d = new Date(value);
	return isNaN(d.getTime()) ? undefined : d.toISOString();
}
