const SITE = 'https://getromy.app';

export const ORG_ID = `${SITE}/#organization`;
export const SITE_ID = `${SITE}/#website`;

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

export function blogPostingLd(post: {
	slug: string;
	title: string;
	date: string;
	excerpt: string;
	tag: string;
	path: string;
}) {
	const url = `${SITE}${post.path}`;
	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		'@id': `${url}#article`,
		mainEntityOfPage: { '@type': 'WebPage', '@id': url },
		headline: post.title,
		description: post.excerpt,
		datePublished: post.date,
		dateModified: post.date,
		articleSection: post.tag,
		inLanguage: 'en-US',
		image: `${SITE}/og-image.jpg`,
		author: { '@type': 'Organization', '@id': ORG_ID, name: 'Rōmy' },
		publisher: { '@type': 'Organization', '@id': ORG_ID, name: 'Rōmy' },
		isPartOf: { '@id': SITE_ID }
	};
}
