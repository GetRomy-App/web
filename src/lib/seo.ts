export const SITE_URL = 'https://getromy.app';
export const SITE_NAME = 'Rōmy';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

const MAX_DESCRIPTION = 155;

/**
 * Collapse whitespace, strip markdown emphasis, and cut at a word boundary so the
 * text fits a SERP snippet. Post excerpts run to several hundred words, which
 * search engines truncate arbitrarily.
 */
export function toMetaDescription(text: string, max = MAX_DESCRIPTION): string {
	const clean = text.replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim();
	if (clean.length <= max) return clean;
	const cut = clean.slice(0, max - 1);
	const lastSpace = cut.lastIndexOf(' ');
	return `${cut.slice(0, lastSpace > 80 ? lastSpace : cut.length).replace(/[\s,;:—–-]+$/, '')}…`;
}

export function absoluteUrl(path: string): string {
	return `${SITE_URL}${path === '/' ? '' : path}`;
}

/** Serialize JSON-LD for inline <script> use; escapes `<` so content can't close the tag. */
export function jsonLdScript(data: unknown): string {
	const json = JSON.stringify(data).replace(/</g, '\\u003c');
	return `<script type="application/ld+json">${json}</script>`;
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: item.name,
			item: absoluteUrl(item.path)
		}))
	};
}

export function articleLd(post: {
	title: string;
	excerpt: string;
	date: string;
	tag: string;
	path: string;
}) {
	const url = absoluteUrl(post.path);
	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: post.title.slice(0, 110),
		description: toMetaDescription(post.excerpt),
		datePublished: post.date,
		dateModified: post.date,
		articleSection: post.tag,
		image: DEFAULT_OG_IMAGE,
		mainEntityOfPage: { '@type': 'WebPage', '@id': url },
		url,
		inLanguage: 'en-US',
		author: { '@type': 'Organization', name: 'GetRomy LLC', url: SITE_URL },
		publisher: {
			'@type': 'Organization',
			name: 'GetRomy LLC',
			url: SITE_URL,
			logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon-logo.png` }
		}
	};
}

export function collectionLd(opts: {
	name: string;
	description: string;
	path: string;
	items: { title: string; path: string }[];
}) {
	return {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: opts.name,
		description: opts.description,
		url: absoluteUrl(opts.path),
		isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
		mainEntity: {
			'@type': 'ItemList',
			itemListElement: opts.items.map((item, i) => ({
				'@type': 'ListItem',
				position: i + 1,
				name: item.title,
				url: absoluteUrl(item.path)
			}))
		}
	};
}
