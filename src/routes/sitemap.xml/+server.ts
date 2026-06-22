import type { RequestHandler } from '@sveltejs/kit';
import { getAllPosts } from '$lib/content';

export const prerender = true;

const SITE = 'https://getromy.app';

function url(
	loc: string,
	lastmod: string,
	changefreq: string,
	priority: string
): string {
	return `\t<url>
\t\t<loc>${SITE}${loc}</loc>
\t\t<lastmod>${lastmod}</lastmod>
\t\t<changefreq>${changefreq}</changefreq>
\t\t<priority>${priority}</priority>
\t</url>`;
}

export const GET: RequestHandler = async () => {
	const posts = await getAllPosts();

	const blogPosts = posts.filter((p) => !p.has_benchmarks);
	const labsPosts = posts.filter((p) => p.has_benchmarks);

	const staticUrls = [
		url('/', '2026-06-22', 'weekly', '1.0'),
		url('/blog', '2026-06-22', 'weekly', '0.9'),
		url('/labs', '2026-06-22', 'weekly', '0.9')
	];

	const blogUrls = blogPosts.map((p) =>
		url(`/blog/${p.slug}`, p.date || '2026-06-22', 'monthly', '0.8')
	);

	const labsUrls = labsPosts.map((p) =>
		url(`/labs/blog/${p.slug}`, p.date || '2026-06-22', 'monthly', '0.8')
	);

	const legalUrls = [
		url('/privacy', '2026-01-01', 'yearly', '0.3'),
		url('/terms', '2026-01-01', 'yearly', '0.3'),
		url('/cookies', '2026-01-01', 'yearly', '0.3'),
		url('/dpa', '2026-01-01', 'yearly', '0.3'),
		url('/security', '2026-01-01', 'yearly', '0.3'),
		url('/aup', '2026-01-01', 'yearly', '0.3'),
		url('/subprocessors', '2026-06-22', 'monthly', '0.4')
	];

	const allUrls = [...staticUrls, ...blogUrls, ...labsUrls, ...legalUrls];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};
