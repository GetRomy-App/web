import { getAllPosts } from '$lib/content';

const SITE = 'https://getromy.app';

const STATIC_PAGES = [
	{ loc: '/', priority: '1.0', changefreq: 'weekly', lastmod: '2026-06-15' },
	{ loc: '/blog', priority: '0.9', changefreq: 'daily', lastmod: '2026-06-15' },
	{ loc: '/labs', priority: '0.9', changefreq: 'weekly', lastmod: '2026-06-15' },
	{ loc: '/security', priority: '0.4', changefreq: 'monthly' },
	{ loc: '/legal', priority: '0.2', changefreq: 'yearly' },
	{ loc: '/privacy', priority: '0.2', changefreq: 'yearly' },
	{ loc: '/terms', priority: '0.2', changefreq: 'yearly' },
	{ loc: '/cookies', priority: '0.2', changefreq: 'yearly' },
	{ loc: '/aup', priority: '0.2', changefreq: 'yearly' },
	{ loc: '/subprocessors', priority: '0.2', changefreq: 'monthly' },
	{ loc: '/dpa', priority: '0.2', changefreq: 'yearly' }
];

function urlEntry(loc: string, lastmod?: string, changefreq = 'monthly', priority = '0.8') {
	return [
		'  <url>',
		`    <loc>${SITE}${loc}</loc>`,
		lastmod ? `    <lastmod>${lastmod}</lastmod>` : '',
		`    <changefreq>${changefreq}</changefreq>`,
		`    <priority>${priority}</priority>`,
		'  </url>'
	]
		.filter(Boolean)
		.join('\n');
}

export async function GET() {
	const posts = await getAllPosts();
	const blogPosts = posts.filter((p) => !p.has_benchmarks);
	const labsPosts = posts.filter((p) => p.has_benchmarks);

	const entries = [
		...STATIC_PAGES.map((p) => urlEntry(p.loc, p.lastmod, p.changefreq, p.priority)),
		...blogPosts.map((p) => urlEntry(`/blog/${p.slug}`, p.date || undefined)),
		...labsPosts.map((p) => urlEntry(`/labs/blog/${p.slug}`, p.date || undefined))
	];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600, s-maxage=86400'
		}
	});
}
