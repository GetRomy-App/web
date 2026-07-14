import type { RequestHandler } from './$types';
import { getAllPosts } from '$lib/content';
import { getAllLegalPages } from '$lib/legal';

export const prerender = true;

const SITE = 'https://getromy.app';

// content/legal/<slug>.mdoc -> public route path
const LEGAL_ROUTES: Record<string, string> = {
	privacy: '/privacy',
	'prospect-privacy': '/privacy/prospects',
	terms: '/terms',
	dpa: '/dpa',
	security: '/security',
	cookies: '/cookies',
	subprocessors: '/subprocessors',
	aup: '/aup'
};

interface Entry {
	loc: string;
	lastmod?: string;
	changefreq?: string;
	priority?: string;
}

function isoDate(value: string | undefined): string | undefined {
	if (!value) return undefined;
	const d = new Date(value);
	if (isNaN(d.getTime())) return undefined;
	return d.toISOString().slice(0, 10);
}

function xml(entries: Entry[]): string {
	const body = entries
		.map((e) => {
			const parts = [`    <loc>${e.loc}</loc>`];
			if (e.lastmod) parts.push(`    <lastmod>${e.lastmod}</lastmod>`);
			if (e.changefreq) parts.push(`    <changefreq>${e.changefreq}</changefreq>`);
			if (e.priority) parts.push(`    <priority>${e.priority}</priority>`);
			return `  <url>\n${parts.join('\n')}\n  </url>`;
		})
		.join('\n');
	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

export const GET: RequestHandler = async () => {
	const [posts, legalPages] = await Promise.all([getAllPosts(), getAllLegalPages()]);

	const entries: Entry[] = [
		{ loc: `${SITE}/`, changefreq: 'weekly', priority: '1.0' },
		{ loc: `${SITE}/blog`, changefreq: 'daily', priority: '0.9' },
		{ loc: `${SITE}/labs`, changefreq: 'weekly', priority: '0.8' },
		{ loc: `${SITE}/status`, changefreq: 'always', priority: '0.6' },
		{ loc: `${SITE}/legal`, changefreq: 'monthly', priority: '0.3' }
	];

	for (const post of posts) {
		const base = post.has_benchmarks ? '/labs/blog' : '/blog';
		entries.push({
			loc: `${SITE}${base}/${post.slug}`,
			lastmod: isoDate(post.date),
			changefreq: 'monthly',
			priority: '0.7'
		});
	}

	const legalByRoute = new Map(legalPages.map((p) => [p.slug, p]));
	for (const [slug, route] of Object.entries(LEGAL_ROUTES)) {
		const page = legalByRoute.get(slug);
		entries.push({
			loc: `${SITE}${route}`,
			lastmod: isoDate(page?.effective),
			changefreq: 'yearly',
			priority: '0.3'
		});
	}

	return new Response(xml(entries), {
		headers: { 'Content-Type': 'application/xml' }
	});
};
