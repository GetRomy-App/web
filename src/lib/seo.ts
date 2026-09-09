/** Shared SEO/structured-data helpers. Keeps per-page <svelte:head> blocks
 * consistent without duplicating logic (or the meta tags themselves —
 * see the note in src/routes/+layout.svelte about not re-adding
 * page-identity tags there). */

const SITE = 'https://getromy.app';
const OG_IMAGE = `${SITE}/og-image.jpg`;

const STOPWORDS = new Set([
	'a',
	'an',
	'the',
	'is',
	'was',
	'were',
	'are',
	'be',
	'to',
	'of',
	'in',
	'on',
	'for',
	'and',
	'or',
	'her',
	'his',
	'its',
	'it',
	'you',
	'your',
	'we',
	'our',
	'that',
	'this',
	'as',
	'at',
	'by',
	'with',
	'from',
	'who',
	'what',
	'why',
	'how'
]);

const BASE_TOPIC_TERMS = [
	'donor intelligence',
	'nonprofit fundraising',
	'prospect research',
	'AI donor research',
	'wealth screening'
];

/** Pull the meaningful (non-stopword) words out of a post title, in order,
 * so a post's own headline terms lead its keyword list instead of a
 * generic phrase repeated on every post. */
function titleTerms(title: string): string[] {
	return title
		.split(/[\s—–\-:,'"]+/)
		.map((w) => w.trim())
		.filter((w) => w.length > 2 && !STOPWORDS.has(w.toLowerCase()));
}

/** Build a per-post meta keywords string from its title + tag, layered
 * over the site's core topic terms — unique per post, not stuffed. */
export function buildPostKeywords(title: string, tag: string): string {
	const terms = [...titleTerms(title), tag, ...BASE_TOPIC_TERMS];
	const seen = new Set<string>();
	const deduped: string[] = [];
	for (const term of terms) {
		const key = term.toLowerCase();
		if (!term || seen.has(key)) continue;
		seen.add(key);
		deduped.push(term);
	}
	return deduped.slice(0, 12).join(', ');
}

export interface BreadcrumbEntry {
	name: string;
	path: string;
}

export function breadcrumbJsonLd(entries: BreadcrumbEntry[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: entries.map((entry, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: entry.name,
			item: `${SITE}${entry.path}`
		}))
	};
}

export interface BlogPostingInput {
	title: string;
	description: string;
	path: string;
	datePublished: string;
	tag: string;
}

/** BlogPosting structured data. Author/publisher are the org (GetRomy LLC) —
 * posts don't carry a byline in frontmatter, so we don't invent a person. */
export function blogPostingJsonLd(post: BlogPostingInput) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: post.title,
		description: post.description,
		image: OG_IMAGE,
		datePublished: post.datePublished,
		dateModified: post.datePublished,
		keywords: post.tag,
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': `${SITE}${post.path}`
		},
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
