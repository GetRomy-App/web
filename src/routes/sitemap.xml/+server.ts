export const prerender = true;

import { getAllPosts } from '$lib/content';

const BASE = 'https://getromy.app';

const STATIC_PAGES = [
	{ path: '/', priority: '1.0', changefreq: 'weekly', lastmod: '2026-06-20' },
	{ path: '/blog', priority: '0.9', changefreq: 'daily', lastmod: '2026-06-20' },
	{ path: '/labs', priority: '0.9', changefreq: 'weekly', lastmod: '2026-06-20' },
	{ path: '/privacy', priority: '0.3', changefreq: 'monthly', lastmod: '2026-04-24' },
	{ path: '/terms', priority: '0.3', changefreq: 'monthly', lastmod: '2026-04-24' },
	{ path: '/security', priority: '0.3', changefreq: 'monthly', lastmod: '2026-04-24' }
];

export async function GET() {
	const posts = await getAllPosts();

	const postUrls = posts.map((post) => {
		const path = post.has_benchmarks
			? `/labs/blog/${post.slug}`
			: `/blog/${post.slug}`;
		return `
  <url>
    <loc>${BASE}${path}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${post.has_benchmarks ? '0.85' : '0.75'}</priority>
  </url>`;
	});

	const staticUrls = STATIC_PAGES.map(
		(p) => `
  <url>
    <loc>${BASE}${p.path}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
	);

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${staticUrls.join('')}${postUrls.join('')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
}
