/**
 * SEO / GEO helpers shared by every page.
 *
 * Everything here works on metadata only: titles, descriptions, keywords and
 * structured data. Nothing here changes what a visitor reads on the page.
 */

export const SITE_URL = 'https://getromy.app';
export const SITE_NAME = 'Rōmy';
export const LEGAL_NAME = 'GetRomy LLC';
export const TWITTER_HANDLE = '@RomyFindsMoney';
export const LOGO_URL = `${SITE_URL}/icon-logo.png`;

export const DEFAULT_OG_IMAGE = {
	url: `${SITE_URL}/og-image.jpg`,
	width: 1920,
	height: 1080,
	alt: 'Rōmy: donor intelligence and AI prospect research for small nonprofits'
};

/** Stable @id references so every JSON-LD block on the site links into one graph. */
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const SOFTWARE_ID = `${SITE_URL}/#software`;
export const BLOG_ID = `${SITE_URL}/blog#blog`;

/** Core terms we want Rōmy associated with, by search engines and by LLM answer engines alike. */
export const CORE_KEYWORDS = [
	'donor intelligence',
	'prospect research',
	'AI prospect research',
	'wealth screening',
	'donor research software',
	'major gift fundraising',
	'major donor prospecting',
	'small nonprofit fundraising',
	'nonprofit fundraising software',
	'wealth screening alternative',
	'giving history',
	'donor wealth indicators',
	'fundraising software for small nonprofits',
	'affordable prospect research tool'
];

const TAG_KEYWORDS: Record<string, string[]> = {
	'Field Notes': [
		'major gift fundraising',
		'donor relationships',
		'donor stewardship',
		'development officer',
		'donor retention',
		'prospect research',
		'nonprofit fundraising'
	],
	Industry: [
		'nonprofit fundraising strategy',
		'major gifts',
		'donor intelligence',
		'wealth screening',
		'small nonprofit fundraising',
		'fundraising best practices'
	],
	Engineering: [
		'donor intelligence platform',
		'AI prospect research',
		'wealth screening cost',
		'nonprofit technology',
		'prospect research software'
	],
	Research: [
		'AI prospect research benchmark',
		'AI for nonprofits',
		'donor research AI comparison',
		'nonprofit AI evaluation',
		'ChatGPT for fundraising'
	],
	'Data Science': [
		'wealth indicators',
		'donor data analysis',
		'prospect research methodology',
		'AI donor research'
	]
};

/** Topic signals detected from a post's title + excerpt, used for keywords and schema.org `about`. */
const TOPIC_RULES: [RegExp, string][] = [
	[
		/\b(will|bequest|estate|planned gift|planned-giving|planned giving|named in)\b/i,
		'planned giving'
	],
	[
		/\b(fidelity|donor-advised|daf|schwab charitable|vanguard charitable)\b/i,
		'donor-advised funds'
	],
	[/\b(autopay|monthly|recurring|auto-debit|standing order)\b/i, 'monthly giving'],
	[/\b(board|trustee)s?\b/i, 'nonprofit board fundraising'],
	[/\b(capacity|wealth screen|wealth-screen|wealth indicator)/i, 'wealth screening'],
	[/\b(crm|database|record)s?\b/i, 'donor CRM data'],
	[/\b(thank|gratitude|thank-you|stewardship)\b/i, 'donor stewardship'],
	[
		/\b(obituar|funeral|grief|in lieu of|memorial|pallbearer|hospice)/i,
		'memorial and tribute gifts'
	],
	[/\b(lapsed|went quiet|lapse)\b/i, 'lapsed donor reactivation'],
	[/\b(alumn|reunion|class of)/i, 'alumni giving'],
	[/\b(gala|event|registration)\b/i, 'fundraising events'],
	[/\b(volunteer)s?\b/i, 'volunteer-to-donor conversion'],
	[/\b(ask|asking|the number)\b/i, 'making the ask'],
	[/\b(annual report)\b/i, 'donor communications'],
	[/\b(first gift|first-generation|new donor)\b/i, 'donor acquisition'],
	[/\b(portfolio|caseload)\b/i, 'major gift portfolio management'],
	[/\b(timing|calendar|liquidity|sold for|exit)\b/i, 'gift timing'],
	[/\b(church|offering plate|bulletin|congregation)\b/i, 'faith-based fundraising'],
	[/\b(ai|benchmark|chatgpt|gemini|claude)\b/i, 'AI for nonprofits']
];

export function topicsFor(text: string): string[] {
	const found = new Set<string>();
	for (const [re, topic] of TOPIC_RULES) if (re.test(text)) found.add(topic);
	return [...found];
}

export function keywordsForPost(post: { title: string; excerpt: string; tag: string }): string[] {
	const base = TAG_KEYWORDS[post.tag] ?? TAG_KEYWORDS.Industry;
	const all = [...topicsFor(`${post.title} ${post.excerpt}`), ...base, 'Rōmy'];
	return [...new Set(all.map((k) => k.trim()))];
}

/** Topical suffix for <title> so narrative titles still carry a search-intent phrase. */
const TAG_TITLE_SUFFIX: Record<string, string> = {
	'Field Notes': 'Major Gift Fundraising',
	Industry: 'Nonprofit Fundraising',
	Engineering: 'Donor Intelligence',
	Research: 'AI Prospect Research',
	'Data Science': 'Prospect Research'
};

/**
 * Build a SERP-friendly title. Adds a topical phrase when there's room, and
 * always ends with the brand. Aims to stay near the ~60-character display width.
 */
