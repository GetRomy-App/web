import { getAllPosts } from '$lib/content';
import { SITE_URL } from '$lib/seo';

export const prerender = true;

function esc(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

/** RSS 2.0 feed of every post (blog + labs) — speeds up discovery and syndication. */
export async function GET() {
	const posts = await getAllPosts();
	const items = posts
		.filter((p) => p.date && !isNaN(new Date(p.date).getTime()))
		.map((p) => {
			const url = p.has_benchmarks
				? `${SITE_URL}/labs/blog/${p.slug}`
				: `${SITE_URL}/blog/${p.slug}`;
			return `\t\t<item>
\t\t\t<title>${esc(p.title)}</title>
\t\t\t<link>${url}</link>
\t\t\t<guid isPermaLink="true">${url}</guid>
\t\t\t<pubDate>${new Date(p.date).toUTCString()}</pubDate>
\t\t\t<category>${esc(p.tag)}</category>
\t\t\t<description>${esc(p.excerpt)}</description>
\t\t</item>`;
		});

	const lastBuild = posts[0]?.date
		? new Date(posts[0].date).toUTCString()
		: new Date().toUTCString();
	const title = 'Rōmy Blog — Major Gift Fundraising &amp; Prospect Research';

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
\t<channel>
\t\t<title>${title}</title>
\t\t<link>${SITE_URL}/blog</link>
\t\t<atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
\t\t<description>Field notes and research on major gift fundraising, donor prospect research, and AI for small nonprofits.</description>
\t\t<language>en-us</language>
\t\t<lastBuildDate>${lastBuild}</lastBuildDate>
\t\t<image>
\t\t\t<url>${SITE_URL}/icon-logo.png</url>
\t\t\t<title>${title}</title>
\t\t\t<link>${SITE_URL}/blog</link>
\t\t</image>
${items.join('\n')}
\t</channel>
</rss>
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/rss+xml; charset=utf-8',
			'Cache-Control': 'public, max-age=0, s-maxage=3600'
		}
	});
}
