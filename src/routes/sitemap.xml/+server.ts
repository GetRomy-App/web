import { getAllPosts } from '$lib/content';
import { getAllLegalPages } from '$lib/legal';

export const prerender = true;

const SITE = 'https://getromy.app';

interface Entry {
	loc: string;
	lastmod?: string;
	changefreq?: string;
	priority?: string;
}

function toISODate(value: string | undefined): string | undefined {
	if (!value) return undefined;
	const d = new Date(value);
	if (isNaN(d.getTime())) return undefined;
	return d.toISOString().slice(0, 10);
}

export async function GET() {
	const [posts, legalPages] = await Promise.all([getAllPosts(), getAllLegalPages()]);

	const fieldPosts = posts.filter((p) => !p.has_benchmarks);
	const labsPosts = posts.filter((p) => p.has_benchmarks);
	const latestPostDate = toISODate(posts[0]?.date);

	const entries: Entry[] = [
		{ loc: `${SITE}/`, lastmod: latestPostDate, changefreq: 'weekly', priority: '1.0' },
		{
			loc: `${SITE}/blog`,
			lastmod: toISODate(fieldPosts[0]?.date),
			changefreq: 'weekly',
			priority: '0.8'
		},
		{
			loc: `${SITE}/labs`,
			lastmod: toISODate(labsPosts[0]?.date),
			changefreq: 'weekly',
			priority: '0.7'
		},
		{ loc: `${SITE}/status`, changefreq: 'always', priority: '0.6' },
		{ loc: `${SITE}/legal`, changefreq: 'monthly', priority: '0.3' },
		{ loc: `${SITE}/privacy/request`, changefreq: 'yearly', priority: '0.2' }
	];

	for (const post of fieldPosts) {
		entries.push({
			loc: `${SITE}/blog/${post.slug}`,
			lastmod: toISODate(post.date),
			changefreq: 'monthly',
			priority: '0.7'
		});
	}

	for (const post of labsPosts) {
		entries.push({
			loc: `${SITE}/labs/blog/${post.slug}`,
			lastmod: toISODate(post.date),
			changefreq: 'monthly',
			priority: '0.6'
		});
	}

	const legalUrlOverride: Record<string, string> = {
		'prospect-privacy': '/privacy/prospects'
	};

	for (const page of legalPages) {
		const path = legalUrlOverride[page.slug] ?? `/${page.slug}`;
		entries.push({
			loc: `${SITE}${path}`,
			lastmod: toISODate(page.effective),
			changefreq: 'yearly',
			priority: '0.3'
		});
	}

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
	.map(
		(e) => `  <url>
    <loc>${e.loc}</loc>
${e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>\n` : ''}${e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>\n` : ''}${e.priority ? `    <priority>${e.priority}</priority>\n` : ''}  </url>`
	)
	.join('\n')}
</urlset>
`;

	return new Response(body, {
		headers: { 'Content-Type': 'application/xml' }
	});
}
