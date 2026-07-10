import type { RequestHandler } from './$types';
import { getAllPosts } from '$lib/content';
import { getAllLegalPages } from '$lib/legal';

export const prerender = true;

const SITE = 'https://getromy.app';

// Mirrors the slug -> path override in src/routes/legal/+page.svelte.
const LEGAL_URL_OVERRIDE: Record<string, string> = {
	'prospect-privacy': '/privacy/prospects'
};

interface UrlEntry {
	loc: string;
	lastmod?: string;
	changefreq?: string;
	priority?: string;
}

function toIso(date: string): string | undefined {
	if (!date) return undefined;
	const d = new Date(date);
	return isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
}

export const GET: RequestHandler = async () => {
	const [allPosts, legalPages] = await Promise.all([getAllPosts(), getAllLegalPages()]);

	const blogPosts = allPosts.filter((p) => !p.has_benchmarks);
	const labsPosts = allPosts.filter((p) => p.has_benchmarks);

	const latestBlogDate = blogPosts.reduce<string | undefined>((max, p) => {
		const iso = toIso(p.date);
		return iso && (!max || iso > max) ? iso : max;
	}, undefined);

	const latestLabsDate = labsPosts.reduce<string | undefined>((max, p) => {
		const iso = toIso(p.date);
		return iso && (!max || iso > max) ? iso : max;
	}, undefined);

	const entries: UrlEntry[] = [
		{ loc: '/', changefreq: 'weekly', priority: '1.0' },
		{ loc: '/blog', lastmod: latestBlogDate, changefreq: 'daily', priority: '0.9' },
		{ loc: '/labs', lastmod: latestLabsDate, changefreq: 'weekly', priority: '0.8' },
		{ loc: '/status', changefreq: 'always', priority: '0.5' },
		{ loc: '/legal', changefreq: 'monthly', priority: '0.3' },
		{ loc: '/privacy/request', changefreq: 'yearly', priority: '0.2' }
	];

	for (const post of blogPosts) {
		entries.push({
			loc: `/blog/${post.slug}`,
			lastmod: toIso(post.date),
			changefreq: 'monthly',
			priority: '0.7'
		});
	}

	for (const post of labsPosts) {
		entries.push({
			loc: `/labs/blog/${post.slug}`,
			lastmod: toIso(post.date),
			changefreq: 'monthly',
			priority: '0.6'
		});
	}

	for (const page of legalPages) {
		entries.push({
			loc: LEGAL_URL_OVERRIDE[page.slug] ?? `/${page.slug}`,
			lastmod: toIso(page.effective),
			changefreq: 'yearly',
			priority: '0.3'
		});
	}

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
	.map(
		(e) => `  <url>
    <loc>${SITE}${e.loc}</loc>
${e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>\n` : ''}${e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>\n` : ''}${e.priority ? `    <priority>${e.priority}</priority>\n` : ''}  </url>`
	)
	.join('\n')}
</urlset>
`;

	return new Response(body, {
		headers: { 'Content-Type': 'application/xml' }
	});
};
