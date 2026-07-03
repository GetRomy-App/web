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

function toXml(entries: UrlEntry[]): string {
	const body = entries
		.map((entry) => {
			const parts = [`    <loc>${entry.loc}</loc>`];
			if (entry.lastmod) parts.push(`    <lastmod>${entry.lastmod}</lastmod>`);
			if (entry.changefreq) parts.push(`    <changefreq>${entry.changefreq}</changefreq>`);
			if (entry.priority) parts.push(`    <priority>${entry.priority}</priority>`);
			return `  <url>\n${parts.join('\n')}\n  </url>`;
		})
		.join('\n');

	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

export const GET = async () => {
	const [allPosts, legalPages] = await Promise.all([getAllPosts(), getAllLegalPages()]);

	const fieldPosts = allPosts.filter((p) => !p.has_benchmarks);
	const labsPosts = allPosts.filter((p) => p.has_benchmarks);

	const latestPostDate = allPosts[0]?.date || '';

	const entries: UrlEntry[] = [
		{ loc: `${SITE_URL}/`, lastmod: latestPostDate, changefreq: 'weekly', priority: '1.0' },
		{ loc: `${SITE_URL}/blog`, lastmod: fieldPosts[0]?.date, changefreq: 'daily', priority: '0.9' },
		{ loc: `${SITE_URL}/labs`, lastmod: labsPosts[0]?.date, changefreq: 'weekly', priority: '0.8' },
		{ loc: `${SITE_URL}/status`, lastmod: '2026-06-22', changefreq: 'always', priority: '0.5' },
		{ loc: `${SITE_URL}/legal`, changefreq: 'monthly', priority: '0.3' },
		{ loc: `${SITE_URL}/privacy/request`, changefreq: 'yearly', priority: '0.3' }
	];

	for (const post of fieldPosts) {
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

	const legalRoutes: Record<string, string> = {
		'prospect-privacy': '/privacy/prospects'
	};

	for (const page of legalPages) {
		entries.push({
			loc: `${SITE_URL}${legalRoutes[page.slug] ?? `/${page.slug}`}`,
			changefreq: 'yearly',
			priority: '0.2'
		});
	}

	return new Response(toXml(entries), {
		headers: { 'Content-Type': 'application/xml' }
	});
};
