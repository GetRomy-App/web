import type { RequestHandler } from './$types';
import { getAllPosts } from '$lib/content';

const SITE_URL = 'https://getromy.app';

export const prerender = true;

export const GET: RequestHandler = async () => {
	const posts = await getAllPosts();

	const blogPosts = posts.filter((p) => !p.has_benchmarks);
	const labsPosts = posts.filter((p) => p.has_benchmarks);

	const staticPages = [
		{ loc: '/', lastmod: '2026-06-19', changefreq: 'weekly', priority: '1.0' },
		{ loc: '/blog', lastmod: blogPosts[0]?.date ?? '2026-06-19', changefreq: 'daily', priority: '0.9' },
		{ loc: '/labs', lastmod: labsPosts[0]?.date ?? '2026-06-19', changefreq: 'weekly', priority: '0.9' }
	];

	const blogUrls = blogPosts.map((p) => ({
		loc: `/blog/${p.slug}`,
		lastmod: p.date,
		changefreq: 'monthly',
		priority: '0.8'
	}));

	const labsUrls = labsPosts.map((p) => ({
		loc: `/labs/blog/${p.slug}`,
		lastmod: p.date,
		changefreq: 'monthly',
		priority: '0.9'
	}));

	const allUrls = [...staticPages, ...labsUrls, ...blogUrls];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
	.map(
		(url) => `  <url>
    <loc>${SITE_URL}${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
};
