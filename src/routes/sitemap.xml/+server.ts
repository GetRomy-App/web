import { getAllPosts } from '$lib/content';

const SITE = 'https://getromy.app';

const STATIC_PAGES = [
	{ loc: '/', lastmod: '2026-06-25', changefreq: 'weekly', priority: '1.0' },
	{ loc: '/blog', lastmod: '2026-06-25', changefreq: 'daily', priority: '0.9' },
	{ loc: '/labs', lastmod: '2026-06-25', changefreq: 'weekly', priority: '0.8' },
	{ loc: '/privacy', lastmod: '2026-04-01', changefreq: 'monthly', priority: '0.3' },
	{ loc: '/terms', lastmod: '2026-04-01', changefreq: 'monthly', priority: '0.3' },
	{ loc: '/security', lastmod: '2026-04-01', changefreq: 'monthly', priority: '0.3' },
	{ loc: '/status', lastmod: '2026-06-25', changefreq: 'always', priority: '0.4' }
];

export async function GET() {
	const posts = await getAllPosts();

	const blogUrls = posts
		.filter((p) => !p.has_benchmarks)
		.map(
			(p) =>
				`  <url>\n    <loc>${SITE}/blog/${p.slug}</loc>\n    <lastmod>${p.date}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`
		);

	const labsUrls = posts
		.filter((p) => p.has_benchmarks)
		.map(
			(p) =>
				`  <url>\n    <loc>${SITE}/labs/blog/${p.slug}</loc>\n    <lastmod>${p.date}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`
		);

	const staticUrls = STATIC_PAGES.map(
		(p) =>
			`  <url>\n    <loc>${SITE}${p.loc}</loc>\n    <lastmod>${p.lastmod}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`
	);

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls.join('\n')}
${blogUrls.join('\n')}
${labsUrls.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
}
