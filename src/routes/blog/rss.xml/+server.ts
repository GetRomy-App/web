import { getAllPosts } from '$lib/content';
import { SITE_URL, metaDescription } from '$lib/seo';

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
	const posts = (await getAllPosts()).filter((p) => !p.has_benchmarks);
	const lastBuild = posts[0] ? new Date(posts[0].date).toUTCString() : new Date().toUTCString();

	const items = posts
		.map((post) => {
			const url = `${SITE_URL}/blog/${post.slug}`;
			return [
				'\t\t<item>',
				`\t\t\t<title>${xmlEscape(post.title)}</title>`,
				`\t\t\t<link>${url}</link>`,
				`\t\t\t<guid isPermaLink="true">${url}</guid>`,
				`\t\t\t<pubDate>${new Date(post.date).toUTCString()}</pubDate>`,
				post.tag ? `\t\t\t<category>${xmlEscape(post.tag)}</category>` : null,
				`\t\t\t<description>${xmlEscape(metaDescription(post.excerpt, 300))}</description>`,
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
		<description>Field notes and perspectives on nonprofit fundraising, prospect research, and donor intelligence.</description>
		<language>en-us</language>
		<lastBuildDate>${lastBuild}</lastBuildDate>
		<atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
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
