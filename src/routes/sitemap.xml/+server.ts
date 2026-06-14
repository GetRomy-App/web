import type { RequestHandler } from './$types';
import { getAllPosts } from '$lib/content';

export const prerender = true;

const BASE = 'https://getromy.app';

export const GET: RequestHandler = async () => {
	const posts = await getAllPosts();

	const blogPosts = posts.filter((p) => !p.has_benchmarks);
	const labsPosts = posts.filter((p) => p.has_benchmarks);

	type SitemapUrl = {
		loc: string;
		lastmod: string;
		changefreq: string;
		priority: string;
	};

	const staticPages: SitemapUrl[] = [
		{ loc: `${BASE}/`, priority: '1.0', changefreq: 'weekly', lastmod: '2026-06-14' },
		{ loc: `${BASE}/blog`, priority: '0.9', changefreq: 'daily', lastmod: '2026-06-14' },
		{ loc: `${BASE}/labs`, priority: '0.8', changefreq: 'monthly', lastmod: '2026-04-25' }
	];

	const blogUrls: SitemapUrl[] = blogPosts.map((p) => ({
		loc: `${BASE}/blog/${p.slug}`,
		priority: '0.8',
		changefreq: 'monthly',
		lastmod: p.date || '2026-01-01'
	}));

	const labsUrls: SitemapUrl[] = labsPosts.map((p) => ({
		loc: `${BASE}/labs/blog/${p.slug}`,
		priority: '0.7',
		changefreq: 'monthly',
		lastmod: p.date || '2026-01-01'
	}));

	const allUrls = [...staticPages, ...blogUrls, ...labsUrls];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
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
