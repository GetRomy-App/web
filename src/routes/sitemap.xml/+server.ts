import { getAllPosts } from '$lib/content';

export const prerender = true;

function urlEntry(loc: string, lastmod: string, changefreq: string, priority: string) {
	return `\n  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

export async function GET() {
	const posts = await getAllPosts();
	const blogPosts = posts.filter((p) => !p.has_benchmarks);
	const labsPosts = posts.filter((p) => p.has_benchmarks);

	const latestDate = blogPosts[0]?.date ?? '2026-06-23';

	const staticEntries = [
		urlEntry('https://getromy.app/', '2026-06-23', 'weekly', '1.0'),
		urlEntry('https://getromy.app/blog', latestDate, 'daily', '0.9'),
		urlEntry('https://getromy.app/labs', '2026-06-23', 'weekly', '0.8'),
		urlEntry('https://getromy.app/privacy', '2026-01-01', 'yearly', '0.3'),
		urlEntry('https://getromy.app/terms', '2026-01-01', 'yearly', '0.3'),
		urlEntry('https://getromy.app/security', '2026-01-01', 'yearly', '0.3'),
		urlEntry('https://getromy.app/cookies', '2026-01-01', 'yearly', '0.3'),
		urlEntry('https://getromy.app/dpa', '2026-01-01', 'yearly', '0.3'),
		urlEntry('https://getromy.app/aup', '2026-01-01', 'yearly', '0.3'),
		urlEntry('https://getromy.app/subprocessors', '2026-01-01', 'yearly', '0.3')
	];

	const blogEntries = blogPosts.map((p) =>
		urlEntry(`https://getromy.app/blog/${p.slug}`, p.date, 'monthly', '0.7')
	);

	const labsEntries = labsPosts.map((p) =>
		urlEntry(`https://getromy.app/labs/blog/${p.slug}`, p.date, 'monthly', '0.7')
	);

	const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...staticEntries, ...blogEntries, ...labsEntries].join('')}\n</urlset>`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
}
