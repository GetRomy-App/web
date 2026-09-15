export const SITE = 'https://getromy.app';

export interface SeoData {
	title: string;
	description: string;
	path: string;
	keywords?: string;
	type?: 'website' | 'article';
	image?: string;
	imageAlt?: string;
	publishedTime?: string;
	modifiedTime?: string;
	section?: string;
	jsonLd?: Record<string, unknown>[];
}

export const DEFAULT_SEO: SeoData = {
	title: 'Rōmy — Donor Intelligence for Small Nonprofits',
	description:
		'Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions. AI-powered prospect research, wealth indicators, and giving history — at a price built for small teams.',
	path: '/',
	keywords:
		'nonprofit donor intelligence, fundraising software, prospect research tool, donor discovery platform, wealth screening, giving history, AI donor research, nonprofit fundraising, major donor prospecting, small nonprofit tools, donor management, philanthropy intelligence, fundraising CRM, nonprofit technology, donor wealth indicators',
	type: 'website'
};

export function articleJsonLd(opts: {
	title: string;
	description: string;
	path: string;
	datePublished: string;
	dateModified?: string;
	section?: string;
	image?: string;
}): Record<string, unknown> {
	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: opts.title,
		description: opts.description,
		datePublished: opts.datePublished,
		dateModified: opts.dateModified ?? opts.datePublished,
		image: opts.image ? `${SITE}${opts.image}` : `${SITE}/og-image.jpg`,
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': `${SITE}${opts.path}`
		},
		...(opts.section ? { articleSection: opts.section } : {}),
		author: {
			'@type': 'Organization',
			name: 'Rōmy',
			url: SITE
		},
		publisher: {
			'@type': 'Organization',
			name: 'GetRomy LLC',
			logo: {
				'@type': 'ImageObject',
				url: `${SITE}/icon-logo.png`
			}
		}
	};
}

export function legalSeo(page: { title: string; description: string }, path: string): SeoData {
	return {
		title: `${page.title} — Rōmy`,
		description: page.description,
		path
	};
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): Record<string, unknown> {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: item.name,
			item: `${SITE}${item.path}`
		}))
	};
}
