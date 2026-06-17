import { getAllPosts } from '$lib/content';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = async () => {
	const posts = await getAllPosts();
	const today = new Date().toISOString().split('T')[0];

	const staticPages = [
		{ loc: 'https://getromy.app/', priority: '1.0', changefreq: 'weekly', lastmod: today },
		{ loc: 'https://getromy.app/blog', priority: '0.9', changefreq: 'daily', lastmod: today },
		{ loc: 'https://getromy.app/labs', priority: '0.9', changefreq: 'weekly', lastmod: today },
		{ loc: 'https://getromy.app/privacy', priority: '0.4', changefreq: 'monthly', lastmod: '2026-04-24' },
		{ loc: 'https://getromy.app/privacy/prospects', priority: '0.3', changefreq: 'yearly', lastmod: '2026-04-24' },
		{ loc: 'https://getromy.app/terms', priority: '0.4', changefreq: 'monthly', lastmod: '2026-04-24' },
		{ loc: 'https://getromy.app/aup', priority: '0.3', changefreq: 'yearly', lastmod: '2026-04-24' },
		{ loc: 'https://getromy.app/cookies', priority: '0.3', changefreq: 'yearly', lastmod: '2026-04-24' },
		{ loc: 'https://getromy.app/dpa', priority: '0.3', changefreq: 'yearly', lastmod: '2026-04-24' },
		{ loc: 'https://getromy.app/security', priority: '0.3', changefreq: 'monthly', lastmod: '2026-04-24' },
		{ loc: 'https://getromy.app/subprocessors', priority: '0.3', changefreq: 'monthly', lastmod: '2026-04-24' }
	];

	const blogPostPages = posts
		.filter((p) => !p.has_benchmarks)
		.map((p) => ({
			loc: `https://getromy.app/blog/${p.slug}`,
			priority: '0.8',
			changefreq: 'monthly',
			lastmod: p.date || today
		}));

	const labsPostPages = posts
		.filter((p) => p.has_benchmarks)
		.map((p) => ({
			loc: `https://getromy.app/labs/blog/${p.slug}`,
			priority: '0.9',
			changefreq: 'monthly',
			lastmod: p.date || today
		}));

	const allUrls = [...staticPages, ...blogPostPages, ...labsPostPages];

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
			'Cache-Control': 'max-age=3600, stale-while-revalidate=86400'
		}
	});
};
