import { getAllPosts } from '$lib/content';
import { metaDescription } from '$lib/seo';

export const prerender = true;

const SITE = 'https://getromy.app';

function xmlEscape(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

export async function GET() {
	const posts = (await getAllPosts()).filter((p) => !p.has_benchmarks);
	const items = posts
		.map((p) => {
			const d = new Date(p.date);
			const pubDate = isNaN(d.getTime()) ? '' : `\n\t\t\t<pubDate>${d.toUTCString()}</pubDate>`;
			return `\t\t<item>
\t\t\t<title>${xmlEscape(p.title)}</title>
\t\t\t<link>${SITE}/blog/${p.slug}</link>
\t\t\t<guid isPermaLink="true">${SITE}/blog/${p.slug}</guid>${pubDate}
\t\t\t<category>${xmlEscape(p.tag)}</category>
\t\t\t<description>${xmlEscape(metaDescription(p.excerpt, 300))}</description>
\t\t</item>`;
		})
		.join('\n');

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
\t<channel>
\t\t<title>Rōmy Blog</title>
\t\t<link>${SITE}/blog</link>
\t\t<description>Field notes and research on major gifts, donor research, and AI prospect research for small nonprofit fundraising teams.</description>
\t\t<language>en-us</language>
\t\t<atom:link href="${SITE}/blog/rss.xml" rel="self" type="application/rss+xml" />
${items}
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
