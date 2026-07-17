import type { RequestHandler } from './$types';
import { getAllPosts } from '$lib/content';
import { SITE_URL } from '$lib/seo';

export const prerender = true;

interface UrlEntry {
	loc: string;
	lastmod?: string;
	changefreq: string;
	priority: string;
}

const STATIC_ENTRIES: UrlEntry[] = [
	{ loc: '/', changefreq: 'weekly', priority: '1.0' },
	{ loc: '/blog', changefreq: 'weekly', priority: '0.8' },
	{ loc: '/labs', changefreq: 'weekly', priority: '0.7' },
	{ loc: '/status', changefreq: 'always', priority: '0.6' },
	{ loc: '/security', changefreq: 'monthly', priority: '0.4' },
	{ loc: '/legal', changefreq: 'monthly', priority: '0.3' },
	{ loc: '/privacy', changefreq: 'monthly', priority: '0.3' },
	{ loc: '/terms', changefreq: 'monthly', priority: '0.3' },
	{ loc: '/privacy/prospects', changefreq: 'monthly', priority: '0.2' },
	{ loc: '/privacy/request', changefreq: 'monthly', priority: '0.2' },
	{ loc: '/aup', changefreq: 'monthly', priority: '0.2' },
	{ loc: '/dpa', changefreq: 'monthly', priority: '0.2' },
	{ loc: '/cookies', changefreq: 'monthly', priority: '0.2' },
	{ loc: '/subprocessors', changefreq: 'monthly', priority: '0.2' }
];

function xmlEscape(value: string): string {
	return value.replace(/&/g, '&amp;');
}

function urlTag(entry: UrlEntry): string {
	const lastmodTag = entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : '';
	return `  <url>
    <loc>${xmlEscape(SITE_URL + entry.loc)}</loc>${lastmodTag}
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`;
}

export const GET: RequestHandler = async () => {
	const posts = await getAllPosts();

	const postEntries: UrlEntry[] = posts.map((post) => ({
		loc: post.has_benchmarks ? `/labs/blog/${post.slug}` : `/blog/${post.slug}`,
		lastmod: post.date || undefined,
		changefreq: 'monthly',
		priority: '0.6'
	}));

	const body = [...STATIC_ENTRIES, ...postEntries].map(urlTag).join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

	return new Response(xml, {
		headers: { 'Content-Type': 'application/xml' }
	});
};
