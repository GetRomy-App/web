import { getAllPosts } from '$lib/content';

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
	const built = posts[0]?.date ? new Date(posts[0].date).toUTCString() : new Date().toUTCString();

	const items = posts
		.map((p) => {
			const link = `${SITE}/blog/${p.slug}`;
			return [
				'\t\t<item>',
				`\t\t\t<title>${xmlEscape(p.title)}</title>`,
				`\t\t\t<link>${link}</link>`,
				`\t\t\t<guid isPermaLink="true">${link}</guid>`,
				p.date ? `\t\t\t<pubDate>${new Date(p.date).toUTCString()}</pubDate>` : null,
				p.tag ? `\t\t\t<category>${xmlEscape(p.tag)}</category>` : null,
				`\t\t\t<description>${xmlEscape(p.excerpt)}</description>`,
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
		<description>Field notes and research on donor research, major gift fundraising, and purpose-built AI for small nonprofits.</description>
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
