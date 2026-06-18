import { getAllPosts } from '$lib/content';

const BASE_URL = 'https://getromy.app';

function esc(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

export async function GET() {
	const posts = await getAllPosts();

	const blogPosts = posts.filter((p) => !p.has_benchmarks);
	const labsPosts = posts.filter((p) => p.has_benchmarks);

	const today = new Date().toISOString().split('T')[0];

	const staticPages = [
		{ loc: `${BASE_URL}/`, lastmod: today, changefreq: 'weekly', priority: '1.0' },
		{ loc: `${BASE_URL}/blog`, lastmod: today, changefreq: 'weekly', priority: '0.9' },
		{ loc: `${BASE_URL}/labs`, lastmod: today, changefreq: 'monthly', priority: '0.8' }
	];

	const blogUrls = blogPosts.map((p) => ({
		loc: `${BASE_URL}/blog/${esc(p.slug)}`,
		lastmod: p.date || today,
		changefreq: 'monthly',
		priority: '0.7'
	}));

	const labsUrls = labsPosts.map((p) => ({
		loc: `${BASE_URL}/labs/blog/${esc(p.slug)}`,
		lastmod: p.date || today,
		changefreq: 'monthly',
		priority: '0.7'
	}));

	const allUrls = [...staticPages, ...blogUrls, ...labsUrls];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
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
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
}
