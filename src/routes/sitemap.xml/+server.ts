import type { RequestHandler } from './$types';
import { getAllPosts } from '$lib/content';
import { getAllLegalPages } from '$lib/legal';

export const prerender = true;

const BASE = 'https://getromy.app';

const LEGAL_SLUG_TO_PATH: Record<string, string> = {
	privacy: '/privacy',
	'prospect-privacy': '/privacy/prospects',
	terms: '/terms',
	cookies: '/cookies',
	aup: '/aup',
	dpa: '/dpa',
	security: '/security',
	subprocessors: '/subprocessors'
};

export const GET: RequestHandler = async () => {
	const [allPosts, legalPages] = await Promise.all([getAllPosts(), getAllLegalPages()]);

	const blogPosts = allPosts.filter((p) => !p.has_benchmarks);
	const labsPosts = allPosts.filter((p) => p.has_benchmarks);

	const urls: { loc: string; lastmod: string; changefreq: string; priority: string }[] = [
		{ loc: `${BASE}/`, lastmod: '2026-06-29', changefreq: 'weekly', priority: '1.0' },
		{ loc: `${BASE}/blog`, lastmod: blogPosts[0]?.date || '2026-06-29', changefreq: 'daily', priority: '0.9' },
		{ loc: `${BASE}/labs`, lastmod: labsPosts[0]?.date || '2026-06-29', changefreq: 'weekly', priority: '0.9' },
		{ loc: `${BASE}/legal`, lastmod: '2024-01-15', changefreq: 'monthly', priority: '0.3' },
		{ loc: `${BASE}/status`, lastmod: '2026-06-29', changefreq: 'always', priority: '0.5' },
		...blogPosts.map((p) => ({
			loc: `${BASE}/blog/${p.slug}`,
			lastmod: p.date || '2026-01-01',
			changefreq: 'monthly',
			priority: '0.8'
		})),
		...labsPosts.map((p) => ({
			loc: `${BASE}/labs/blog/${p.slug}`,
			lastmod: p.date || '2026-01-01',
			changefreq: 'monthly',
			priority: '0.8'
		})),
		...legalPages.map((p) => ({
			loc: `${BASE}${LEGAL_SLUG_TO_PATH[p.slug] ?? `/legal/${p.slug}`}`,
			lastmod: p.effective || '2024-01-15',
			changefreq: 'yearly',
			priority: '0.3'
		}))
	];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
	.map(
		(u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600, s-maxage=86400'
		}
	});
};
