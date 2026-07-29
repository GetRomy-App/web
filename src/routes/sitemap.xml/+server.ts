import { getAllPosts } from '$lib/content';
import { getAllLegalPages } from '$lib/legal';

export const prerender = true;

const SITE_URL = 'https://getromy.app';

const LEGAL_ROUTES: Record<string, string> = {
	aup: '/aup',
	cookies: '/cookies',
	dpa: '/dpa',
	privacy: '/privacy',
	'prospect-privacy': '/privacy/prospects',
	security: '/security',
	subprocessors: '/subprocessors',
	terms: '/terms'
};

interface SitemapEntry {
	loc: string;
	lastmod?: string;
	changefreq: string;
	priority: string;
}

function toIsoDate(value: string): string | undefined {
	if (!value) return undefined;
	const d = new Date(value);
	return isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
}

export async function GET() {
	const [posts, legalPages] = await Promise.all([getAllPosts(), getAllLegalPages()]);

	const entries: SitemapEntry[] = [
		{ loc: '/', changefreq: 'weekly', priority: '1.0' },
		{ loc: '/blog', changefreq: 'daily', priority: '0.8' },
		{ loc: '/labs', changefreq: 'weekly', priority: '0.6' },
		{ loc: '/status', changefreq: 'always', priority: '0.6' },
		{ loc: '/legal', changefreq: 'monthly', priority: '0.3' },
		{ loc: '/privacy/request', changefreq: 'yearly', priority: '0.2' }
	];

	for (const post of posts) {
		entries.push({
			loc: post.has_benchmarks ? `/labs/blog/${post.slug}` : `/blog/${post.slug}`,
			lastmod: toIsoDate(post.date),
			changefreq: 'monthly',
			priority: '0.7'
		});
	}

	for (const page of legalPages) {
		const route = LEGAL_ROUTES[page.slug];
		if (!route) continue;
		entries.push({
			loc: route,
			lastmod: toIsoDate(page.effective),
			changefreq: 'monthly',
			priority: '0.3'
		});
	}

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
	.map(
		(e) => `  <url>
    <loc>${SITE_URL}${e.loc}</loc>
${e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>\n` : ''}    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
	)
	.join('\n')}
</urlset>
`;

	return new Response(body, {
		headers: { 'Content-Type': 'application/xml' }
	});
}
