import type { RequestHandler } from './$types';
import { getAllPosts } from '$lib/content';
import { getAllLegalPages } from '$lib/legal';

export const prerender = true;

const SITE_URL = 'https://getromy.app';

const LEGAL_URL_OVERRIDE: Record<string, string> = {
	'prospect-privacy': '/privacy/prospects'
};

interface UrlEntry {
	loc: string;
	lastmod?: string;
	changefreq?: string;
	priority?: string;
}

function toXml(entries: UrlEntry[]): string {
	const body = entries
		.map((entry) => {
			const parts = [`    <loc>${SITE_URL}${entry.loc}</loc>`];
			if (entry.lastmod) parts.push(`    <lastmod>${entry.lastmod}</lastmod>`);
			if (entry.changefreq) parts.push(`    <changefreq>${entry.changefreq}</changefreq>`);
			if (entry.priority) parts.push(`    <priority>${entry.priority}</priority>`);
			return `  <url>\n${parts.join('\n')}\n  </url>`;
		})
		.join('\n');

	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

export const GET: RequestHandler = async () => {
	const [allPosts, legalPages] = await Promise.all([getAllPosts(), getAllLegalPages()]);

	const blogPosts = allPosts.filter((p) => !p.has_benchmarks);
	const labsPosts = allPosts.filter((p) => p.has_benchmarks);

	const entries: UrlEntry[] = [
		{ loc: '/', changefreq: 'weekly', priority: '1.0' },
		{ loc: '/blog', changefreq: 'daily', priority: '0.9' },
		{ loc: '/labs', changefreq: 'weekly', priority: '0.7' },
		{ loc: '/legal', changefreq: 'monthly', priority: '0.3' },
		{ loc: '/status', changefreq: 'always', priority: '0.5' },
		{ loc: '/privacy/request', changefreq: 'yearly', priority: '0.2' },
		...blogPosts.map((p) => ({
			loc: `/blog/${p.slug}`,
			lastmod: p.date || undefined,
			changefreq: 'monthly',
			priority: '0.8'
		})),
		...labsPosts.map((p) => ({
			loc: `/labs/blog/${p.slug}`,
			lastmod: p.date || undefined,
			changefreq: 'monthly',
			priority: '0.7'
		})),
		...legalPages.map((p) => ({
			loc: LEGAL_URL_OVERRIDE[p.slug] ?? `/${p.slug}`,
			lastmod: p.effective || undefined,
			changefreq: 'yearly',
			priority: '0.3'
		}))
	];

	return new Response(toXml(entries), {
		headers: { 'Content-Type': 'application/xml' }
	});
};
