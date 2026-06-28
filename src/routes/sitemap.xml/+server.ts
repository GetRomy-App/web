import type { RequestHandler } from './$types';
import { getAllPosts } from '$lib/content';

export const prerender = true;

const SITE = 'https://getromy.app';

const STATIC_PAGES = [
	{ path: '/', priority: '1.0', changefreq: 'weekly', lastmod: '2026-06-28' },
	{ path: '/blog', priority: '0.9', changefreq: 'daily', lastmod: '2026-06-28' },
	{ path: '/labs', priority: '0.8', changefreq: 'weekly', lastmod: '2026-06-28' },
	{ path: '/privacy', priority: '0.3', changefreq: 'monthly', lastmod: '2026-04-01' },
	{ path: '/terms', priority: '0.3', changefreq: 'monthly', lastmod: '2026-04-01' },
	{ path: '/security', priority: '0.3', changefreq: 'monthly', lastmod: '2026-04-01' },
	{ path: '/cookies', priority: '0.3', changefreq: 'monthly', lastmod: '2026-04-01' },
	{ path: '/status', priority: '0.5', changefreq: 'always', lastmod: '2026-06-28' }
];

export const GET: RequestHandler = async () => {
	const posts = await getAllPosts();

	const blogUrls = posts
		.filter((p) => !p.has_benchmarks)
		.map((p) => {
			const lastmod = p.date ? p.date.slice(0, 10) : '2026-01-01';
			return `
  <url>
    <loc>${SITE}/blog/${p.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
		})
		.join('');

	const labsUrls = posts
		.filter((p) => p.has_benchmarks)
		.map((p) => {
			const lastmod = p.date ? p.date.slice(0, 10) : '2026-01-01';
			return `
  <url>
    <loc>${SITE}/labs/blog/${p.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
		})
		.join('');

	const staticUrls = STATIC_PAGES.map(
		(p) => `
  <url>
    <loc>${SITE}${p.path}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
	).join('');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticUrls}${blogUrls}${labsUrls}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
};
