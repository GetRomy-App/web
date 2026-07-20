export const SITE_URL = 'https://getromy.app';
export const SITE_NAME = 'Rōmy';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

const STOPWORDS = new Set([
	'a',
	'an',
	'and',
	'the',
	'is',
	'are',
	'was',
	'were',
	'in',
	'on',
	'at',
	'to',
	'of',
	'for',
	'with',
	'you',
	'your',
	'her',
	'his',
	'its',
	'it',
	'that',
	'this',
	'be',
	'was',
	'has',
	'have',
	'had',
	'not',
	'but',
	'or',
	'as',
	'by',
	'from',
	'she',
	'he',
	'they',
	'we',
	'i'
]);

export function absoluteUrl(path: string): string {
	return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Derives a per-post keyword list from title/excerpt/tag instead of repeating
 * one static string across every post — near-duplicate meta tags are a mild
 * SEO smell even though Google itself ignores the keywords meta tag.
 */
export function buildPostKeywords(post: { title: string; excerpt: string; tag: string }): string {
	const words = `${post.title} ${post.excerpt}`
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, ' ')
		.split(/\s+/)
		.filter((w) => w.length > 3 && !STOPWORDS.has(w));

	const seen = new Set<string>();
	const unique: string[] = [];
	for (const w of words) {
		if (!seen.has(w)) {
			seen.add(w);
			unique.push(w);
		}
	}

	const base = ['donor intelligence', 'nonprofit fundraising', 'prospect research'];
	if (post.tag) base.push(post.tag.toLowerCase());

	return [...base, ...unique.slice(0, 8)].join(', ');
}
