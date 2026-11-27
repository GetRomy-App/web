import { loadFullPosts, postUrl } from '$lib/feeds';
import { SITE_URL } from '$lib/seo';

export const prerender = true;

function esc(v: string): string {
	return v
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

function cdata(v: string): string {
	return `<![CDATA[${v.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;
}

function rfc822(d: string): string {
	const t = new Date(d);
	return isNaN(t.getTime()) ? '' : t.toUTCString();
}

export async function GET() {
	const posts = await loadFullPosts();
	const items = posts
		.map((p) => {
			const url = postUrl(p);
			const date = rfc822(p.date);
			return [
				'\t\t<item>',
				`\t\t\t<title>${esc(p.title)}</title>`,
				`\t\t\t<link>${url}</link>`,
				`\t\t\t<guid isPermaLink="true">${url}</guid>`,
				date ? `\t\t\t<pubDate>${date}</pubDate>` : null,
				`\t\t\t<category>${esc(p.tag)}</category>`,
				`\t\t\t<description>${cdata(p.excerpt)}</description>`,
				`\t\t\t<content:encoded>${cdata(p.content)}</content:encoded>`,
				'\t\t</item>'
			]
				.filter(Boolean)
				.join('\n');
		})
		.join('\n');

	const lastBuild = posts[0] ? rfc822(posts[0].date) : '';
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
\t<channel>
\t\t<title>Rōmy Blog — Nonprofit Fundraising, Major Gifts &amp; Prospect Research</title>
\t\t<link>${SITE_URL}/blog</link>
\t\t<atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
\t\t<description>Field notes and research on major gift fundraising, donor stewardship, prospect research and AI donor intelligence for small nonprofits.</description>
\t\t<language>en-us</language>
${lastBuild ? `\t\t<lastBuildDate>${lastBuild}</lastBuildDate>\n` : ''}\t\t<image>
\t\t\t<url>${SITE_URL}/icon-logo.png</url>
\t\t\t<title>Rōmy Blog</title>
\t\t\t<link>${SITE_URL}/blog</link>
\t\t</image>
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
