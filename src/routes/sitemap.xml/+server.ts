import type { RequestHandler } from './$types';
import { getAllPosts } from '$lib/content';

export const prerender = true;

const SITE = 'https://getromy.app';

interface SitemapUrl {
	loc: string;
	lastmod?: string;
	changefreq: string;
	priority: string;
}

const STATIC_URLS: SitemapUrl[] = [
	{ loc: '/', changefreq: 'weekly', priority: '1.0' },
	{ loc: '/blog', changefreq: 'daily', priority: '0.9' },
	{ loc: '/labs', changefreq: 'weekly', priority: '0.7' },
	{ loc: '/status', changefreq: 'always', priority: '0.5' },
	{ loc: '/legal', changefreq: 'monthly', priority: '0.4' },
	{ loc: '/security', changefreq: 'monthly', priority: '0.4' },
	{ loc: '/privacy', changefreq: 'monthly', priority: '0.4' },
	{ loc: '/privacy/prospects', changefreq: 'monthly', priority: '0.3' },
	{ loc: '/privacy/request', changefreq: 'yearly', priority: '0.2' },
	{ loc: '/terms', changefreq: 'monthly', priority: '0.4' },
	{ loc: '/cookies', changefreq: 'monthly', priority: '0.3' },
	{ loc: '/dpa', changefreq: 'monthly', priority: '0.3' },
	{ loc: '/subprocessors', changefreq: 'monthly', priority: '0.3' },
	{ loc: '/aup', changefreq: 'monthly', priority: '0.3' }
];

function isValidDate(value: string): boolean {
	return value.length > 0 && !isNaN(new Date(value).getTime());
}

function toEntry(url: SitemapUrl): string {
	const lastmod =
		url.lastmod && isValidDate(url.lastmod) ? `\n    <lastmod>${url.lastmod}</lastmod>` : '';
	return `  <url>
    <loc>${SITE}${url.loc}</loc>${lastmod}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`;
}

export const GET: RequestHandler = async () => {
	const posts = await getAllPosts();

	const postUrls: SitemapUrl[] = posts.map((post) => ({
		loc: post.has_benchmarks ? `/labs/blog/${post.slug}` : `/blog/${post.slug}`,
		lastmod: post.date,
		changefreq: 'monthly',
		priority: '0.7'
	}));

	const allUrls = [...STATIC_URLS, ...postUrls];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(toEntry).join('\n')}
</urlset>
`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};
