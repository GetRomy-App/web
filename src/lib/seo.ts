export const SITE = 'https://getromy.app';
export const OG_IMAGE = `${SITE}/og-image.jpg`;

/** Trim long excerpts to a SERP-friendly meta description (~155 chars) on a word boundary. */
export function metaDescription(text: string, max = 155): string {
	const clean = text.replace(/\s+/g, ' ').trim();
	if (clean.length <= max) return clean;
	const cut = clean.slice(0, max - 1);
	const lastSpace = cut.lastIndexOf(' ');
	return `${cut.slice(0, lastSpace > 80 ? lastSpace : cut.length).replace(/[\s,;:.—-]+$/, '')}…`;
}

export function jsonLd(data: unknown): string {
	return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

interface ArticleInput {
	title: string;
	excerpt: string;
	date: string;
	tag: string;
	url: string;
	section: { name: string; url: string };
}

export function articleJsonLd(p: ArticleInput) {
	return [
		{
			'@context': 'https://schema.org',
			'@type': 'BlogPosting',
			headline: p.title,
			description: metaDescription(p.excerpt, 300),
			datePublished: p.date,
			dateModified: p.date,
			articleSection: p.tag,
			image: OG_IMAGE,
			inLanguage: 'en-US',
			mainEntityOfPage: { '@type': 'WebPage', '@id': p.url },
			url: p.url,
			author: { '@type': 'Organization', name: 'Rōmy', url: SITE },
			publisher: {
				'@type': 'Organization',
				name: 'GetRomy LLC',
				url: SITE,
				logo: { '@type': 'ImageObject', url: `${SITE}/icon-logo.png` }
			}
		},
		{
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Rōmy', item: SITE },
				{ '@type': 'ListItem', position: 2, name: p.section.name, item: p.section.url },
				{ '@type': 'ListItem', position: 3, name: p.title, item: p.url }
			]
		}
	];
}
