import type { RequestHandler } from './$types';
import { getAllPosts } from '$lib/content';
import { getAllLegalPages } from '$lib/legal';
import { SITE_URL } from '$lib/seo';

export const prerender = true;

interface SitemapUrl {
	loc: string;
	lastmod?: string;
	changefreq?: string;
	priority?: string;
}

const LEGAL_URL_OVERRIDE: Record<string, string> = {
	'prospect-privacy': '/privacy/prospects'
};

function toIsoDate(value: string): string | undefined {
	if (!value) return undefined;
	const d = new Date(value);
	return isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
}

function renderUrl({ loc, lastmod, changefreq, priority }: SitemapUrl): string {
	return [
		'  <url>',
		`    <loc>${loc}</loc>`,
		lastmod ? `    <lastmod>${lastmod}</lastmod>` : '',
		changefreq ? `    <changefreq>${changefreq}</changefreq>` : '',
		priority ? `    <priority>${priority}</priority>` : '',
		'  </url>'
	]
		.filter(Boolean)
		.join('\n');
}

export const GET: RequestHandler = async () => {
	const [posts, legalPages] = await Promise.all([getAllPosts(), getAllLegalPages()]);

	const urls: SitemapUrl[] = [
		{ loc: `${SITE_URL}/`, changefreq: 'weekly', priority: '1.0' },
		{ loc: `${SITE_URL}/blog`, changefreq: 'daily', priority: '0.8' },
		{ loc: `${SITE_URL}/labs`, changefreq: 'weekly', priority: '0.7' },
		{ loc: `${SITE_URL}/legal`, changefreq: 'monthly', priority: '0.4' },
		{ loc: `${SITE_URL}/status`, changefreq: 'always', priority: '0.5' },
		{ loc: `${SITE_URL}/privacy/request`, changefreq: 'yearly', priority: '0.3' }
	];

	for (const post of posts) {
		const base = post.has_benchmarks ? '/labs/blog' : '/blog';
		urls.push({
			loc: `${SITE_URL}${base}/${post.slug}`,
			lastmod: toIsoDate(post.date),
			changefreq: 'monthly',
			priority: '0.7'
		});
	}

	for (const page of legalPages) {
		const path = LEGAL_URL_OVERRIDE[page.slug] ?? `/${page.slug}`;
		urls.push({
			loc: `${SITE_URL}${path}`,
			lastmod: toIsoDate(page.effective),
			changefreq: 'yearly',
			priority: '0.4'
		});
	}

	const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
		.map(renderUrl)
		.join('\n')}\n</urlset>\n`;

	return new Response(body, {
		headers: { 'Content-Type': 'application/xml' }
	});
};
