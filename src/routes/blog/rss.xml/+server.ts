import { getAllPosts } from '$lib/content';
import { SITE_URL, metaDescription } from '$lib/seo';

export const prerender = true;

function esc(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

/** RSS 2.0 feed of every post (blog + labs) — feed readers, aggregators and AI crawlers. */
export async function GET() {
	const posts = await getAllPosts();
	const items = posts
		.map((p) => {
			const url = `${SITE_URL}${p.has_benchmarks ? '/labs/blog/' : '/blog/'}${p.slug}`;
			const date = new Date(p.date);
			return [
				'\t\t<item>',
				`\t\t\t<title>${esc(p.title)}</title>`,
				`\t\t\t<link>${url}</link>`,
				`\t\t\t<guid isPermaLink="true">${url}</guid>`,
				isNaN(date.getTime()) ? null : `\t\t\t<pubDate>${date.toUTCString()}</pubDate>`,
				p.tag ? `\t\t\t<category>${esc(p.tag)}</category>` : null,
				`\t\t\t<description>${esc(metaDescription(p.excerpt, 500))}</description>`,
				'\t\t</item>'
			]
				.filter(Boolean)
				.join('\n');
		})
		.join('\n');

	const latest = posts[0] ? new Date(posts[0].date) : new Date();

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>Rōmy Blog — Major Gift Fundraising &amp; Prospect Research</title>
		<link>${SITE_URL}/blog</link>
		<atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
		<description>Field notes and research on major gift fundraising, donor stewardship and prospect research for small nonprofits, from the team behind Rōmy.</description>
		<language>en-us</language>
		<copyright>GetRomy LLC</copyright>
		<image>
			<url>${SITE_URL}/icon-logo.png</url>
			<title>Rōmy Blog — Major Gift Fundraising &amp; Prospect Research</title>
			<link>${SITE_URL}/blog</link>
		</image>
		<lastBuildDate>${latest.toUTCString()}</lastBuildDate>
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
