import { getAllPosts } from '$lib/content';
import { SITE_URL, metaDescription } from '$lib/seo';

export const prerender = true;

function esc(v: string): string {
	return v
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

export async function GET() {
	const posts = await getAllPosts();
	const items = posts
		.filter((p) => p.date)
		.map((p) => {
			const url = `${SITE_URL}${p.has_benchmarks ? '/labs/blog' : '/blog'}/${p.slug}`;
			const cats = [p.tag, ...p.keywords.slice(0, 5)].filter(Boolean);
			return `\t\t<item>
\t\t\t<title>${esc(p.title)}</title>
\t\t\t<link>${url}</link>
\t\t\t<guid isPermaLink="true">${url}</guid>
\t\t\t<pubDate>${new Date(p.date).toUTCString()}</pubDate>
\t\t\t<description>${esc(p.description || metaDescription(p.excerpt, 300))}</description>
${cats.map((c) => `\t\t\t<category>${esc(c)}</category>`).join('\n')}
\t\t</item>`;
		})
		.join('\n');

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
\t<channel>
\t\t<title>Rōmy Field Notes — Major Gifts, Stewardship &amp; Prospect Research</title>
\t\t<link>${SITE_URL}/blog</link>
\t\t<atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
\t\t<description>Field notes for nonprofit fundraisers on major gift cultivation, donor stewardship, planned giving and AI prospect research, from Rōmy.</description>
\t\t<language>en-us</language>
\t\t<image>
\t\t\t<url>${SITE_URL}/icon-logo.png</url>
\t\t\t<title>Rōmy Field Notes</title>
\t\t\t<link>${SITE_URL}/blog</link>
\t\t</image>
${posts[0]?.date ? `\t\t<lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>\n` : ''}${items}
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
