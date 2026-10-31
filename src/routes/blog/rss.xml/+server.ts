import { getAllPosts } from '$lib/content';
import { SITE, metaDescription } from '$lib/seo';

export const prerender = true;

function esc(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

export async function GET() {
	const posts = (await getAllPosts()).slice(0, 50);
	const built = posts[0] ? new Date(posts[0].date).toUTCString() : new Date().toUTCString();

	const items = posts
		.map((p) => {
			const url = `${SITE}${p.has_benchmarks ? '/labs/blog/' : '/blog/'}${p.slug}`;
			return [
				'\t\t<item>',
				`\t\t\t<title>${esc(p.title)}</title>`,
				`\t\t\t<link>${esc(url)}</link>`,
				`\t\t\t<guid isPermaLink="true">${esc(url)}</guid>`,
				`\t\t\t<pubDate>${new Date(p.date).toUTCString()}</pubDate>`,
				p.tag ? `\t\t\t<category>${esc(p.tag)}</category>` : null,
				`\t\t\t<description>${esc(metaDescription(p.excerpt, 300))}</description>`,
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
		<link>${SITE}/blog</link>
		<description>Field notes, research, and perspectives on nonprofit fundraising, major gifts, prospect research, and purpose-built AI.</description>
		<language>en-us</language>
		<lastBuildDate>${built}</lastBuildDate>
		<atom:link href="${SITE}/blog/rss.xml" rel="self" type="application/rss+xml" />
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
