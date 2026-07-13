import { getAllPosts } from '$lib/content';

export const prerender = true;

const SITE = 'https://getromy.app';

const STATIC_ROUTES: Array<{ path: string; changefreq: string; priority: string }> = [
	{ path: '/', changefreq: 'weekly', priority: '1.0' },
	{ path: '/blog', changefreq: 'daily', priority: '0.9' },
	{ path: '/labs', changefreq: 'weekly', priority: '0.7' },
	{ path: '/status', changefreq: 'always', priority: '0.6' },
	{ path: '/security', changefreq: 'monthly', priority: '0.5' },
	{ path: '/legal', changefreq: 'monthly', priority: '0.4' },
	{ path: '/privacy', changefreq: 'monthly', priority: '0.4' },
	{ path: '/privacy/prospects', changefreq: 'monthly', priority: '0.3' },
	{ path: '/privacy/request', changefreq: 'monthly', priority: '0.3' },
	{ path: '/terms', changefreq: 'monthly', priority: '0.4' },
	{ path: '/cookies', changefreq: 'monthly', priority: '0.3' },
	{ path: '/dpa', changefreq: 'monthly', priority: '0.3' },
	{ path: '/aup', changefreq: 'monthly', priority: '0.3' },
	{ path: '/subprocessors', changefreq: 'monthly', priority: '0.3' }
];

function escapeXml(value: string): string {
	return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function urlEntry(loc: string, lastmod: string, changefreq: string, priority: string): string {
	return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export async function GET() {
	const posts = await getAllPosts();
	const today = new Date().toISOString().slice(0, 10);
	const latestPostDate = posts[0]?.date || today;

	const staticEntries = STATIC_ROUTES.map((route) =>
		urlEntry(
			`${SITE}${route.path}`,
			route.path === '/' || route.path === '/blog' ? latestPostDate : today,
			route.changefreq,
			route.priority
		)
	);

	const postEntries = posts.map((post) => {
		const basePath = post.has_benchmarks ? '/labs/blog' : '/blog';
		return urlEntry(`${SITE}${basePath}/${post.slug}`, post.date || today, 'monthly', '0.6');
	});

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticEntries, ...postEntries].join('\n')}
</urlset>`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
}
