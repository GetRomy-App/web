const SITE = 'https://getromy.app';

const BASE_KEYWORDS = [
	'donor intelligence',
	'nonprofit fundraising',
	'prospect research',
	'AI donor research',
	'wealth screening'
];

const STOP_WORDS = new Set([
	'a',
	'an',
	'the',
	'and',
	'or',
	'but',
	'of',
	'to',
	'in',
	'on',
	'for',
	'with',
	'at',
	'by',
	'is',
	'are',
	'was',
	'were',
	'be',
	'been',
	'it',
	'its',
	'this',
	'that',
	'how',
	'we',
	'you',
	'your',
	'our',
	'from',
	'as',
	'than',
	'then',
	'so',
	'if',
	'not',
	'no',
	'can',
	'could',
	'will',
	'would',
	'should',
	'do',
	'does',
	'did',
	'has',
	'have',
	'had',
	'into',
	'about',
	'after',
	'before',
	'over',
	'under',
	'out',
	'up',
	'down',
	'per',
	'vs',
	'why',
	'what',
	'when',
	'where',
	'who',
	'which',
	'she',
	'he',
	'they',
	'them',
	'his',
	'her',
	'their',
	'all',
	'one',
	'two',
	'more',
	'most',
	'own',
	'just',
	'only',
	'also',
	'even',
	'still',
	'never',
	'always'
]);

function extractKeywords(text: string, max: number): string[] {
	const words = text
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, ' ')
		.split(/\s+/)
		.filter((w) => w.length > 2 && !STOP_WORDS.has(w));

	const seen = new Set<string>();
	const out: string[] = [];
	for (const w of words) {
		if (seen.has(w)) continue;
		seen.add(w);
		out.push(w);
		if (out.length >= max) break;
	}
	return out;
}

/** Derives a per-post keyword list from existing frontmatter (title/tag/excerpt) — no new copy, just metadata. */
export function deriveKeywords(title: string, tag: string, excerpt: string): string {
	const combined = [
		...BASE_KEYWORDS,
		tag.toLowerCase(),
		...extractKeywords(title, 6),
		...extractKeywords(excerpt, 6)
	];

	const seen = new Set<string>();
	const unique: string[] = [];
	for (const k of combined) {
		const key = k.trim();
		if (!key || seen.has(key)) continue;
		seen.add(key);
		unique.push(key);
	}
	return unique.slice(0, 16).join(', ');
}

export interface PostLike {
	slug: string;
	title: string;
	excerpt: string;
	date: string;
	tag: string;
}

export function blogPostingJsonLd(post: PostLike, path: string) {
	const url = `${SITE}${path}`;
	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: post.title,
		description: post.excerpt,
		datePublished: post.date,
		dateModified: post.date,
		mainEntityOfPage: { '@type': 'WebPage', '@id': url },
		url,
		image: `${SITE}/og-image.jpg`,
		articleSection: post.tag,
		inLanguage: 'en-US',
		isAccessibleForFree: true,
		author: {
			'@type': 'Organization',
			name: 'GetRomy LLC',
			url: SITE
		},
		publisher: {
			'@type': 'Organization',
			name: 'GetRomy LLC',
			url: SITE,
			logo: {
				'@type': 'ImageObject',
				url: `${SITE}/icon-logo.png`
			}
		}
	};
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
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

export function postListJsonLd(
	name: string,
	description: string,
	path: string,
	posts: PostLike[],
	basePath: string
) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Blog',
		name,
		description,
		url: `${SITE}${path}`,
		blogPost: posts.map((post) => ({
			'@type': 'BlogPosting',
			headline: post.title,
			description: post.excerpt,
			datePublished: post.date,
			url: `${SITE}${basePath}/${post.slug}`
		}))
	};
}
