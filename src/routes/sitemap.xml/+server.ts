import { getAllPosts } from '$lib/content';
import { getAllLegalPages } from '$lib/legal';

export const prerender = true;

const SITE = 'https://getromy.app';

const LEGAL_URL_OVERRIDE: Record<string, string> = {
	'prospect-privacy': '/privacy/prospects'
};

interface UrlEntry {
	loc: string;
	lastmod?: string;
	changefreq?: string;
	priority?: string;
}

function toXml(urls: UrlEntry[]): string {
	const body = urls
		.map((u) => {
			const parts = [`    <loc>${SITE}${u.loc}</loc>`];
			if (u.lastmod) parts.push(`    <lastmod>${u.lastmod}</lastmod>`);
			if (u.changefreq) parts.push(`    <changefreq>${u.changefreq}</changefreq>`);
			if (u.priority) parts.push(`    <priority>${u.priority}</priority>`);
			return `  <url>\n${parts.join('\n')}\n  </url>`;
		})
		.join('\n');

	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

export async function GET() {
	const allPosts = await getAllPosts();
	const blogPosts = allPosts.filter((p) => !p.has_benchmarks);
	const labsPosts = allPosts.filter((p) => p.has_benchmarks);
	const legalPages = await getAllLegalPages();

	const urls: UrlEntry[] = [
		{ loc: '/', changefreq: 'weekly', priority: '1.0' },
		{ loc: '/blog', changefreq: 'daily', priority: '0.9' },
		{ loc: '/labs', changefreq: 'weekly', priority: '0.7' },
		{ loc: '/status', changefreq: 'always', priority: '0.6' },
		{ loc: '/legal', changefreq: 'monthly', priority: '0.4' },
		{ loc: '/privacy/request', changefreq: 'yearly', priority: '0.3' }
	];

	for (const post of blogPosts) {
		urls.push({
			loc: `/blog/${post.slug}`,
			lastmod: post.date || undefined,
			changefreq: 'monthly',
			priority: '0.8'
		});
	}

	for (const post of labsPosts) {
		urls.push({
			loc: `/labs/blog/${post.slug}`,
			lastmod: post.date || undefined,
			changefreq: 'monthly',
			priority: '0.6'
		});
	}

	for (const page of legalPages) {
		const path = LEGAL_URL_OVERRIDE[page.slug] ?? `/${page.slug}`;
		urls.push({
			loc: path,
			lastmod: page.effective || undefined,
			changefreq: 'yearly',
			priority: '0.3'
		});
	}

	return new Response(toXml(urls), {
		headers: { 'Content-Type': 'application/xml' }
	});
}
