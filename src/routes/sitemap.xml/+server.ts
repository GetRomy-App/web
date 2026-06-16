import type { RequestHandler } from './$types';
import { getAllPosts } from '$lib/content';

export const prerender = true;

export const GET: RequestHandler = async () => {
	const posts = await getAllPosts();

	const staticPages = [
		{ url: 'https://getromy.app/', lastmod: '2026-06-16', changefreq: 'weekly', priority: '1.0' },
		{ url: 'https://getromy.app/blog', lastmod: '2026-06-16', changefreq: 'weekly', priority: '0.9' },
		{ url: 'https://getromy.app/labs', lastmod: '2026-06-16', changefreq: 'monthly', priority: '0.8' }
	];

	const blogPosts = posts
		.filter((p) => !p.has_benchmarks)
		.map((p) => ({
			url: `https://getromy.app/blog/${p.slug}`,
			lastmod: p.date,
			changefreq: 'monthly',
			priority: '0.7'
		}));

	const labsPosts = posts
		.filter((p) => p.has_benchmarks)
		.map((p) => ({
			url: `https://getromy.app/labs/blog/${p.slug}`,
			lastmod: p.date,
			changefreq: 'monthly',
			priority: '0.7'
		}));

	const allUrls = [...staticPages, ...blogPosts, ...labsPosts];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allUrls
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
			'Cache-Control': 'max-age=3600, s-maxage=86400'
		}
	});
};
