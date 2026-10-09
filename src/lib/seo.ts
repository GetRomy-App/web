export const SITE = 'https://getromy.app';
export const SITE_NAME = 'Rōmy';
export const DEFAULT_IMAGE = `${SITE}/og-image.jpg`;
export const TWITTER_HANDLE = '@RomyFindsMoney';

/** Keywords shared by every page; per-page keywords are prepended. */
export const BASE_KEYWORDS = [
	'donor research software',
	'AI prospect research',
	'nonprofit donor intelligence',
	'wealth screening for nonprofits',
	'major donor prospecting',
	'affordable DonorSearch alternative',
	'iWave alternative',
	'WealthEngine alternative',
	'small nonprofit fundraising',
	'Rōmy'
];

export function organizationId() {
	return `${SITE}/#organization`;
}

export function websiteId() {
	return `${SITE}/#website`;
}

export function breadcrumbs(items: { name: string; path: string }[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: item.name,
			item: SITE + item.path
		}))
	};
}
