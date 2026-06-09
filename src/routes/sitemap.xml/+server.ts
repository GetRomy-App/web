import { getAllPosts } from '$lib/content';

const BASE = 'https://getromy.app';

const STATIC_PAGES = [
	{ loc: '/', priority: '1.0', changefreq: 'weekly' },
	{ loc: '/blog', priority: '0.9', changefreq: 'daily' },
	{ loc: '/labs', priority: '0.8', changefreq: 'weekly' },
	{ loc: '/legal', priority: '0.3', changefreq: 'monthly' },
	{ loc: '/privacy', priority: '0.3', changefreq: 'monthly' },
	{ loc: '/terms', priority: '0.3', changefreq: 'monthly' },
	{ loc: '/security', priority: '0.4', changefreq: 'monthly' }
];

export async function GET() {
	const posts = await getAllPosts();
	const now = new Date().toISOString().split('T')[0];

	const postEntries = posts.map((post) => {
		const base = post.has_benchmarks ? '/labs/blog' : '/blog';
		const lastmod = post.date ? post.date.split('T')[0] : now;
		return `  <url>
    <loc>${BASE}${base}/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${post.has_benchmarks ? '0.8' : '0.7'}</priority>
  </url>`;
	});

	const staticEntries = STATIC_PAGES.map(({ loc, priority, changefreq }) => {
		return `  <url>
    <loc>${BASE}${loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
	});

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries.join('\n')}
${postEntries.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600'
		}
	});
}
