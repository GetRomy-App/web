import type { RequestHandler } from './$types';
import { getAllPosts } from '$lib/content';
import { getAllLegalPages } from '$lib/legal';

export const prerender = true;

const SITE_URL = 'https://getromy.app';

// content/legal file slugs that don't map 1:1 onto their route path.
const LEGAL_SLUG_PATH: Record<string, string> = {
	'prospect-privacy': '/privacy/prospects'
};

interface SitemapUrl {
	loc: string;
	lastmod?: string;
	changefreq: string;
	priority: string;
}

export const GET: RequestHandler = async () => {
	const posts = await getAllPosts();
	const legalPages = await getAllLegalPages();

	const staticUrls: SitemapUrl[] = [
		{ loc: '/', changefreq: 'weekly', priority: '1.0' },
		{ loc: '/blog', changefreq: 'daily', priority: '0.8' },
		{ loc: '/labs', changefreq: 'weekly', priority: '0.7' },
		{ loc: '/legal', changefreq: 'monthly', priority: '0.4' },
		{ loc: '/status', changefreq: 'always', priority: '0.6' },
		{ loc: '/privacy/request', changefreq: 'yearly', priority: '0.3' }
	];

	const blogUrls: SitemapUrl[] = posts
		.filter((p) => !p.has_benchmarks)
		.map((p) => ({
			loc: `/blog/${p.slug}`,
			lastmod: p.date,
			changefreq: 'monthly',
			priority: '0.7'
		}));

	const labsBlogUrls: SitemapUrl[] = posts
		.filter((p) => p.has_benchmarks)
		.map((p) => ({
			loc: `/labs/blog/${p.slug}`,
			lastmod: p.date,
			changefreq: 'monthly',
			priority: '0.6'
		}));

	const legalUrls: SitemapUrl[] = legalPages.map((p) => ({
		loc: LEGAL_SLUG_PATH[p.slug] ?? `/${p.slug}`,
		lastmod: p.effective,
		changefreq: 'yearly',
		priority: '0.3'
	}));

	const all = [...staticUrls, ...blogUrls, ...labsBlogUrls, ...legalUrls];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all
	.map(
		(u) => `  <url>
    <loc>${SITE_URL}${u.loc}</loc>
${u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>\n` : ''}    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
	)
	.join('\n')}
</urlset>
`;

	return new Response(body, {
		headers: { 'Content-Type': 'application/xml' }
	});
};
