import { getAllPosts } from '$lib/content';
import { getAllLegalPages } from '$lib/legal';

export const prerender = true;

const SITE_URL = 'https://getromy.app';

const URL_OVERRIDE: Record<string, string> = {
	'prospect-privacy': '/privacy/prospects'
};

interface SitemapEntry {
	loc: string;
	lastmod?: string;
	changefreq?: string;
	priority?: string;
}

function toIso(date: string | undefined): string | undefined {
	if (!date) return undefined;
	const d = new Date(date);
	if (isNaN(d.getTime())) return undefined;
	return d.toISOString().slice(0, 10);
}

function renderUrl(entry: SitemapEntry): string {
	return [
		'  <url>',
		`    <loc>${entry.loc}</loc>`,
		entry.lastmod ? `    <lastmod>${entry.lastmod}</lastmod>` : null,
		entry.changefreq ? `    <changefreq>${entry.changefreq}</changefreq>` : null,
		entry.priority ? `    <priority>${entry.priority}</priority>` : null,
		'  </url>'
	]
		.filter(Boolean)
		.join('\n');
}

export async function GET() {
	const [allPosts, legalPages] = await Promise.all([getAllPosts(), getAllLegalPages()]);
	const blogPosts = allPosts.filter((p) => !p.has_benchmarks);
	const labsPosts = allPosts.filter((p) => p.has_benchmarks);

	const entries: SitemapEntry[] = [
		{ loc: `${SITE_URL}/`, changefreq: 'weekly', priority: '1.0' },
		{ loc: `${SITE_URL}/blog`, changefreq: 'daily', priority: '0.9' },
		{ loc: `${SITE_URL}/labs`, changefreq: 'weekly', priority: '0.7' },
		{ loc: `${SITE_URL}/status`, changefreq: 'always', priority: '0.5' },
		{ loc: `${SITE_URL}/legal`, changefreq: 'monthly', priority: '0.3' }
	];

	for (const post of blogPosts) {
		entries.push({
			loc: `${SITE_URL}/blog/${post.slug}`,
			lastmod: toIso(post.date),
			changefreq: 'monthly',
			priority: '0.8'
		});
	}

	for (const post of labsPosts) {
		entries.push({
			loc: `${SITE_URL}/labs/blog/${post.slug}`,
			lastmod: toIso(post.date),
			changefreq: 'monthly',
			priority: '0.6'
		});
	}

	for (const page of legalPages) {
		const path = URL_OVERRIDE[page.slug] ?? `/${page.slug}`;
		entries.push({
			loc: `${SITE_URL}${path}`,
			lastmod: toIso(page.effective),
			changefreq: 'yearly',
			priority: '0.3'
		});
	}

	const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries
		.map(renderUrl)
		.join('\n')}\n</urlset>\n`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
}
