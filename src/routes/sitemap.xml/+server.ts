import { getAllPosts } from '$lib/content';

export const prerender = true;

const SITE_URL = 'https://getromy.app';

interface SitemapEntry {
	loc: string;
	lastmod: string;
	changefreq: string;
	priority: string;
}

const STATIC_ENTRIES: SitemapEntry[] = [
	{ loc: '/', lastmod: '2026-07-05', changefreq: 'weekly', priority: '1.0' },
	{ loc: '/blog', lastmod: '2026-07-05', changefreq: 'daily', priority: '0.9' },
	{ loc: '/labs', lastmod: '2026-07-05', changefreq: 'weekly', priority: '0.8' },
	{ loc: '/status', lastmod: '2026-07-05', changefreq: 'always', priority: '0.5' },
	{ loc: '/legal', lastmod: '2026-05-05', changefreq: 'monthly', priority: '0.4' },
	{ loc: '/terms', lastmod: '2026-05-05', changefreq: 'monthly', priority: '0.3' },
	{ loc: '/privacy', lastmod: '2026-05-05', changefreq: 'monthly', priority: '0.3' },
	{ loc: '/privacy/prospects', lastmod: '2026-05-05', changefreq: 'monthly', priority: '0.3' },
	{ loc: '/privacy/request', lastmod: '2026-05-05', changefreq: 'monthly', priority: '0.3' },
	{ loc: '/security', lastmod: '2026-05-05', changefreq: 'monthly', priority: '0.3' },
	{ loc: '/cookies', lastmod: '2026-05-05', changefreq: 'monthly', priority: '0.3' },
	{ loc: '/dpa', lastmod: '2026-05-05', changefreq: 'monthly', priority: '0.3' },
	{ loc: '/aup', lastmod: '2026-05-05', changefreq: 'monthly', priority: '0.3' },
	{ loc: '/subprocessors', lastmod: '2026-05-05', changefreq: 'monthly', priority: '0.3' }
];

export const GET = async () => {
	const posts = await getAllPosts();

	const postEntries: SitemapEntry[] = posts.map((post) => ({
		loc: post.has_benchmarks ? `/labs/blog/${post.slug}` : `/blog/${post.slug}`,
		lastmod: post.date || '2026-07-05',
		changefreq: 'monthly',
		priority: post.has_benchmarks ? '0.7' : '0.6'
	}));

	const entries = [...STATIC_ENTRIES, ...postEntries];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
	.map(
		(entry) => `  <url>
    <loc>${SITE_URL}${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
	)
	.join('\n')}
</urlset>
`;

	return new Response(body, {
		headers: { 'Content-Type': 'application/xml' }
	});
};
