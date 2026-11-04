export const SITE = 'https://getromy.app';

/** Trim long text to a search-snippet-friendly meta description, cutting at a word boundary. */
export function metaDescription(text: string, max = 158): string {
	const clean = text.replace(/\s+/g, ' ').replace(/[*_`]/g, '').trim();
	if (clean.length <= max) return clean;
	const cut = clean.slice(0, max - 1);
	const space = cut.lastIndexOf(' ');
	return cut.slice(0, space > 80 ? space : cut.length).replace(/[,;:\-—\s]+$/, '') + '…';
}

/** Serialise JSON-LD safely for inlining in a <script> tag. */
export function jsonLd(data: unknown): string {
	return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

interface ArticleInput {
	path: string;
	section: 'blog' | 'labs';
	title: string;
	excerpt: string;
	date: string;
	tag: string;
}

export function articleSchema({ path, section, title, excerpt, date, tag }: ArticleInput) {
	const url = `${SITE}${path}`;
	const sectionName = section === 'labs' ? 'Rōmy Labs' : 'Rōmy Blog';
	const sectionPath = section === 'labs' ? '/labs' : '/blog';
	return [
		{
			'@context': 'https://schema.org',
			'@type': 'BlogPosting',
			'@id': `${url}#article`,
			mainEntityOfPage: { '@type': 'WebPage', '@id': url },
			headline: title.slice(0, 110),
			name: title,
			description: metaDescription(excerpt, 300),
			datePublished: date,
			dateModified: date,
			articleSection: tag,
			inLanguage: 'en-US',
			image: `${SITE}/og-image.jpg`,
			author: { '@type': 'Organization', name: 'Rōmy', url: SITE },
			publisher: {
				'@type': 'Organization',
				name: 'GetRomy LLC',
				url: SITE,
				logo: { '@type': 'ImageObject', url: `${SITE}/icon-logo.png` }
			},
			isPartOf: { '@type': 'Blog', name: sectionName, url: `${SITE}${sectionPath}` }
		},
		{
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Rōmy', item: SITE + '/' },
				{ '@type': 'ListItem', position: 2, name: sectionName, item: `${SITE}${sectionPath}` },
				{ '@type': 'ListItem', position: 3, name: title, item: url }
			]
		}
	];
}
