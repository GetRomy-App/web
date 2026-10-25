export const SITE_URL = 'https://getromy.app';
export const SITE_NAME = 'Rōmy';
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;
export const OG_IMAGE_ALT =
	'Rōmy — donor intelligence and prospect research for small nonprofits';

/** Collapse whitespace and trim to a SERP-safe length, cutting on a word boundary. */
export function metaDescription(text: string, max = 158): string {
	const clean = text.replace(/\s+/g, ' ').replace(/\*/g, '').trim();
	if (clean.length <= max) return clean;
	const cut = clean.slice(0, max - 1);
	const lastSpace = cut.lastIndexOf(' ');
	return `${cut.slice(0, lastSpace > 80 ? lastSpace : cut.length).replace(/[\s,;:—-]+$/, '')}…`;
}

/** Serialise JSON-LD for inline <script>, escaping `<` so content can't close the tag. */
export function jsonLd(data: unknown): string {
	return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

export function toIsoDate(value: string): string | undefined {
	const d = new Date(value);
	return isNaN(d.getTime()) ? undefined : d.toISOString();
}

const BASE_KEYWORDS = [
	'donor intelligence',
	'nonprofit fundraising',
	'prospect research',
	'AI donor research',
	'wealth screening',
	'major donor prospecting'
];

export function articleKeywords(tag: string, extra: string[] = []): string {
	return [...extra, tag.toLowerCase(), ...BASE_KEYWORDS].filter(Boolean).join(', ');
}

interface ArticleLdInput {
	path: string;
	title: string;
	description: string;
	date: string;
	tag: string;
	section: 'Blog' | 'Labs';
}

export function articleJsonLd({ path, title, description, date, tag, section }: ArticleLdInput) {
	const url = `${SITE_URL}${path}`;
	const iso = toIsoDate(date);
	const listPath = section === 'Blog' ? '/blog' : '/labs';
	return [
		{
			'@context': 'https://schema.org',
			'@type': 'BlogPosting',
			'@id': `${url}#article`,
			headline: title.slice(0, 110),
			name: title,
			description,
			url,
			mainEntityOfPage: { '@type': 'WebPage', '@id': url },
			image: [OG_IMAGE],
			...(iso ? { datePublished: iso, dateModified: iso } : {}),
			articleSection: tag,
			inLanguage: 'en-US',
			isPartOf: { '@type': 'Blog', name: `${SITE_NAME} ${section}`, url: `${SITE_URL}${listPath}` },
			author: { '@type': 'Organization', name: 'GetRomy LLC', url: SITE_URL },
			publisher: {
				'@type': 'Organization',
				name: 'GetRomy LLC',
				url: SITE_URL,
				logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon-logo.png` }
			}
		},
		{
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
				{ '@type': 'ListItem', position: 2, name: section, item: `${SITE_URL}${listPath}` },
				{ '@type': 'ListItem', position: 3, name: title, item: url }
			]
		}
	];
}
