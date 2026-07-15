const CORE_TERMS = [
	'donor intelligence',
	'nonprofit fundraising',
	'prospect research',
	'major donor prospecting',
	'AI donor research',
	'wealth screening'
];

const STOPWORDS = new Set([
	'a',
	'an',
	'the',
	'and',
	'or',
	'but',
	'is',
	'was',
	'were',
	'be',
	'to',
	'of',
	'in',
	'on',
	'at',
	'for',
	'with',
	'her',
	'his',
	'you',
	'your',
	'it',
	'its',
	'is',
	'are',
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
	'do',
	'does',
	'did'
]);

/** Derives a per-post keyword list from the post's title + tag, layered on top of the core product terms. */
export function buildPostKeywords(title: string, tag: string): string {
	const titleWords = title
		.toLowerCase()
		.replace(/[^a-z0-9\s'-]/g, '')
		.split(/\s+/)
		.filter((word) => word.length > 3 && !STOPWORDS.has(word));

	const titlePhrase = titleWords.join(' ');
	const tagTerm = tag ? tag.toLowerCase() : '';

	const keywords = [titlePhrase, tagTerm, ...CORE_TERMS].filter(Boolean);

	return Array.from(new Set(keywords)).join(', ');
}
