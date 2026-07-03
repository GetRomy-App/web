export interface ArticleMeta {
	publishedTime?: string;
	modifiedTime?: string;
	section?: string;
	tag?: string;
}

export interface SeoData {
	title: string;
	description: string;
	path: string;
	type?: 'website' | 'article';
	image?: string;
	keywords?: string;
	robots?: string;
	article?: ArticleMeta;
	jsonLd?: unknown[];
}

const SITE_URL = 'https://getromy.app';

export function breadcrumbList(items: Array<{ name: string; path: string }>) {
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

const STOPWORDS = new Set([
	'the',
	'a',
	'an',
	'and',
	'or',
	'but',
	'of',
	'to',
	'in',
	'on',
	'for',
	'is',
	'are',
	'was',
	'your',
	'you',
	'her',
	'his',
	'their',
	'it',
	'its',
	'at',
	'by',
	'with',
	'nobody',
	'not',
	'no'
]);

export function keywordsFromTitle(title: string, extra: string[] = []): string {
	const titleWords = title
		.toLowerCase()
		.replace(/[^a-z0-9\s'-]/g, '')
		.split(/\s+/)
		.filter((w) => w.length > 2 && !STOPWORDS.has(w));
	return [...new Set([...titleWords, ...extra])].join(', ');
}
