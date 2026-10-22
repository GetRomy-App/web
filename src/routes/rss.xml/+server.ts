import { getAllPosts } from '$lib/content';
import { SITE_URL } from '$lib/seo';

const esc = (v: string) =>
	v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function GET() {
	const posts = (await getAllPosts()).filter((p) => !p.has_benchmarks).slice(0, 50);
	const items = posts
		.map((p) => {
			const link = `${SITE_URL}/blog/${p.slug}`;
			return `\t<item>
\t\t<title>${esc(p.title)}</title>
\t\t<link>${link}</link>
\t\t<guid isPermaLink="true">${link}</guid>
\t\t<pubDate>${new Date(p.date).toUTCString()}</pubDate>
\t\t<category>${esc(p.tag)}</category>
\t\t<description>${esc(p.excerpt)}</description>
\t</item>`;
		})
		.join('\n');

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
\t<title>Rōmy Blog</title>
\t<link>${SITE_URL}/blog</link>
\t<description>Perspectives on nonprofit fundraising, donor retention, major gifts, and AI donor intelligence.</description>
\t<language>en-us</language>
\t<atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
</channel>
</rss>
`;
	return new Response(body, {
		headers: {
			'Content-Type': 'application/rss+xml; charset=utf-8',
			'Cache-Control': 'public, max-age=0, s-maxage=3600'
		}
	});
}
