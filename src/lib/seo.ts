export const SITE = 'https://getromy.app';
export const SITE_NAME = 'Rōmy';
export const OG_IMAGE = `${SITE}/og-image.jpg`;
export const OG_IMAGE_WIDTH = 1920;
export const OG_IMAGE_HEIGHT = 1080;
export const TWITTER_HANDLE = '@RomyFindsMoney';

/** Serialise JSON-LD into a script tag, escaping "<" so content can never close the tag early. */
export function jsonLd(data: unknown): string {
	const json = JSON.stringify(data).replace(/</g, '\\u003c');
	return `<script type="application/ld+json">${json}</script>`;
}

/** Strip markdown emphasis and collapse whitespace. */
function plain(text: string): string {
	return text
		.replace(/[*_`]+/g, '')
		.replace(/\s+/g, ' ')
		.trim();
}

/** Trim long excerpts to a snippet-sized meta description (<=155 chars) on a word boundary. */
export function metaDescription(text: string, max = 155): string {
	const clean = plain(text);
	if (clean.length <= max) return clean;
	const cut = clean.slice(0, max - 1);
	const lastSpace = cut.lastIndexOf(' ');
	return `${cut.slice(0, lastSpace > 80 ? lastSpace : cut.length).replace(/[\s,;:—–-]+$/, '')}…`;
}

export function toIsoDate(value: string): string {
	const d = new Date(value);
	return isNaN(d.getTime()) ? '' : d.toISOString();
}

export function breadcrumbs(items: { name: string; path: string }[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: item.name,
			item: `${SITE}${item.path}`
		}))
	};
}

export const PUBLISHER = {
	'@type': 'Organization',
	'@id': `${SITE}/#organization`,
	name: 'GetRomy LLC',
	url: SITE,
	logo: { '@type': 'ImageObject', url: `${SITE}/icon-logo.png` }
};

interface ArticleInput {
	title: string;
	excerpt: string;
	date: string;
	tag: string;
	path: string;
}

export function articleJsonLd(post: ArticleInput) {
	const url = `${SITE}${post.path}`;
	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		'@id': `${url}#article`,
		mainEntityOfPage: { '@type': 'WebPage', '@id': url },
		headline: post.title.slice(0, 110),
		name: post.title,
		description: metaDescription(post.excerpt),
		datePublished: toIsoDate(post.date),
		dateModified: toIsoDate(post.date),
		articleSection: post.tag,
		image: [OG_IMAGE],
		inLanguage: 'en-US',
		author: { '@type': 'Organization', name: 'Rōmy', url: SITE },
		publisher: PUBLISHER,
		isPartOf: { '@type': 'Blog', name: 'Rōmy Blog', url: `${SITE}/blog` }
	};
}
