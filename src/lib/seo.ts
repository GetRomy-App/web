export const SITE_URL = 'https://getromy.app';
export const SITE_NAME = 'Rōmy';
export const DEFAULT_OG_IMAGE = '/og-image.jpg';
export const ORG_ID = `${SITE_URL}/#organization`;
export const APP_ID = `${SITE_URL}/#software`;

export function breadcrumbs(items: { name: string; path: string }[]) {
	return {
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: item.name,
			item: `${SITE_URL}${item.path}`
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
	const url = `${SITE_URL}${post.path}`;
	return {
		'@type': 'BlogPosting',
		'@id': `${url}#article`,
		mainEntityOfPage: { '@type': 'WebPage', '@id': url },
		headline: post.title,
		description: post.excerpt,
		datePublished: post.date,
		dateModified: post.date,
		articleSection: post.tag,
		inLanguage: 'en-US',
		image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
		author: { '@id': ORG_ID },
		publisher: { '@id': ORG_ID, '@type': 'Organization', name: 'GetRomy LLC' }
	};
}
