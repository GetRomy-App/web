import type { RequestHandler } from './$types';
import { getAllPosts } from '$lib/content';
import { getAllLegalPages } from '$lib/legal';
import { SITE_URL } from '$lib/seo';

export const prerender = true;

const LEGAL_PATH_OVERRIDE: Record<string, string> = {
	'prospect-privacy': '/privacy/prospects'
};

interface UrlEntry {
	path: string;
	lastmod?: string;
	changefreq: string;
	priority: string;
}

function toIso(date: string): string | undefined {
	if (!date) return undefined;
	const d = new Date(date);
	return isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
}

export const GET: RequestHandler = async () => {
	const [posts, legalPages] = await Promise.all([getAllPosts(), getAllLegalPages()]);

	const entries: UrlEntry[] = [
		{ path: '/', changefreq: 'weekly', priority: '1.0' },
		{ path: '/blog', changefreq: 'daily', priority: '0.9' },
		{ path: '/labs', changefreq: 'weekly', priority: '0.8' },
		{ path: '/legal', changefreq: 'monthly', priority: '0.3' },
		{ path: '/privacy/request', changefreq: 'yearly', priority: '0.2' },
		{ path: '/status', changefreq: 'always', priority: '0.6' }
	];

	for (const post of posts) {
		entries.push({
			path: post.has_benchmarks ? `/labs/blog/${post.slug}` : `/blog/${post.slug}`,
			lastmod: toIso(post.date),
			changefreq: 'monthly',
			priority: '0.7'
		});
	}

	for (const page of legalPages) {
		entries.push({
			path: LEGAL_PATH_OVERRIDE[page.slug] ?? `/${page.slug}`,
			lastmod: toIso(page.effective),
			changefreq: 'monthly',
			priority: '0.3'
		});
	}

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
	.map(
		(entry) => `  <url>
    <loc>${SITE_URL}${entry.path}</loc>
${entry.lastmod ? `    <lastmod>${entry.lastmod}</lastmod>\n` : ''}    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
	)
	.join('\n')}
</urlset>
`;

	return new Response(body, {
		headers: { 'Content-Type': 'application/xml' }
	});
};
