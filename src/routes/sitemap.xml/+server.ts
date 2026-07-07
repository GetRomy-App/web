import type { RequestHandler } from './$types';
import { getAllPosts } from '$lib/content';

export const prerender = true;

const SITE_URL = 'https://getromy.app';

const STATIC_ROUTES: Array<{
	path: string;
	changefreq: string;
	priority: string;
	lastmod: string;
}> = [
	{ path: '/', changefreq: 'weekly', priority: '1.0', lastmod: '2026-07-07' },
	{ path: '/blog', changefreq: 'daily', priority: '0.9', lastmod: '2026-07-07' },
	{ path: '/labs', changefreq: 'weekly', priority: '0.7', lastmod: '2026-07-07' },
	{ path: '/status', changefreq: 'always', priority: '0.6', lastmod: '2026-06-22' },
	{ path: '/legal', changefreq: 'monthly', priority: '0.3', lastmod: '2026-05-05' },
	{ path: '/privacy', changefreq: 'monthly', priority: '0.3', lastmod: '2026-05-05' },
	{ path: '/terms', changefreq: 'monthly', priority: '0.3', lastmod: '2026-05-05' },
	{ path: '/security', changefreq: 'monthly', priority: '0.3', lastmod: '2026-05-05' },
	{ path: '/cookies', changefreq: 'monthly', priority: '0.2', lastmod: '2026-05-05' },
	{ path: '/subprocessors', changefreq: 'monthly', priority: '0.2', lastmod: '2026-05-05' },
	{ path: '/dpa', changefreq: 'monthly', priority: '0.2', lastmod: '2026-05-05' },
	{ path: '/aup', changefreq: 'monthly', priority: '0.2', lastmod: '2026-05-05' }
];

function escapeXml(value: string): string {
	return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function urlEntry(loc: string, lastmod: string, changefreq: string, priority: string): string {
	return `\t<url>\n\t\t<loc>${escapeXml(loc)}</loc>\n\t\t<lastmod>${lastmod}</lastmod>\n\t\t<changefreq>${changefreq}</changefreq>\n\t\t<priority>${priority}</priority>\n\t</url>`;
}

export const GET: RequestHandler = async () => {
	const posts = await getAllPosts();

	const entries: string[] = STATIC_ROUTES.map((route) =>
		urlEntry(`${SITE_URL}${route.path}`, route.lastmod, route.changefreq, route.priority)
	);

	for (const post of posts) {
		const base = post.has_benchmarks ? '/labs/blog' : '/blog';
		const lastmod = post.date || '2026-01-01';
		entries.push(urlEntry(`${SITE_URL}${base}/${post.slug}`, lastmod, 'monthly', '0.7'));
	}

	const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};
