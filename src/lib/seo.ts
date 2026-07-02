export const SITE_URL = 'https://getromy.app';
export const SITE_NAME = 'Rōmy';
export const ORG_NAME = 'GetRomy LLC';
export const TWITTER_HANDLE = '@RomyFindsMoney';

export const DEFAULT_OG_IMAGE = {
	url: `${SITE_URL}/og-image.jpg`,
	width: 1920,
	height: 1080,
	alt: 'Rōmy — Donor Intelligence for Small Nonprofits'
};

const BASE_KEYWORDS = ['donor intelligence', 'nonprofit fundraising', 'prospect research'];

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
	'with',
	'is',
	'are',
	'was',
	'were',
	'be',
	'her',
	'his',
	'your',
	'you',
	'it',
	'at',
	'as',
	'by',
	'from',
	'that',
	'this',
	'has',
	'have',
	'had',
	'not',
	'no',
	'so',
	'if',
	'than',
	'then',
	'into',
	'about',
	'after',
	'before',
	'over',
	'under',
	'out',
	'up',
	'down',
	'who',
	'what',
	'when',
	'where',
	'why',
	'how',
	'their',
	'our',
	'my',
	'i',
	'we',
	'they',
	'he',
	'she',
	'him',
	'them',
	'its',
	'do',
	'does',
	'did',
	'can',
	'could',
	'should',
	'would',
	'will',
	'just',
	'more',
	'most',
	'some',
	'all',
	'one',
	'two',
	'each',
	'every'
]);

/** Derives a per-post keyword set from its title/excerpt/tag so every post targets distinct phrases instead of one shared list. */
export function deriveKeywords(title: string, excerpt: string, tag: string): string[] {
	const text = `${title} ${excerpt}`.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ');

	const freq = new Map<string, number>();
	for (const word of text.split(/\s+/)) {
		if (word.length <= 3 || STOPWORDS.has(word)) continue;
		freq.set(word, (freq.get(word) ?? 0) + 1);
	}

	const topWords = [...freq.entries()]
		.sort((a, b) => b[1] - a[1])
		.slice(0, 6)
		.map(([word]) => word);

	return [...new Set([...BASE_KEYWORDS, tag.toLowerCase(), ...topWords])];
}

interface BreadcrumbItem {
	name: string;
	path: string;
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: `${SITE_URL}${item.path}`
		}))
	};
}

export function articleJsonLd(opts: {
	title: string;
	description: string;
	path: string;
	date: string;
	tag: string;
	keywords: string[];
}) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: opts.title,
		description: opts.description,
		image: DEFAULT_OG_IMAGE.url,
		datePublished: opts.date,
		dateModified: opts.date,
		author: {
			'@type': 'Organization',
			name: SITE_NAME,
			url: SITE_URL
		},
		publisher: {
			'@type': 'Organization',
			name: ORG_NAME,
			logo: {
				'@type': 'ImageObject',
				url: `${SITE_URL}/icon-logo.png`
			}
		},
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': `${SITE_URL}${opts.path}`
		},
		url: `${SITE_URL}${opts.path}`,
		articleSection: opts.tag,
		keywords: opts.keywords.join(', ')
	};
}
