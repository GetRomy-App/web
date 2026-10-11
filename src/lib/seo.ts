export const SITE_URL = 'https://getromy.app';
export const SITE_NAME = 'Rōmy';
export const DEFAULT_OG_IMAGE = '/og-image.jpg';

export const DEFAULT_KEYWORDS =
	'donor intelligence, nonprofit fundraising, prospect research, AI donor research, wealth screening, major donor prospecting';

export const PUBLISHER = {
	'@type': 'Organization',
	'@id': `${SITE_URL}/#organization`,
	name: 'GetRomy LLC',
	url: SITE_URL
};

export function breadcrumbs(items: { name: string; path: string }[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: item.name,
			item: SITE_URL + item.path
		}))
	};
}

export function articleLd(opts: {
	title: string;
	description: string;
	path: string;
	date: string;
	section: string;
}) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: opts.title,
		description: opts.description,
		datePublished: opts.date,
		dateModified: opts.date,
		articleSection: opts.section,
		inLanguage: 'en-US',
		image: SITE_URL + DEFAULT_OG_IMAGE,
		mainEntityOfPage: { '@type': 'WebPage', '@id': SITE_URL + opts.path },
		author: { '@type': 'Organization', name: 'Rōmy', url: SITE_URL },
		publisher: {
			...PUBLISHER,
			logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon-logo.png` }
		}
	};
}
