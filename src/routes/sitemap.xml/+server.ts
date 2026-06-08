import type { RequestHandler } from '@sveltejs/kit';
import { getAllPosts } from '$lib/content';

export const prerender = true;

const BASE_URL = 'https://getromy.app';

const staticPages = [
	{ path: '/', priority: '1.0', changefreq: 'weekly', lastmod: '2026-06-08' },
	{ path: '/blog', priority: '0.9', changefreq: 'daily', lastmod: '2026-06-08' },
	{ path: '/labs', priority: '0.8', changefreq: 'weekly', lastmod: '2026-06-08' },
	{ path: '/terms', priority: '0.3', changefreq: 'yearly', lastmod: '2026-06-08' },
	{ path: '/privacy', priority: '0.3', changefreq: 'yearly', lastmod: '2026-06-08' },
	{ path: '/cookies', priority: '0.3', changefreq: 'yearly', lastmod: '2026-06-08' },
	{ path: '/security', priority: '0.3', changefreq: 'yearly', lastmod: '2026-06-08' },
	{ path: '/aup', priority: '0.3', changefreq: 'yearly', lastmod: '2026-06-08' },
	{ path: '/dpa', priority: '0.3', changefreq: 'yearly', lastmod: '2026-06-08' },
	{ path: '/subprocessors', priority: '0.3', changefreq: 'monthly', lastmod: '2026-06-08' }
];

export const GET: RequestHandler = async () => {
	const posts = await getAllPosts();
	const blogPosts = posts.filter((p) => !p.has_benchmarks);
	const labsPosts = posts.filter((p) => p.has_benchmarks);

	const urlEntries = [
		...staticPages.map(
			(p) => `
  <url>
    <loc>${BASE_URL}${p.path}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
		),
		...blogPosts.map(
			(p) => `
  <url>
    <loc>${BASE_URL}/blog/${p.slug}</loc>
    <lastmod>${p.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
		),
		...labsPosts.map(
			(p) => `
  <url>
    <loc>${BASE_URL}/labs/blog/${p.slug}</loc>
    <lastmod>${p.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
		)
	];

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join('')}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
};
