import type { RequestHandler } from './$types';
import { getAllPosts } from '$lib/content';
import { getAllLegalPages } from '$lib/legal';

export const prerender = true;

const SITE = 'https://getromy.app';

const LEGAL_URL_OVERRIDE: Record<string, string> = {
	'prospect-privacy': '/privacy/prospects'
};

function isoDate(d: string): string {
	if (!d) return '';
	const dt = new Date(d);
	if (isNaN(dt.getTime())) return '';
	return dt.toISOString().slice(0, 10);
}

function escapeXml(s: string): string {
	return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

interface Entry {
	loc: string;
	lastmod?: string;
	changefreq?: string;
	priority?: string;
}

function urlTag({ loc, lastmod, changefreq, priority }: Entry): string {
	return [
		'  <url>',
		`    <loc>${escapeXml(loc)}</loc>`,
		lastmod ? `    <lastmod>${lastmod}</lastmod>` : '',
		changefreq ? `    <changefreq>${changefreq}</changefreq>` : '',
		priority ? `    <priority>${priority}</priority>` : '',
		'  </url>'
	]
		.filter(Boolean)
		.join('\n');
}

export const GET: RequestHandler = async () => {
	const posts = await getAllPosts();
	const legalPages = await getAllLegalPages();

	const entries: Entry[] = [
		{ loc: `${SITE}/`, changefreq: 'weekly', priority: '1.0' },
		{ loc: `${SITE}/blog`, changefreq: 'daily', priority: '0.8' },
		{ loc: `${SITE}/labs`, changefreq: 'weekly', priority: '0.7' },
		{ loc: `${SITE}/status`, changefreq: 'always', priority: '0.6' },
		{ loc: `${SITE}/legal`, changefreq: 'monthly', priority: '0.3' },
		{ loc: `${SITE}/privacy/request`, changefreq: 'yearly', priority: '0.2' }
	];

	for (const post of posts) {
		const path = post.has_benchmarks ? `/labs/blog/${post.slug}` : `/blog/${post.slug}`;
		entries.push({
			loc: `${SITE}${path}`,
			lastmod: isoDate(post.date),
			changefreq: 'monthly',
			priority: post.has_benchmarks ? '0.5' : '0.6'
		});
	}

	for (const page of legalPages) {
		const path = LEGAL_URL_OVERRIDE[page.slug] ?? `/${page.slug}`;
		entries.push({
			loc: `${SITE}${path}`,
			lastmod: isoDate(page.effective),
			changefreq: 'monthly',
			priority: '0.3'
		});
	}

	const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.map(urlTag).join('\n')}\n</urlset>\n`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};
