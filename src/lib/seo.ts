const STOPWORDS = new Set([
	'a',
	'an',
	'the',
	'is',
	'in',
	'on',
	'at',
	'to',
	'of',
	'for',
	'and',
	'or',
	'but',
	'with',
	'her',
	'his',
	'their',
	'your',
	'you',
	'it',
	'its',
	'was',
	'were',
	'are',
	'be',
	'been',
	'this',
	'that',
	'these',
	'those',
	'she',
	'he',
	'they',
	'we',
	'who',
	'whom',
	'why',
	'how',
	'not',
	'no',
	'than',
	'then',
	'so',
	'as',
	'by',
	'from',
	'into',
	'out',
	'up',
	'down',
	'off',
	'over',
	'under',
	'again',
	'when',
	'while',
	'if'
]);

const CORE_TOPIC_KEYWORDS = [
	'donor intelligence',
	'nonprofit fundraising',
	'prospect research',
	'AI donor research',
	'wealth screening',
	'major gifts'
];

/**
 * Pulls the meaningful, non-stopword terms out of a post title so each
 * post's <meta name="keywords"> reflects what the post is actually about
 * instead of repeating one boilerplate phrase across every page.
 */
export function deriveKeywords(title: string, tag?: string, extra: string[] = []): string {
	const titleTerms = title
		.toLowerCase()
		.replace(/[^a-z0-9\s'-]/g, '')
		.split(/\s+/)
		.filter((word) => word.length > 2 && !STOPWORDS.has(word));

	const seen = new Set<string>();
	const ordered: string[] = [];
	for (const term of [
		...titleTerms,
		...(tag ? [tag.toLowerCase()] : []),
		...extra,
		...CORE_TOPIC_KEYWORDS
	]) {
		if (!term || seen.has(term)) continue;
		seen.add(term);
		ordered.push(term);
	}

	return ordered.join(', ');
}

/**
 * Search engines truncate meta descriptions around ~155-160 characters.
 * Cuts long editorial excerpts at the nearest word boundary so the
 * displayed snippet ends cleanly instead of mid-word.
 */
export function truncateDescription(text: string, maxLength = 155): string {
	if (!text || text.length <= maxLength) return text;
	const cut = text.slice(0, maxLength);
	const lastSpace = cut.lastIndexOf(' ');
	const trimmed = lastSpace > 0 ? cut.slice(0, lastSpace) : cut;
	return `${trimmed.replace(/[,;:.\s-]+$/, '')}…`;
}
