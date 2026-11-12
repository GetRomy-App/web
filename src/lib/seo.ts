/** Site-wide SEO constants and structured-data helpers. One place, so every page agrees. */

export const SITE_URL = 'https://getromy.app';
export const SITE_NAME = 'Rōmy';
export const LEGAL_NAME = 'GetRomy LLC';
export const APP_URL = 'https://intel.getromy.app';
export const TWITTER_HANDLE = '@RomyFindsMoney';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
export const DEFAULT_OG_IMAGE_ALT =
	'Rōmy — AI prospect research and donor intelligence for small nonprofits';
export const LOGO_URL = `${SITE_URL}/web-app-manifest-512x512.png`;

export const SITE_TAGLINE = 'AI prospect research and donor intelligence for small nonprofits';
export const SITE_DESCRIPTION =
	'Rōmy is AI prospect research for small nonprofits: wealth indicators, giving history and affinity signals in one donor profile — without enterprise wealth-screening contracts.';

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const APP_ID = `${SITE_URL}/#software`;

/** Absolute URL for a site path ("/" stays the bare origin with a trailing slash). */
export function absoluteUrl(path: string): string {
	if (/^https?:\/\//.test(path)) return path;
	if (path === '/' || path === '') return `${SITE_URL}/`;
	return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Serialise JSON-LD so it is safe inside a <script> element. */
export function serializeJsonLd(data: unknown): string {
	return JSON.stringify(data).replace(/</g, '\\u003c');
}

/** YYYY-MM-DD (or any parseable date) → ISO 8601, or undefined when unparseable. */
export function isoDate(value: string | undefined): string | undefined {
	if (!value) return undefined;
	const d = new Date(value);
	return isNaN(d.getTime()) ? undefined : d.toISOString();
}

/** Trim a description to a snippet-sized length on a word boundary. */
export function clip(text: string, max = 160): string {
	const clean = text.replace(/\s+/g, ' ').trim();
	if (clean.length <= max) return clean;
	const cut = clean.slice(0, max - 1);
	const at = cut.lastIndexOf(' ');
	return `${cut.slice(0, at > 80 ? at : cut.length).replace(/[\s,;:—–-]+$/, '')}…`;
}

export const organizationSchema = {
	'@type': 'Organization',
	'@id': ORG_ID,
	name: SITE_NAME,
	legalName: LEGAL_NAME,
	alternateName: ['Romy', 'GetRomy', 'Rōmy donor intelligence'],
	url: `${SITE_URL}/`,
	logo: { '@type': 'ImageObject', url: LOGO_URL, width: 512, height: 512 },
	description:
		'Rōmy builds AI prospect research and donor intelligence software for small nonprofit fundraising teams.',
	knowsAbout: [
		'Prospect research',
		'Donor intelligence',
		'Wealth screening',
		'Major gift fundraising',
		'Nonprofit fundraising',
		'Donor stewardship',
		'Planned giving',
		'AI for nonprofits'
	],
	contactPoint: {
		'@type': 'ContactPoint',
		email: 'solomon@getromy.app',
		contactType: 'sales'
	},
	sameAs: ['https://x.com/RomyFindsMoney', 'https://github.com/GetRomy-App']
};

export const websiteSchema = {
	'@type': 'WebSite',
	'@id': WEBSITE_ID,
	url: `${SITE_URL}/`,
	name: SITE_NAME,
	alternateName: 'Romy',
	description: SITE_DESCRIPTION,
	inLanguage: 'en-US',
	publisher: { '@id': ORG_ID }
};

export interface Crumb {
	name: string;
	path: string;
}

export function breadcrumbSchema(crumbs: Crumb[]) {
	return {
		'@type': 'BreadcrumbList',
		itemListElement: crumbs.map((c, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: c.name,
			item: absoluteUrl(c.path)
		}))
	};
}

/** Wrap one or more nodes in a single @graph document. */
export function graph(...nodes: object[]) {
	return { '@context': 'https://schema.org', '@graph': nodes };
}
