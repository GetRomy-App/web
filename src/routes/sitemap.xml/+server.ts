import { getAllPosts } from '$lib/content';

export const prerender = true;

const SITE = 'https://getromy.app';

interface Entry {
	loc: string;
	lastmod?: string;
	changefreq: string;
	priority: string;
}

const STATIC_ENTRIES: Entry[] = [
	{ loc: '/', changefreq: 'weekly', priority: '1.0' },
	{ loc: '/blog', changefreq: 'daily', priority: '0.9' },
	{ loc: '/labs', changefreq: 'weekly', priority: '0.8' },
	{ loc: '/status', changefreq: 'always', priority: '0.6' },
	{ loc: '/legal', changefreq: 'monthly', priority: '0.3' },
	{ loc: '/privacy', changefreq: 'monthly', priority: '0.3' },
	{ loc: '/privacy/prospects', changefreq: 'monthly', priority: '0.3' },
	{ loc: '/terms', changefreq: 'monthly', priority: '0.3' },
	{ loc: '/cookies', changefreq: 'monthly', priority: '0.3' },
	{ loc: '/dpa', changefreq: 'monthly', priority: '0.3' },
	{ loc: '/aup', changefreq: 'monthly', priority: '0.3' },
	{ loc: '/security', changefreq: 'monthly', priority: '0.3' },
	{ loc: '/subprocessors', changefreq: 'monthly', priority: '0.3' }
];

function toXml(entries: Entry[]): string {
	const urls = entries
		.map((e) => {
			const lastmod = e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : '';
			return `  <url>\n    <loc>${SITE}${e.loc}</loc>${lastmod}\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`;
		})
		.join('\n');
	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export async function GET() {
	const posts = await getAllPosts();

	const blogEntries: Entry[] = posts
		.filter((p) => !p.has_benchmarks)
		.map((p) => ({
			loc: `/blog/${p.slug}`,
			lastmod: p.date,
			changefreq: 'monthly',
			priority: '0.7'
		}));

	const labsEntries: Entry[] = posts
		.filter((p) => p.has_benchmarks)
		.map((p) => ({
			loc: `/labs/blog/${p.slug}`,
			lastmod: p.date,
			changefreq: 'monthly',
			priority: '0.6'
		}));

	const body = toXml([...STATIC_ENTRIES, ...blogEntries, ...labsEntries]);

	return new Response(body, {
		headers: { 'Content-Type': 'application/xml' }
	});
}
