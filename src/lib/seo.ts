export const SITE_URL = 'https://getromy.app';
export const SITE_NAME = 'Rōmy';
export const ORG_NAME = 'GetRomy LLC';
export const TWITTER_HANDLE = '@RomyFindsMoney';
export const DEFAULT_OG_IMAGE = '/og-image.jpg';

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

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

export function articleSchema(post: {
	slug: string;
	title: string;
	excerpt: string;
	date: string;
	tag: string;
	basePath: string;
}) {
	const url = `${SITE_URL}${post.basePath}/${post.slug}`;
	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		'@id': `${url}#article`,
		mainEntityOfPage: { '@type': 'WebPage', '@id': url },
		url,
		headline: post.title,
		description: post.excerpt,
		datePublished: post.date,
		dateModified: post.date,
		articleSection: post.tag,
		inLanguage: 'en-US',
		image: `${SITE_URL}/og-image.jpg`,
		author: { '@id': ORG_ID },
		publisher: { '@id': ORG_ID },
		isPartOf: { '@id': WEBSITE_ID }
	};
}
