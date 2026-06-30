import type { RequestHandler } from './$types';
import { getAllPosts } from '$lib/content';
import { getAllLegalPages } from '$lib/legal';

export const prerender = true;

const SITE = 'https://getromy.app';

const LEGAL_URL_OVERRIDE: Record<string, string> = {
	'prospect-privacy': '/privacy/prospects'
};

interface Entry {
	loc: string;
	lastmod?: string;
	changefreq: string;
	priority: string;
}

// gray-matter parses unquoted YAML dates (e.g. `effective: 2026-05-05`) into
// Date objects rather than strings, so normalize whatever comes back into a
// plain YYYY-MM-DD string before it lands in the sitemap.
function toIsoDate(value: unknown): string | undefined {
	if (!value) return undefined;
	if (value instanceof Date) return value.toISOString().slice(0, 10);
	const str = String(value);
	const parsed = new Date(str);
	return isNaN(parsed.getTime()) ? undefined : parsed.toISOString().slice(0, 10);
}

function toXml(entries: Entry[]): string {
	const body = entries
		.map((e) => {
			const lastmod = e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : '';
			return `  <url>\n    <loc>${e.loc}</loc>${lastmod}\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`;
		})
		.join('\n');
	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

export const GET: RequestHandler = async () => {
	const allPosts = await getAllPosts();
	const blogPosts = allPosts.filter((p) => !p.has_benchmarks);
	const labsPosts = allPosts.filter((p) => p.has_benchmarks);
	const legalPages = await getAllLegalPages();

	const latestBlogDate = toIsoDate(blogPosts[0]?.date);

	const entries: Entry[] = [
		{ loc: `${SITE}/`, lastmod: latestBlogDate, changefreq: 'weekly', priority: '1.0' },
		{ loc: `${SITE}/blog`, lastmod: latestBlogDate, changefreq: 'daily', priority: '0.9' },
		...blogPosts.map((p) => ({
			loc: `${SITE}/blog/${p.slug}`,
			lastmod: toIsoDate(p.date),
			changefreq: 'monthly',
			priority: '0.7'
		})),
		{ loc: `${SITE}/labs`, changefreq: 'weekly', priority: '0.6' },
		...labsPosts.map((p) => ({
			loc: `${SITE}/labs/blog/${p.slug}`,
			lastmod: toIsoDate(p.date),
			changefreq: 'monthly',
			priority: '0.6'
		})),
		{ loc: `${SITE}/status`, changefreq: 'always', priority: '0.6' },
		{ loc: `${SITE}/legal`, changefreq: 'monthly', priority: '0.3' },
		...legalPages.map((p) => ({
			loc: `${SITE}${LEGAL_URL_OVERRIDE[p.slug] ?? `/${p.slug}`}`,
			lastmod: toIsoDate(p.effective),
			changefreq: 'yearly',
			priority: '0.3'
		}))
	];

	return new Response(toXml(entries), {
		headers: { 'Content-Type': 'application/xml' }
	});
};
