import type { RequestHandler } from './$types';
import { getAllPosts } from '$lib/content';

const SITE = 'https://getromy.app';

const STATIC_PAGES = [
	{ url: '/', priority: '1.0', changefreq: 'weekly' },
	{ url: '/blog', priority: '0.9', changefreq: 'daily' },
	{ url: '/labs', priority: '0.8', changefreq: 'weekly' },
	{ url: '/privacy', priority: '0.3', changefreq: 'yearly' },
	{ url: '/privacy/prospects', priority: '0.3', changefreq: 'yearly' },
	{ url: '/terms', priority: '0.3', changefreq: 'yearly' },
	{ url: '/legal', priority: '0.3', changefreq: 'yearly' },
	{ url: '/cookies', priority: '0.3', changefreq: 'yearly' },
	{ url: '/dpa', priority: '0.3', changefreq: 'yearly' },
	{ url: '/security', priority: '0.3', changefreq: 'yearly' },
	{ url: '/subprocessors', priority: '0.3', changefreq: 'monthly' },
	{ url: '/aup', priority: '0.3', changefreq: 'yearly' }
];

export const prerender = true;

export const GET: RequestHandler = async () => {
	const allPosts = await getAllPosts();
	const blogPosts = allPosts.filter((p) => !p.has_benchmarks);
	const labsPosts = allPosts.filter((p) => p.has_benchmarks);

	const urls: string[] = [];

	for (const page of STATIC_PAGES) {
		urls.push(`
  <url>
    <loc>${SITE}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`);
	}

	for (const post of blogPosts) {
		urls.push(`
  <url>
    <loc>${SITE}/blog/${post.slug}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`);
	}

	for (const post of labsPosts) {
		urls.push(`
  <url>
    <loc>${SITE}/labs/blog/${post.slug}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
	}

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urls.join('')}
</urlset>`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
