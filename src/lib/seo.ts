export const SITE = 'https://getromy.app';
export const OG_IMAGE = `${SITE}/og-image.jpg`;

/** Trim long copy (post excerpts run to a full paragraph) to a snippet-sized meta description. */
export function snippet(text: string, max = 155): string {
	const clean = text.replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim();
	if (clean.length <= max) return clean;
	const cut = clean.slice(0, max - 1);
	const lastSpace = cut.lastIndexOf(' ');
	return `${cut.slice(0, lastSpace > max * 0.6 ? lastSpace : cut.length).replace(/[\s,;:—–-]+$/, '')}…`;
}

/** Serialise structured data for a <script type="application/ld+json"> block. */
export function jsonLd(data: unknown): string {
	const json = JSON.stringify(data).replace(/</g, '\\u003c');
	return `<script type="application/ld+json">${json}</script>`;
}

const publisher = {
	'@type': 'Organization',
	name: 'Rōmy',
	url: SITE,
	logo: { '@type': 'ImageObject', url: `${SITE}/icon-logo.png` }
};

export function articleSchema(opts: {
	title: string;
	description: string;
	date: string;
	section: string;
	url: string;
	sectionName: string;
	sectionUrl: string;
}) {
	return [
		{
			'@context': 'https://schema.org',
			'@type': 'BlogPosting',
			headline: opts.title,
			description: opts.description,
			datePublished: opts.date,
			dateModified: opts.date,
			articleSection: opts.section,
			inLanguage: 'en-US',
			image: OG_IMAGE,
			mainEntityOfPage: { '@type': 'WebPage', '@id': opts.url },
			url: opts.url,
			author: publisher,
			publisher
		},
		{
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Rōmy', item: SITE },
				{ '@type': 'ListItem', position: 2, name: opts.sectionName, item: opts.sectionUrl },
				{ '@type': 'ListItem', position: 3, name: opts.title, item: opts.url }
			]
		}
	];
}
