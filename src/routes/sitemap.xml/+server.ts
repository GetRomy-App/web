import { getAllPosts } from '$lib/content';

export const prerender = true;

const BASE = 'https://getromy.app';
const TODAY = '2026-06-10';

export async function GET() {
	const posts = await getAllPosts();
	const blogPosts = posts.filter((p) => !p.has_benchmarks);
	const labsPosts = posts.filter((p) => p.has_benchmarks);

	const staticPages = [
		{ url: `${BASE}/`, priority: '1.0', changefreq: 'weekly', lastmod: TODAY },
		{ url: `${BASE}/blog`, priority: '0.9', changefreq: 'weekly', lastmod: TODAY },
		{ url: `${BASE}/labs`, priority: '0.9', changefreq: 'weekly', lastmod: TODAY },
		{ url: `${BASE}/privacy`, priority: '0.3', changefreq: 'yearly', lastmod: TODAY },
		{ url: `${BASE}/terms`, priority: '0.3', changefreq: 'yearly', lastmod: TODAY },
		{ url: `${BASE}/security`, priority: '0.4', changefreq: 'yearly', lastmod: TODAY },
		{ url: `${BASE}/aup`, priority: '0.2', changefreq: 'yearly', lastmod: TODAY },
		{ url: `${BASE}/cookies`, priority: '0.2', changefreq: 'yearly', lastmod: TODAY },
		{ url: `${BASE}/dpa`, priority: '0.2', changefreq: 'yearly', lastmod: TODAY },
		{ url: `${BASE}/subprocessors`, priority: '0.2', changefreq: 'yearly', lastmod: TODAY },
		{ url: `${BASE}/legal`, priority: '0.2', changefreq: 'yearly', lastmod: TODAY }
	];

	const blogUrls = blogPosts.map((p) => ({
		url: `${BASE}/blog/${p.slug}`,
		priority: '0.8',
		changefreq: 'monthly',
		lastmod: p.date || TODAY
	}));

	const labsUrls = labsPosts.map((p) => ({
		url: `${BASE}/labs/blog/${p.slug}`,
		priority: '0.9',
		changefreq: 'monthly',
		lastmod: p.date || TODAY
	}));

	const all = [...staticPages, ...blogUrls, ...labsUrls];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${all
	.map(
		(page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
}