export function seoTitle(title: string, tag: string, section = 'Rōmy'): string {
	const suffix = TAG_TITLE_SUFFIX[tag];
	const withTopic = suffix ? `${title}: ${suffix} | ${section}` : '';
	if (withTopic && withTopic.length <= 65) return withTopic;
	return `${title} | ${section}`;
}

function stripMarkup(text: string): string {
	return text
		.replace(/<[^>]+>/g, ' ')
		.replace(/[*_`#>]/g, '')
		.replace(/\s+/g, ' ')
		.trim();
}

/** Trim to a word boundary at or below `max` characters, adding an ellipsis if cut. */
export function truncate(text: string, max = 158): string {
	if (text.length <= max) return text;
	const cut = text.slice(0, max - 1);
	const lastSpace = cut.lastIndexOf(' ');
	return `${cut.slice(0, lastSpace > 80 ? lastSpace : cut.length).replace(/[\s,;:—–-]+$/, '')}…`;
}

/**
 * Turn a post excerpt into a meta description.
 *
 * Many Field Notes excerpts open with a long scene and end with the summary
 * sentence ("A short letter on …"). That sentence is the one that says what
 * the piece is about, so lead with it.
 */
export function seoDescription(excerpt: string, max = 158): string {
	const clean = stripMarkup(excerpt);
	const summary = clean.match(/\bA (?:short )?(?:letter|note)[ ,][^.]*(?:\.|$)/)?.[0];
	if (summary && summary.length >= 60) return truncate(summary, max);
	// Otherwise prefer complete sentences that fit.
	const sentences = clean.match(/[^.!?]+[.!?]+(\s|$)/g) ?? [clean];
	let out = '';
	for (const s of sentences) {
		if ((out + s).trim().length > max) break;
		out += s;
	}
	out = out.trim();
	return out.length >= 100 ? out : truncate(clean, max);
}

/** Meta description for a post: its hand-written `seo_description` if set, else derived from the excerpt. */
export function postDescription(
	post: { excerpt: string; seo_description?: string },
	max = 158
): string {
	return post.seo_description
		? truncate(post.seo_description, max)
		: seoDescription(post.excerpt, max);
}

export function wordCountOf(html: string): number {
	const text = stripMarkup(html);
	return text ? text.split(' ').length : 0;
}

/** ISO date (keeps the plain YYYY-MM-DD form when that's what the frontmatter holds). */
export function isoDate(value: string | undefined): string | undefined {
	if (!value) return undefined;
	const d = new Date(value);
	if (isNaN(d.getTime())) return undefined;
	return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : d.toISOString();
}

/** Serialize JSON-LD safely for inlining into a <script> tag. */
export function jsonLd(data: unknown): string {
	const json = JSON.stringify(data)
		.replace(/</g, '\\u003c')
		.replace(/>/g, '\\u003e')
		.replace(/&/g, '\\u0026');
	return `<script type="application/ld+json">${json}</script>`;
}

export function breadcrumbs(items: { name: string; path: string }[]) {
	return {
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: item.name,
			item: `${SITE_URL}${item.path}`
		}))
	};
}

export const organizationSchema = {
	'@type': 'Organization',
	'@id': ORG_ID,
	name: SITE_NAME,
	legalName: LEGAL_NAME,
	alternateName: ['Romy', 'GetRomy', 'Rōmy Donor Intelligence'],
	url: SITE_URL,
	logo: {
		'@type': 'ImageObject',
		url: LOGO_URL
	},
	image: DEFAULT_OG_IMAGE.url,
	description:
		'Rōmy is a donor intelligence and AI prospect research platform that helps small nonprofits find new major donors at a fraction of the cost of enterprise wealth screening.',
	slogan: 'Donor intelligence, reimagined.',
	knowsAbout: [
		'Donor intelligence',
		'Prospect research',
		'Wealth screening',
		'Major gift fundraising',
		'Planned giving',
		'Nonprofit fundraising',
		'Philanthropy',
		'AI for nonprofits'
	],
	contactPoint: {
		'@type': 'ContactPoint',
		email: 'solomon@getromy.app',
		contactType: 'sales',
		availableLanguage: ['English']
	},
	sameAs: ['https://x.com/RomyFindsMoney', 'https://github.com/GetRomy-App']
};

export const websiteSchema = {
	'@type': 'WebSite',
	'@id': WEBSITE_ID,
	url: SITE_URL,
	name: SITE_NAME,
	alternateName: 'Romy',
	description:
		'Donor intelligence and AI prospect research for small nonprofits, plus field notes on major gift fundraising.',
	inLanguage: 'en-US',
	publisher: { '@id': ORG_ID }
};

export const softwareSchema = {
	'@type': 'SoftwareApplication',
	'@id': SOFTWARE_ID,
	name: SITE_NAME,
	alternateName: 'Rōmy Donor Intelligence',
	url: 'https://intel.getromy.app',
	applicationCategory: 'BusinessApplication',
	applicationSubCategory: 'Nonprofit Fundraising Software',
	operatingSystem: 'Web browser',
	description:
		'Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions. AI-powered prospect research with wealth indicators, giving history, and affinity signals.',
	image: DEFAULT_OG_IMAGE.url,
	screenshot: `${SITE_URL}/screenshot.png`,
	offers: {
		'@type': 'Offer',
		price: '0',
		priceCurrency: 'USD',
		availability: 'https://schema.org/InStock'
	},
	audience: {
		'@type': 'Audience',
		audienceType:
			'Small nonprofits, development officers, major gift officers, and prospect researchers'
	},
	publisher: { '@id': ORG_ID },
	featureList: [
		'AI-powered donor prospect research',
		'Wealth indicator screening',
		'Giving history analysis',
		'Affinity signal detection',
		'Actionable donor profiles',
		'No enterprise contracts required'
	]
};
