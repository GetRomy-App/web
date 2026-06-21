import type { RequestHandler } from './$types';
import { getAllPosts } from '$lib/content';

export const prerender = true;

const BASE = 'https://getromy.app';

const STATIC_PAGES = [
	{ loc: `${BASE}/`, changefreq: 'weekly', priority: '1.0' },
	{ loc: `${BASE}/blog`, changefreq: 'weekly', priority: '0.9' },
	{ loc: `${BASE}/labs`, changefreq: 'weekly', priority: '0.9' },
	{ loc: `${BASE}/privacy`, changefreq: 'yearly', priority: '0.3' },
	{ loc: `${BASE}/terms`, changefreq: 'yearly', priority: '0.3' },
	{ loc: `${BASE}/aup`, changefreq: 'yearly', priority: '0.2' },
	{ loc: `${BASE}/cookies`, changefreq: 'yearly', priority: '0.2' },
	{ loc: `${BASE}/dpa`, changefreq: 'yearly', priority: '0.2' },
	{ loc: `${BASE}/subprocessors`, changefreq: 'monthly', priority: '0.2' },
	{ loc: `${BASE}/security`, changefreq: 'yearly', priority: '0.3' }
];

export const GET: RequestHandler = async () => {
	const posts = await getAllPosts();

	const today = new Date().toISOString().split('T')[0];

	const blogUrls = posts
		.filter((p) => !p.has_benchmarks)
		.map((p) => ({
			loc: `${BASE}/blog/${p.slug}`,
			lastmod: p.date || today,
			changefreq: 'monthly',
			priority: '0.8'
		}));

	const labsUrls = posts
		.filter((p) => p.has_benchmarks)
		.map((p) => ({
			loc: `${BASE}/labs/blog/${p.slug}`,
			lastmod: p.date || today,
			changefreq: 'monthly',
			priority: '0.8'
		}));

	const staticUrls = STATIC_PAGES.map((p) => ({ ...p, lastmod: today }));

	const allUrls = [...staticUrls, ...blogUrls, ...labsUrls];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allUrls
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
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
