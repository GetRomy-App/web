export const SITE_URL = 'https://getromy.app';
export const SITE_NAME = 'Rōmy';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;
export const DEFAULT_OG_IMAGE_WIDTH = 1920;
export const DEFAULT_OG_IMAGE_HEIGHT = 1080;

export function absoluteUrl(path: string): string {
	return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

export function organizationSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: 'GetRomy LLC',
		url: SITE_URL,
		logo: `${SITE_URL}/icon-logo.png`,
		description: 'Donor intelligence platform for small nonprofits',
		contactPoint: {
			'@type': 'ContactPoint',
			email: 'solomon@getromy.app',
			contactType: 'sales'
		},
		sameAs: ['https://x.com/RomyFindsMoney', 'https://github.com/GetRomy-App']
	};
}

export function softwareApplicationSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: 'Rōmy',
		url: SITE_URL,
		applicationCategory: 'BusinessApplication',
		operatingSystem: 'macOS, Windows, Linux',
		description:
			'Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions. AI-powered prospect research with wealth indicators, giving history, and affinity signals.',
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD',
			availability: 'https://schema.org/InStock'
		},
		publisher: {
			'@type': 'Organization',
			name: 'GetRomy LLC',
			url: SITE_URL
		},
		featureList: [
			'AI-powered donor prospect research',
			'Wealth indicator screening',
			'Giving history analysis',
			'Affinity signal detection',
			'Actionable donor profiles',
			'No enterprise contracts required'
		]
	};
}

interface ArticleSchemaInput {
	title: string;
	description: string;
	path: string;
	datePublished: string;
	section?: string;
	image?: string;
}

export function articleSchema(input: ArticleSchemaInput) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: input.title,
		description: input.description,
		url: absoluteUrl(input.path),
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': absoluteUrl(input.path)
		},
		datePublished: input.datePublished || undefined,
		dateModified: input.datePublished || undefined,
		articleSection: input.section || undefined,
		image: input.image || DEFAULT_OG_IMAGE,
		author: {
			'@type': 'Organization',
			name: SITE_NAME,
			url: SITE_URL
		},
		publisher: {
			'@type': 'Organization',
			name: 'GetRomy LLC',
			url: SITE_URL,
			logo: {
				'@type': 'ImageObject',
				url: `${SITE_URL}/icon-logo.png`
			}
		}
	};
}

interface BreadcrumbItem {
	name: string;
	path: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: item.name,
			item: absoluteUrl(item.path)
		}))
	};
}
