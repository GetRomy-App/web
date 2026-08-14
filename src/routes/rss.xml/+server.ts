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

function toRfc822(dateStr: string): string {
	const d = new Date(dateStr);
	if (isNaN(d.getTime())) return new Date().toUTCString();
	return d.toUTCString();
}

export async function GET() {
	const allPosts = await getAllPosts();
	const posts = allPosts.filter((p) => !p.has_benchmarks);

	const items = posts
		.map((post) => {
			const url = `${SITE}/blog/${post.slug}`;
			return [
				'\t\t<item>',
				`\t\t\t<title>${xmlEscape(post.title)}</title>`,
				`\t\t\t<link>${xmlEscape(url)}</link>`,
				`\t\t\t<guid isPermaLink="true">${xmlEscape(url)}</guid>`,
				`\t\t\t<pubDate>${toRfc822(post.date)}</pubDate>`,
				post.tag ? `\t\t\t<category>${xmlEscape(post.tag)}</category>` : null,
				post.excerpt ? `\t\t\t<description>${xmlEscape(post.excerpt)}</description>` : null,
				'\t\t</item>'
			]
				.filter(Boolean)
				.join('\n');
		})
		.join('\n');

	const lastBuildDate = posts[0] ? toRfc822(posts[0].date) : new Date().toUTCString();

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>Rōmy Blog</title>
		<link>${SITE}/blog</link>
		<description>Technical deep-dives, research findings, and perspectives on nonprofit fundraising, prospect research, and purpose-built AI.</description>
		<language>en-us</language>
		<lastBuildDate>${lastBuildDate}</lastBuildDate>
		<atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
${items}
	</channel>
</rss>
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/rss+xml',
			'Cache-Control': 'public, max-age=0, s-maxage=3600'
		}
	});
}
