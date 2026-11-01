export const SITE = {
	name: 'Rōmy',
	legalName: 'GetRomy LLC',
	url: 'https://getromy.app',
	twitter: '@RomyFindsMoney',
	image: '/og-image.jpg',
	imageAlt: 'Rōmy — donor intelligence for small nonprofits'
} as const;

export const KEYWORDS_CORE =
	'donor intelligence, nonprofit prospect research, major donor prospecting, AI donor research, wealth screening for nonprofits, affordable prospect research software, small nonprofit fundraising, donor discovery, giving history, fundraising software';

/** Breadcrumb trail → schema.org BreadcrumbList. Items are [name, path]. */
export function breadcrumbs(items: [string, string][]): Record<string, unknown> {
	return {
		'@type': 'BreadcrumbList',
		itemListElement: items.map(([name, path], i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name,
			item: `${SITE.url}${path}`
		}))
	};
}

export function articleSchema(opts: {
	title: string;
	description: string;
	path: string;
	published: string;
	section: string;
	keywords: string;
}): Record<string, unknown> {
	const url = `${SITE.url}${opts.path}`;
	return {
		'@type': 'BlogPosting',
		'@id': `${url}#article`,
		mainEntityOfPage: { '@type': 'WebPage', '@id': url },
		headline: opts.title,
		description: opts.description,
		datePublished: opts.published,
		dateModified: opts.published,
		articleSection: opts.section,
		keywords: opts.keywords,
		inLanguage: 'en-US',
		image: `${SITE.url}${SITE.image}`,
		author: { '@type': 'Organization', name: SITE.name, url: SITE.url },
		publisher: {
			'@type': 'Organization',
			name: SITE.legalName,
			url: SITE.url,
			logo: { '@type': 'ImageObject', url: `${SITE.url}/icon-logo.png` }
		}
	};
}
