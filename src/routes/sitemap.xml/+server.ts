import type { RequestHandler } from './$types';
import { getAllPosts } from '$lib/content';

export const prerender = true;

const SITE_URL = 'https://getromy.app';

interface UrlEntry {
	loc: string;
	lastmod?: string;
	changefreq?: string;
	priority?: string;
}

function toIsoDate(value: string | undefined): string | undefined {
	if (!value) return undefined;
	const d = new Date(value);
	if (isNaN(d.getTime())) return undefined;
	return d.toISOString().slice(0, 10);
}

function renderUrl({ loc, lastmod, changefreq, priority }: UrlEntry): string {
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
	const allPosts = await getAllPosts();
	const blogPosts = allPosts.filter((p) => !p.has_benchmarks);
	const labsPosts = allPosts.filter((p) => p.has_benchmarks);
	const latestPostDate = toIsoDate(allPosts[0]?.date);

	const staticEntries: UrlEntry[] = [
		{ loc: `${SITE_URL}/`, changefreq: 'weekly', priority: '1.0' },
		{ loc: `${SITE_URL}/blog`, lastmod: latestPostDate, changefreq: 'daily', priority: '0.8' },
		{
			loc: `${SITE_URL}/labs`,
			lastmod: toIsoDate(labsPosts[0]?.date),
			changefreq: 'weekly',
			priority: '0.7'
		},
		{ loc: `${SITE_URL}/status`, changefreq: 'always', priority: '0.5' },
		{ loc: `${SITE_URL}/security`, changefreq: 'monthly', priority: '0.4' },
		{ loc: `${SITE_URL}/legal`, changefreq: 'monthly', priority: '0.3' },
		{ loc: `${SITE_URL}/privacy`, changefreq: 'monthly', priority: '0.3' },
		{ loc: `${SITE_URL}/terms`, changefreq: 'monthly', priority: '0.3' },
		{ loc: `${SITE_URL}/cookies`, changefreq: 'monthly', priority: '0.3' },
		{ loc: `${SITE_URL}/dpa`, changefreq: 'monthly', priority: '0.3' },
		{ loc: `${SITE_URL}/subprocessors`, changefreq: 'monthly', priority: '0.3' },
		{ loc: `${SITE_URL}/aup`, changefreq: 'monthly', priority: '0.3' }
	];

	const blogEntries: UrlEntry[] = blogPosts.map((p) => ({
		loc: `${SITE_URL}/blog/${p.slug}`,
		lastmod: toIsoDate(p.date),
		changefreq: 'monthly',
		priority: '0.6'
	}));

	const labsEntries: UrlEntry[] = labsPosts.map((p) => ({
		loc: `${SITE_URL}/labs/blog/${p.slug}`,
		lastmod: toIsoDate(p.date),
		changefreq: 'monthly',
		priority: '0.6'
	}));

	const body = [...staticEntries, ...blogEntries, ...labsEntries].map(renderUrl).join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

	return new Response(xml, {
		headers: { 'Content-Type': 'application/xml' }
	});
};
