import { getAllPosts } from '$lib/content';
import { getAllLegalPages } from '$lib/legal';

export const prerender = true;

const SITE_URL = 'https://getromy.app';

const LEGAL_URL_OVERRIDE: Record<string, string> = {
	'prospect-privacy': '/privacy/prospects'
};

function urlForLegalPage(slug: string): string {
	return LEGAL_URL_OVERRIDE[slug] ?? `/${slug}`;
}

interface SitemapEntry {
	loc: string;
	lastmod?: string;
	changefreq?: string;
	priority?: string;
}

function toXml(entries: SitemapEntry[]): string {
	const urls = entries
		.map((entry) => {
			const parts = [`    <loc>${entry.loc}</loc>`];
			if (entry.lastmod) parts.push(`    <lastmod>${entry.lastmod}</lastmod>`);
			if (entry.changefreq) parts.push(`    <changefreq>${entry.changefreq}</changefreq>`);
			if (entry.priority) parts.push(`    <priority>${entry.priority}</priority>`);
			return `  <url>\n${parts.join('\n')}\n  </url>`;
		})
		.join('\n');

	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export async function GET() {
	const [allPosts, legalPages] = await Promise.all([getAllPosts(), getAllLegalPages()]);
	const blogPosts = allPosts.filter((p) => !p.has_benchmarks);
	const labsPosts = allPosts.filter((p) => p.has_benchmarks);

	const today = allPosts[0]?.date ?? '';

	const entries: SitemapEntry[] = [
		{ loc: `${SITE_URL}/`, lastmod: today, changefreq: 'weekly', priority: '1.0' },
		{ loc: `${SITE_URL}/blog`, lastmod: blogPosts[0]?.date, changefreq: 'weekly', priority: '0.9' },
		{ loc: `${SITE_URL}/labs`, lastmod: labsPosts[0]?.date, changefreq: 'weekly', priority: '0.8' },
		{ loc: `${SITE_URL}/status`, changefreq: 'always', priority: '0.6' },
		{ loc: `${SITE_URL}/legal`, changefreq: 'monthly', priority: '0.4' },
		{ loc: `${SITE_URL}/privacy/request`, changefreq: 'monthly', priority: '0.4' }
	];

	for (const post of blogPosts) {
		entries.push({
			loc: `${SITE_URL}/blog/${post.slug}`,
			lastmod: post.date,
			changefreq: 'monthly',
			priority: '0.7'
		});
	}

	for (const post of labsPosts) {
		entries.push({
			loc: `${SITE_URL}/labs/blog/${post.slug}`,
			lastmod: post.date,
			changefreq: 'monthly',
			priority: '0.7'
		});
	}

	for (const page of legalPages) {
		entries.push({
			loc: `${SITE_URL}${urlForLegalPage(page.slug)}`,
			changefreq: 'yearly',
			priority: '0.3'
		});
	}

	return new Response(toXml(entries), {
		headers: { 'Content-Type': 'application/xml' }
	});
}
