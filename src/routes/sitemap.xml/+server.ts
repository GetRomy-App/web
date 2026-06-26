import { getAllPosts } from '$lib/content';
import type { RequestHandler } from './$types';

export const prerender = true;

const BASE = 'https://getromy.app';

const STATIC_URLS = [
	{ loc: `${BASE}/`, lastmod: '2026-06-26', changefreq: 'weekly', priority: '1.0' },
	{ loc: `${BASE}/blog`, lastmod: '2026-06-26', changefreq: 'daily', priority: '0.9' },
	{ loc: `${BASE}/labs`, lastmod: '2026-06-26', changefreq: 'weekly', priority: '0.8' },
	{ loc: `${BASE}/status`, lastmod: '2026-06-26', changefreq: 'always', priority: '0.6' },
	{ loc: `${BASE}/privacy`, lastmod: '2026-05-05', changefreq: 'monthly', priority: '0.4' },
	{ loc: `${BASE}/privacy/prospects`, lastmod: '2026-05-05', changefreq: 'monthly', priority: '0.3' },
	{ loc: `${BASE}/terms`, lastmod: '2026-05-05', changefreq: 'monthly', priority: '0.4' },
	{ loc: `${BASE}/security`, lastmod: '2026-05-05', changefreq: 'monthly', priority: '0.4' },
	{ loc: `${BASE}/dpa`, lastmod: '2026-05-05', changefreq: 'monthly', priority: '0.3' },
	{ loc: `${BASE}/aup`, lastmod: '2026-05-05', changefreq: 'monthly', priority: '0.3' },
	{ loc: `${BASE}/cookies`, lastmod: '2026-05-05', changefreq: 'monthly', priority: '0.3' },
	{ loc: `${BASE}/subprocessors`, lastmod: '2026-05-05', changefreq: 'monthly', priority: '0.3' }
];

export const GET: RequestHandler = async () => {
	const posts = await getAllPosts();

	const postUrls = posts.map((post) => ({
		loc: `${BASE}/blog/${post.slug}`,
		lastmod: post.date || '2026-01-01',
		changefreq: 'monthly',
		priority: '0.7'
	}));

	const urls = [...STATIC_URLS, ...postUrls];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
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
			'Cache-Control': 'public, max-age=3600, s-maxage=3600'
		}
	});
};
