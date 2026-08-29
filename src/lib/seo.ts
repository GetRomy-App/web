/** Shared SEO helpers — metadata only, never touches on-page copy. */

const SITE = 'https://getromy.app';
const DEFAULT_OG_IMAGE = `${SITE}/og-image.jpg`;

/**
 * Trim a long excerpt down to a search-snippet-friendly length for
 * <meta name="description"> / og:description, breaking on a word boundary.
 * The on-page excerpt / content is left untouched — this only shapes what
 * search engines and social previews show.
 */
export function metaDescription(text: string, maxLen = 155): string {
	if (!text) return '';
	if (text.length <= maxLen) return text;
	const cut = text.slice(0, maxLen);
	const lastSpace = cut.lastIndexOf(' ');
	return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxLen).trimEnd()}…`;
}

export interface BreadcrumbItem {
	name: string;
	url: string;
}

export function breadcrumbList(items: BreadcrumbItem[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: item.name,
			item: item.url
		}))
	};
}

export interface BlogPostingInput {
	headline: string;
	description: string;
	url: string;
	datePublished: string;
	dateModified?: string;
	section?: string;
	image?: string;
}

export function blogPostingJsonLd(input: BlogPostingInput) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: input.headline,
		description: input.description,
		url: input.url,
		mainEntityOfPage: { '@type': 'WebPage', '@id': input.url },
		datePublished: input.datePublished,
		dateModified: input.dateModified ?? input.datePublished,
		articleSection: input.section,
		image: input.image ?? DEFAULT_OG_IMAGE,
		author: {
			'@type': 'Organization',
			name: 'Rōmy',
			url: SITE
		},
		publisher: {
			'@type': 'Organization',
			name: 'GetRomy LLC',
			logo: {
				'@type': 'ImageObject',
				url: `${SITE}/icon-logo.png`
			}
		}
	};
}

export { SITE, DEFAULT_OG_IMAGE };
