import { getAllPosts } from '$lib/content';
import { SITE_URL } from '$lib/seo';

export const prerender = true;

function xmlEscape(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

export async function GET() {
	const posts = (await getAllPosts()).filter((p) => !p.has_benchmarks).slice(0, 50);

	const items = posts
		.map((post) => {
			const link = `${SITE_URL}/blog/${post.slug}`;
			const pubDate = new Date(post.date);
			return [
				'\t\t<item>',
				`\t\t\t<title>${xmlEscape(post.title)}</title>`,
				`\t\t\t<link>${link}</link>`,
				`\t\t\t<guid isPermaLink="true">${link}</guid>`,
				isNaN(pubDate.getTime()) ? null : `\t\t\t<pubDate>${pubDate.toUTCString()}</pubDate>`,
				`\t\t\t<category>${xmlEscape(post.tag)}</category>`,
				`\t\t\t<description>${xmlEscape(post.excerpt)}</description>`,
				'\t\t</item>'
			]
				.filter(Boolean)
				.join('\n');
		})
		.join('\n');

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>Rōmy Blog</title>
		<link>${SITE_URL}/blog</link>
		<description>Field notes and research on major donor prospecting, stewardship and AI-powered prospect research for small nonprofits.</description>
		<language>en-us</language>
		<atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
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
