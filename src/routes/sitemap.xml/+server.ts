import fs from 'fs/promises';
import path from 'path';
import { getAllPosts } from '$lib/content';
import { getAllLegalPages } from '$lib/legal';

export const prerender = true;

const SITE = 'https://getromy.app';

interface Entry {
	path: string;
	lastmod?: string;
	changefreq: string;
	priority: string;
}

/** Legal route paths don't all match their content slug (prospect-privacy lives at /privacy/prospects). */
const LEGAL_ROUTES: Record<string, string> = {
	privacy: '/privacy',
	'prospect-privacy': '/privacy/prospects',
	terms: '/terms',
	aup: '/aup',
	cookies: '/cookies',
	dpa: '/dpa',
	security: '/security',
	subprocessors: '/subprocessors'
};

/** Normalise a frontmatter date to YYYY-MM-DD, dropping anything unparseable. */
function toDate(value: string | undefined): string | undefined {
	if (!value) return undefined;
	const d = new Date(value);
	if (isNaN(d.getTime())) return undefined;
	return d.toISOString().slice(0, 10);
}

function newest(dates: (string | undefined)[]): string | undefined {
	return dates.filter((d): d is string => Boolean(d)).sort((a, b) => (a < b ? 1 : -1))[0];
}

async function statusLastmod(): Promise<string | undefined> {
	try {
		const raw = await fs.readFile(
			path.join(process.cwd(), 'data', 'status', 'history.json'),
			'utf-8'
		);
		return toDate(JSON.parse(raw).generatedAt);
	} catch {
		return undefined;
	}
}

function xmlEscape(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

export async function GET() {
	const [allPosts, legalPages, statusDate] = await Promise.all([
		getAllPosts(),
		getAllLegalPages(),
		statusLastmod()
	]);

	const blogPosts = allPosts.filter((p) => !p.has_benchmarks);
	const labsPosts = allPosts.filter((p) => p.has_benchmarks);
	const legalNewest = newest(legalPages.map((p) => toDate(p.effective)));

	const entries: Entry[] = [
		{
			path: '/',
			lastmod: newest(allPosts.map((p) => toDate(p.date))),
			changefreq: 'weekly',
			priority: '1.0'
		},
		{
			path: '/blog',
			lastmod: newest(blogPosts.map((p) => toDate(p.date))),
			changefreq: 'weekly',
			priority: '0.9'
		},
		{
			path: '/labs',
			lastmod: newest(labsPosts.map((p) => toDate(p.date))),
			changefreq: 'weekly',
			priority: '0.8'
		},
		{ path: '/status', lastmod: statusDate, changefreq: 'daily', priority: '0.5' },
		{ path: '/legal', lastmod: legalNewest, changefreq: 'yearly', priority: '0.4' },
		{ path: '/privacy/request', lastmod: legalNewest, changefreq: 'yearly', priority: '0.4' }
	];

	for (const post of blogPosts) {
		entries.push({
			path: `/blog/${post.slug}`,
			lastmod: toDate(post.date),
			changefreq: 'monthly',
			priority: '0.7'
		});
	}

	for (const post of labsPosts) {
		entries.push({
			path: `/labs/blog/${post.slug}`,
			lastmod: toDate(post.date),
			changefreq: 'monthly',
			priority: '0.7'
		});
	}

	for (const page of legalPages) {
		const route = LEGAL_ROUTES[page.slug];
		if (!route) continue;
		entries.push({
			path: route,
			lastmod: toDate(page.effective),
			changefreq: 'yearly',
			priority: '0.3'
		});
	}

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
	.map((entry) =>
		[
			'\t<url>',
			`\t\t<loc>${xmlEscape(SITE + entry.path)}</loc>`,
			entry.lastmod ? `\t\t<lastmod>${entry.lastmod}</lastmod>` : null,
			`\t\t<changefreq>${entry.changefreq}</changefreq>`,
			`\t\t<priority>${entry.priority}</priority>`,
			'\t</url>'
		]
			.filter(Boolean)
			.join('\n')
	)
	.join('\n')}
</urlset>
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=0, s-maxage=3600'
		}
	});
}
