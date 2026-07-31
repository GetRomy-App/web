export const SITE_URL = 'https://getromy.app';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

/**
 * Trims long-form copy (e.g. a post excerpt) down to a search-engine-friendly
 * meta description without cutting mid-word. Purely a metadata concern —
 * never used for on-page display copy.
 */
export function metaDescription(text: string, maxLength = 155): string {
	const clean = text.replace(/\s+/g, ' ').trim();
	if (clean.length <= maxLength) return clean;

	const sentenceEnd = clean.slice(0, maxLength + 1).lastIndexOf('. ');
	if (sentenceEnd > 60) return clean.slice(0, sentenceEnd + 1);

	const truncated = clean.slice(0, maxLength);
	const lastSpace = truncated.lastIndexOf(' ');
	return `${truncated.slice(0, lastSpace > 0 ? lastSpace : maxLength)}…`;
}

/** Safely serialize a JSON-LD payload for inlining in a <script> tag. */
export function jsonLd(data: unknown): string {
	return JSON.stringify(data).replace(/</g, '\\u003c');
}

interface BreadcrumbItem {
	name: string;
	path: string;
}

export function breadcrumbList(items: BreadcrumbItem[]) {
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
