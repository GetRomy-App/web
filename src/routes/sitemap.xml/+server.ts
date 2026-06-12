import type { RequestHandler } from '@sveltejs/kit';
import { getAllPosts } from '$lib/content';

export const prerender = true;

export const GET: RequestHandler = async () => {
	const posts = await getAllPosts();

	const siteUrl = 'https://getromy.app';
	const today = '2026-06-12';

	const staticUrls = [
		{ loc: '/', priority: '1.0', changefreq: 'weekly', lastmod: today },
		{ loc: '/blog', priority: '0.9', changefreq: 'daily', lastmod: today },
		{ loc: '/labs', priority: '0.7', changefreq: 'monthly', lastmod: '2026-04-25' },
		{ loc: '/legal', priority: '0.3', changefreq: 'yearly', lastmod: '2026-01-01' },
		{ loc: '/privacy', priority: '0.3', changefreq: 'yearly', lastmod: '2026-01-01' },
		{ loc: '/terms', priority: '0.3', changefreq: 'yearly', lastmod: '2026-01-01' },
		{ loc: '/security', priority: '0.4', changefreq: 'yearly', lastmod: '2026-01-01' },
		{ loc: '/aup', priority: '0.2', changefreq: 'yearly', lastmod: '2026-01-01' },
		{ loc: '/cookies', priority: '0.2', changefreq: 'yearly', lastmod: '2026-01-01' },
		{ loc: '/dpa', priority: '0.2', changefreq: 'yearly', lastmod: '2026-01-01' },
		{ loc: '/subprocessors', priority: '0.2', changefreq: 'yearly', lastmod: '2026-01-01' }
	];

	const regularPosts = posts.filter((p) => !p.has_benchmarks);
	const benchmarkPosts = posts.filter((p) => p.has_benchmarks);

	const postUrls = regularPosts.map((post) => ({
		loc: `/blog/${post.slug}`,
		priority: '0.8',
		changefreq: 'monthly',
		lastmod: post.date
	}));

	const benchmarkUrls = benchmarkPosts.map((post) => ({
		loc: `/labs/blog/${post.slug}`,
		priority: '0.7',
		changefreq: 'monthly',
		lastmod: post.date
	}));

	const allUrls = [...staticUrls, ...postUrls, ...benchmarkUrls];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allUrls
	.map((u) => {
		const lines = [
			`  <url>`,
			`    <loc>${siteUrl}${u.loc}</loc>`,
			u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>` : '',
			`    <changefreq>${u.changefreq}</changefreq>`,
			`    <priority>${u.priority}</priority>`,
			`  </url>`
		];
		return lines.filter(Boolean).join('\n');
	})
	.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
};
