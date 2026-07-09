import { getAllPosts } from '$lib/content';
import type { RequestHandler } from './$types';

export const prerender = true;

const SITE_URL = 'https://getromy.app';

interface SitemapEntry {
	loc: string;
	lastmod?: string;
	changefreq?: string;
	priority?: string;
}

const STATIC_ENTRIES: SitemapEntry[] = [
	{ loc: '/', changefreq: 'weekly', priority: '1.0' },
	{ loc: '/blog', changefreq: 'daily', priority: '0.8' },
	{ loc: '/labs', changefreq: 'weekly', priority: '0.7' },
	{ loc: '/status', changefreq: 'always', priority: '0.6' },
	{ loc: '/legal', changefreq: 'monthly', priority: '0.3' },
	{ loc: '/terms', changefreq: 'monthly', priority: '0.3' },
	{ loc: '/privacy', changefreq: 'monthly', priority: '0.3' },
	{ loc: '/privacy/prospects', changefreq: 'monthly', priority: '0.3' },
	{ loc: '/privacy/request', changefreq: 'monthly', priority: '0.2' },
	{ loc: '/security', changefreq: 'monthly', priority: '0.3' },
	{ loc: '/cookies', changefreq: 'monthly', priority: '0.3' },
	{ loc: '/dpa', changefreq: 'monthly', priority: '0.3' },
	{ loc: '/subprocessors', changefreq: 'monthly', priority: '0.3' },
	{ loc: '/aup', changefreq: 'monthly', priority: '0.3' }
];

function escapeXml(value: string): string {
	return value.replace(/&/g, '&amp;');
}

function toEntryXml({ loc, lastmod, changefreq, priority }: SitemapEntry): string {
	const parts = [`\t<url>\n\t\t<loc>${escapeXml(SITE_URL + loc)}</loc>`];
	if (lastmod) parts.push(`\t\t<lastmod>${lastmod}</lastmod>`);
	if (changefreq) parts.push(`\t\t<changefreq>${changefreq}</changefreq>`);
	if (priority) parts.push(`\t\t<priority>${priority}</priority>`);
	parts.push('\t</url>');
	return parts.join('\n');
}

export const GET: RequestHandler = async () => {
	const posts = await getAllPosts();

	const postEntries: SitemapEntry[] = posts.map((post) => ({
		loc: post.has_benchmarks ? `/labs/blog/${post.slug}` : `/blog/${post.slug}`,
		lastmod: post.date || undefined,
		changefreq: 'monthly',
		priority: '0.6'
	}));

	const entries = [...STATIC_ENTRIES, ...postEntries];

	const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries
		.map(toEntryXml)
		.join('\n')}\n</urlset>\n`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};
