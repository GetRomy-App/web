/**
 * Per-route SEO metadata, returned from a route's `load` function as `seo` and
 * consumed by the root layout to render a single, correct `<title>` and meta
 * tag set per page.
 *
 * Why this indirection: Svelte's SSR renderer resolves `<title>` as a global
 * singleton (it compares each declaration's position in the render tree and
 * keeps exactly one), and a `<title>` declared directly in a +page.svelte does
 * not reliably win against the root +layout.svelte's own `<title>`. Routing
 * title/description through `page.data.seo` means there is only ever one
 * `<title>` declaration in the whole app (in +layout.svelte), so there's
 * nothing to lose the fight against.
 */
export interface SeoData {
	title: string;
	description: string;
	keywords?: string;
	path?: string;
	type?: 'website' | 'article';
	image?: string;
	article?: {
		publishedTime?: string;
		modifiedTime?: string;
		section?: string;
	};
}

export const SITE_URL = 'https://getromy.app';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const DEFAULT_SEO: SeoData = {
	title: 'Rōmy — Donor Intelligence for Small Nonprofits',
	description:
		'Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions. AI-powered prospect research, wealth indicators, and giving history — at a price built for small teams.',
	keywords:
		'nonprofit donor intelligence, fundraising software, prospect research tool, donor discovery platform, wealth screening, giving history, AI donor research, nonprofit fundraising, major donor prospecting, small nonprofit tools, donor management, philanthropy intelligence, fundraising CRM, nonprofit technology, donor wealth indicators',
	path: '/',
	type: 'website'
};
