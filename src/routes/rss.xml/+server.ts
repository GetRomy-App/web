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

function rfc822(date: string): string | undefined {
	const d = new Date(date);
	return isNaN(d.getTime()) ? undefined : d.toUTCString();
}

/** /rss.xml — every blog and labs post, newest first. */
export async function GET() {
	const posts = await getAllPosts();

	const items = posts
		.map((post) => {
			const url = `${SITE_URL}${post.has_benchmarks ? '/labs/blog/' : '/blog/'}${post.slug}`;
			const pubDate = rfc822(post.date);
			return [
				'\t\t<item>',
				`\t\t\t<title>${xmlEscape(post.title)}</title>`,
				`\t\t\t<link>${xmlEscape(url)}</link>`,
				`\t\t\t<guid isPermaLink="true">${xmlEscape(url)}</guid>`,
				pubDate ? `\t\t\t<pubDate>${pubDate}</pubDate>` : null,
				post.tag ? `\t\t\t<category>${xmlEscape(post.tag)}</category>` : null,
				`\t\t\t<description>${xmlEscape(post.excerpt || post.seoDescription)}</description>`,
				'\t\t</item>'
			]
				.filter(Boolean)
				.join('\n');
		})
		.join('\n');

	const lastBuild = posts[0] ? rfc822(posts[0].date) : undefined;

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>Rōmy Blog</title>
		<link>${SITE_URL}/blog</link>
		<description>Field notes and research on nonprofit fundraising, major gifts, donor stewardship, prospect research, and purpose-built AI.</description>
		<language>en-us</language>
		<atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${lastBuild ? `\t\t<lastBuildDate>${lastBuild}</lastBuildDate>\n` : ''}${items}
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
