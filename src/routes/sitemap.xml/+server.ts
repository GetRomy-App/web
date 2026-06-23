import type { RequestHandler } from './$types';
import { getAllPosts } from '$lib/content';

export const GET: RequestHandler = async () => {
	const posts = await getAllPosts();

	const base = 'https://getromy.app';
	const today = '2026-06-23';

	const staticUrls = [
		{ loc: '/', lastmod: today, changefreq: 'weekly', priority: '1.0' },
		{ loc: '/blog', lastmod: today, changefreq: 'weekly', priority: '0.9' },
		{ loc: '/labs', lastmod: today, changefreq: 'weekly', priority: '0.8' },
		{ loc: '/legal', lastmod: '2026-04-01', changefreq: 'monthly', priority: '0.3' },
		{ loc: '/privacy', lastmod: '2026-04-01', changefreq: 'monthly', priority: '0.3' },
		{ loc: '/privacy/prospects', lastmod: '2026-04-01', changefreq: 'monthly', priority: '0.2' },
		{ loc: '/terms', lastmod: '2026-04-01', changefreq: 'monthly', priority: '0.3' },
		{ loc: '/aup', lastmod: '2026-04-01', changefreq: 'monthly', priority: '0.2' },
		{ loc: '/cookies', lastmod: '2026-04-01', changefreq: 'monthly', priority: '0.2' },
		{ loc: '/security', lastmod: '2026-04-01', changefreq: 'monthly', priority: '0.3' },
		{ loc: '/subprocessors', lastmod: '2026-04-01', changefreq: 'monthly', priority: '0.2' },
		{ loc: '/dpa', lastmod: '2026-04-01', changefreq: 'monthly', priority: '0.2' },
		{ loc: '/status', lastmod: today, changefreq: 'always', priority: '0.5' },
	];

	const blogUrls = posts
		.filter((p) => !p.has_benchmarks)
		.map((p) => ({
			loc: `/blog/${p.slug}`,
			lastmod: p.date || today,
			changefreq: 'monthly',
			priority: '0.7'
		}));

	const labsUrls = posts
		.filter((p) => p.has_benchmarks)
		.map((p) => ({
			loc: `/labs/blog/${p.slug}`,
			lastmod: p.date || today,
			changefreq: 'monthly',
			priority: '0.7'
		}));

	const all = [...staticUrls, ...blogUrls, ...labsUrls];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${all
	.map(
		(u) => `  <url>
    <loc>${base}${u.loc}</loc>
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
			'Cache-Control': 'max-age=3600, s-maxage=3600'
		}
	});
};
