import type { RequestHandler } from '@sveltejs/kit';
import { getAllPosts } from '$lib/content';

export const prerender = true;

const SITE = 'https://getromy.app';

const STATIC: Array<{ path: string; priority: string; freq: string; lastmod?: string }> = [
	{ path: '/', priority: '1.0', freq: 'weekly', lastmod: '2026-06-11' },
	{ path: '/blog', priority: '0.9', freq: 'daily', lastmod: '2026-06-11' },
	{ path: '/labs', priority: '0.8', freq: 'weekly', lastmod: '2026-06-11' },
	{ path: '/legal', priority: '0.3', freq: 'yearly' },
	{ path: '/privacy', priority: '0.3', freq: 'yearly' },
	{ path: '/privacy/prospects', priority: '0.2', freq: 'yearly' },
	{ path: '/terms', priority: '0.3', freq: 'yearly' },
	{ path: '/aup', priority: '0.2', freq: 'yearly' },
	{ path: '/cookies', priority: '0.2', freq: 'yearly' },
	{ path: '/dpa', priority: '0.2', freq: 'yearly' },
	{ path: '/security', priority: '0.3', freq: 'yearly' },
	{ path: '/subprocessors', priority: '0.2', freq: 'monthly' }
];

function entry(
	path: string,
	priority: string,
	freq: string,
	lastmod?: string
): string {
	const lines = [
		'\t<url>',
		`\t\t<loc>${SITE}${path}</loc>`,
		lastmod ? `\t\t<lastmod>${lastmod}</lastmod>` : null,
		`\t\t<changefreq>${freq}</changefreq>`,
		`\t\t<priority>${priority}</priority>`,
		'\t</url>'
	].filter(Boolean) as string[];
	return lines.join('\n');
}

export const GET: RequestHandler = async () => {
	const posts = await getAllPosts();

	const staticEntries = STATIC.map((p) => entry(p.path, p.priority, p.freq, p.lastmod));

	const blogEntries = posts
		.filter((p) => !p.has_benchmarks)
		.map((p) => entry('/blog/' + p.slug, '0.7', 'monthly', p.date || undefined));

	const labsEntries = posts
		.filter((p) => p.has_benchmarks)
		.map((p) => entry('/labs/blog/' + p.slug, '0.8', 'monthly', p.date || undefined));

	const xml = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		...staticEntries,
		...blogEntries,
		...labsEntries,
		'</urlset>'
	].join('\n');

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
