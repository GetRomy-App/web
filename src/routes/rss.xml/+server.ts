import { getAllPosts } from '$lib/content';
import { SITE_URL, snippet } from '$lib/seo';

export const prerender = true;

function esc(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

export async function GET() {
	const posts = await getAllPosts();
	const items = posts
		.filter((p) => p.date)
		.map((p) => {
			const url = `${SITE_URL}${p.has_benchmarks ? '/labs/blog' : '/blog'}/${p.slug}`;
			const categories = [p.tag, ...p.keywords]
				.filter(Boolean)
				.map((c) => `\t\t\t<category>${esc(c)}</category>`)
				.join('\n');
			return [
				'\t\t<item>',
				`\t\t\t<title>${esc(p.title)}</title>`,
				`\t\t\t<link>${url}</link>`,
				`\t\t\t<guid isPermaLink="true">${url}</guid>`,
				`\t\t\t<pubDate>${new Date(p.date).toUTCString()}</pubDate>`,
				`\t\t\t<description>${esc(p.description || snippet(p.excerpt, 300))}</description>`,
				categories,
				'\t\t</item>'
			]
				.filter(Boolean)
				.join('\n');
		})
		.join('\n');

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>Rōmy Blog — Nonprofit Fundraising &amp; Prospect Research</title>
		<link>${SITE_URL}/blog</link>
		<atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
		<description>Field notes, research and benchmarks on major gifts, donor stewardship and AI prospect research for small nonprofits.</description>
		<language>en-us</language>
		<lastBuildDate>${new Date(posts[0]?.date || Date.now()).toUTCString()}</lastBuildDate>
		<image>
			<url>${SITE_URL}/icon-logo.png</url>
			<title>Rōmy Blog — Nonprofit Fundraising &amp; Prospect Research</title>
			<link>${SITE_URL}/blog</link>
		</image>
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
