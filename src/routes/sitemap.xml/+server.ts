import type { RequestHandler } from './$types';
import { getAllPosts } from '$lib/content';
import { getAllLegalPages } from '$lib/legal';

export const prerender = true;

const SITE_URL = 'https://getromy.app';

interface UrlEntry {
	loc: string;
	lastmod?: string;
	changefreq?: string;
	priority?: string;
}

function toXml(urls: UrlEntry[]): string {
	const items = urls
		.map((u) => {
			const parts = [`    <loc>${SITE_URL}${u.loc}</loc>`];
			if (u.lastmod) parts.push(`    <lastmod>${u.lastmod}</lastmod>`);
			if (u.changefreq) parts.push(`    <changefreq>${u.changefreq}</changefreq>`);
			if (u.priority) parts.push(`    <priority>${u.priority}</priority>`);
			return `  <url>\n${parts.join('\n')}\n  </url>`;
		})
		.join('\n');

	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>\n`;
}

export const GET: RequestHandler = async () => {
	const [posts, legalPages] = await Promise.all([getAllPosts(), getAllLegalPages()]);

	const fieldPosts = posts.filter((p) => !p.has_benchmarks);
	const benchmarkPosts = posts.filter((p) => p.has_benchmarks);

	const latestPostDate = posts[0]?.date || undefined;

	const legalPathBySlug: Record<string, string> = {
		privacy: '/privacy',
		'prospect-privacy': '/privacy/prospects',
		terms: '/terms',
		security: '/security',
		cookies: '/cookies',
		dpa: '/dpa',
		aup: '/aup',
		subprocessors: '/subprocessors'
	};

	const urls: UrlEntry[] = [
		{ loc: '/', changefreq: 'weekly', priority: '1.0' },
		{ loc: '/blog', lastmod: latestPostDate, changefreq: 'weekly', priority: '0.9' },
		{ loc: '/labs', lastmod: latestPostDate, changefreq: 'weekly', priority: '0.7' },
		{ loc: '/status', changefreq: 'always', priority: '0.6' },
		{ loc: '/legal', changefreq: 'monthly', priority: '0.3' },
		{ loc: '/privacy/request', changefreq: 'yearly', priority: '0.3' },
		...fieldPosts.map((p) => ({
			loc: `/blog/${p.slug}`,
			lastmod: p.date || undefined,
			changefreq: 'monthly',
			priority: '0.8'
		})),
		...benchmarkPosts.map((p) => ({
			loc: `/labs/blog/${p.slug}`,
			lastmod: p.date || undefined,
			changefreq: 'monthly',
			priority: '0.6'
		})),
		...legalPages
			.map((p) => legalPathBySlug[p.slug])
			.filter((path): path is string => Boolean(path))
			.map((path) => ({ loc: path, changefreq: 'monthly', priority: '0.3' }))
	];

	return new Response(toXml(urls), {
		headers: { 'Content-Type': 'application/xml' }
	});
};
