import type { RequestHandler } from '@sveltejs/kit';
import { getAllPosts } from '$lib/content';

const SITE = 'https://getromy.app';
const TODAY = '2026-06-27';

const STATIC_PAGES = [
	{ loc: '/', lastmod: TODAY, changefreq: 'weekly', priority: '1.0' },
	{ loc: '/blog', lastmod: TODAY, changefreq: 'daily', priority: '0.9' },
	{ loc: '/labs', lastmod: TODAY, changefreq: 'weekly', priority: '0.9' },
	{ loc: '/privacy', lastmod: '2026-01-01', changefreq: 'monthly', priority: '0.4' },
	{ loc: '/terms', lastmod: '2026-01-01', changefreq: 'monthly', priority: '0.4' },
	{ loc: '/legal', lastmod: '2026-01-01', changefreq: 'monthly', priority: '0.4' },
	{ loc: '/security', lastmod: '2026-01-01', changefreq: 'monthly', priority: '0.4' },
	{ loc: '/dpa', lastmod: '2026-01-01', changefreq: 'monthly', priority: '0.4' },
	{ loc: '/cookies', lastmod: '2026-01-01', changefreq: 'monthly', priority: '0.4' },
	{ loc: '/aup', lastmod: '2026-01-01', changefreq: 'monthly', priority: '0.4' },
	{ loc: '/subprocessors', lastmod: '2026-01-01', changefreq: 'monthly', priority: '0.4' },
	{ loc: '/status', lastmod: TODAY, changefreq: 'always', priority: '0.3' }
];

export const GET: RequestHandler = async () => {
	const allPosts = await getAllPosts();

	const blogPosts = allPosts.filter((p) => !p.has_benchmarks);
	const labsPosts = allPosts.filter((p) => p.has_benchmarks);

	const urls = [
		...STATIC_PAGES.map(
			(p) => `
  <url>
    <loc>${SITE}${p.loc}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
		),
		...blogPosts.map(
			(p) => `
  <url>
    <loc>${SITE}/blog/${p.slug}</loc>
    <lastmod>${p.date || TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
		),
		...labsPosts.map(
			(p) => `
  <url>
    <loc>${SITE}/labs/blog/${p.slug}</loc>
    <lastmod>${p.date || TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
		)
	];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join('')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
