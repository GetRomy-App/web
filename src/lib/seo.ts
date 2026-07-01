const STOPWORDS = new Set([
	'the',
	'a',
	'an',
	'and',
	'or',
	'of',
	'in',
	'on',
	'at',
	'to',
	'for',
	'is',
	'was',
	'her',
	'his',
	'she',
	'he',
	'it',
	'with',
	'be',
	'are',
	'as',
	'that',
	'this',
	'you',
	'your',
	'we',
	'from',
	'not',
	'but',
	'has',
	'have',
	'had'
]);

const BASE_KEYWORDS = [
	'donor intelligence',
	'nonprofit fundraising',
	'prospect research',
	'AI donor research',
	'major donor prospecting',
	'wealth screening'
];

export function deriveKeywords(title: string, tag: string): string {
	const titleWords = title
		.toLowerCase()
		.replace(/[^a-z0-9\s]/g, '')
		.split(/\s+/)
		.filter((w) => w.length > 3 && !STOPWORDS.has(w));

	const unique = Array.from(new Set([tag.toLowerCase(), ...titleWords, ...BASE_KEYWORDS]));
	return unique.slice(0, 12).join(', ');
}
