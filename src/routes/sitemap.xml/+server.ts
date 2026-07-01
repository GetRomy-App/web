import type { RequestHandler } from './$types';
import { getAllPosts } from '$lib/content';
import { getAllLegalPages } from '$lib/legal';

export const prerender = true;

const BASE_URL = 'https://getromy.app';

const LEGAL_ROUTES: Record<string, string> = {
	privacy: '/privacy',
	'prospect-privacy': '/privacy/prospects',
	terms: '/terms',
	cookies: '/cookies',
	dpa: '/dpa',
	security: '/security',
	subprocessors: '/subprocessors',
	aup: '/aup'
};

function isoDate(input: string, fallback: string): string {
	if (!input) return fallback;
	const d = new Date(input);
	return isNaN(d.getTime()) ? fallback : d.toISOString().slice(0, 10);
}

function urlEntry(loc: string, lastmod: string, changefreq: string, priority: string): string {
	return `  <url>\n    <loc>${BASE_URL}${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

export const GET: RequestHandler = async () => {
	const today = new Date().toISOString().slice(0, 10);
	const allPosts = await getAllPosts();
	const blogPosts = allPosts.filter((p) => !p.has_benchmarks);
	const labsPosts = allPosts.filter((p) => p.has_benchmarks);
	const legalPages = await getAllLegalPages();

	const entries: string[] = [
		urlEntry('/', today, 'weekly', '1.0'),
		urlEntry('/blog', today, 'daily', '0.9'),
		urlEntry('/labs', today, 'weekly', '0.7'),
		urlEntry('/legal', today, 'monthly', '0.4'),
		urlEntry('/status', today, 'always', '0.6'),
		urlEntry('/privacy/request', today, 'yearly', '0.2')
	];

	for (const post of blogPosts) {
		entries.push(urlEntry(`/blog/${post.slug}`, isoDate(post.date, today), 'monthly', '0.8'));
	}

	for (const post of labsPosts) {
		entries.push(urlEntry(`/labs/blog/${post.slug}`, isoDate(post.date, today), 'monthly', '0.6'));
	}

	for (const page of legalPages) {
		const route = LEGAL_ROUTES[page.slug];
		if (!route) continue;
		entries.push(urlEntry(route, isoDate(page.effective, today), 'yearly', '0.3'));
	}

	const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;

	return new Response(body, {
		headers: { 'Content-Type': 'application/xml' }
	});
};
