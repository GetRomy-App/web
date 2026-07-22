import type { RequestHandler } from './$types';
import { getAllPosts } from '$lib/content';

export const prerender = true;

const SITE_URL = 'https://getromy.app';

// Static routes not sourced from content/posts, with their SEO priority/changefreq.
const STATIC_ROUTES: { path: string; changefreq: string; priority: string }[] = [
	{ path: '/', changefreq: 'weekly', priority: '1.0' },
	{ path: '/blog', changefreq: 'daily', priority: '0.8' },
	{ path: '/labs', changefreq: 'weekly', priority: '0.7' },
	{ path: '/status', changefreq: 'always', priority: '0.6' },
	{ path: '/legal', changefreq: 'monthly', priority: '0.4' },
	{ path: '/privacy', changefreq: 'monthly', priority: '0.4' },
	{ path: '/privacy/prospects', changefreq: 'monthly', priority: '0.3' },
	{ path: '/privacy/request', changefreq: 'yearly', priority: '0.3' },
	{ path: '/terms', changefreq: 'monthly', priority: '0.4' },
	{ path: '/cookies', changefreq: 'monthly', priority: '0.3' },
	{ path: '/security', changefreq: 'monthly', priority: '0.4' },
	{ path: '/aup', changefreq: 'monthly', priority: '0.3' },
	{ path: '/subprocessors', changefreq: 'monthly', priority: '0.3' }
];

function toLastmod(dateStr: string): string {
	const d = new Date(dateStr);
	if (isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
	return d.toISOString().slice(0, 10);
}

export const GET: RequestHandler = async () => {
	const posts = await getAllPosts();
	const today = new Date().toISOString().slice(0, 10);

	const staticEntries = STATIC_ROUTES.map(
		({ path, changefreq, priority }) => `\t<url>
\t\t<loc>${SITE_URL}${path}</loc>
\t\t<lastmod>${today}</lastmod>
\t\t<changefreq>${changefreq}</changefreq>
\t\t<priority>${priority}</priority>
\t</url>`
	);

	const postEntries = posts.map((post) => {
		const base = post.has_benchmarks ? '/labs/blog' : '/blog';
		return `\t<url>
\t\t<loc>${SITE_URL}${base}/${post.slug}</loc>
\t\t<lastmod>${toLastmod(post.date)}</lastmod>
\t\t<changefreq>monthly</changefreq>
\t\t<priority>0.7</priority>
\t</url>`;
	});

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticEntries, ...postEntries].join('\n')}
</urlset>
`;

	return new Response(body, {
		headers: { 'Content-Type': 'application/xml' }
	});
};
