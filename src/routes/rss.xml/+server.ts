import { getAllPosts } from '$lib/content';
import { SITE_URL, plainText } from '$lib/seo';
import { postUrl } from '$lib/llms';

export const prerender = true;

function esc(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function rfc822(value: string): string | null {
	const d = new Date(value);
	return isNaN(d.getTime()) ? null : d.toUTCString();
}

export async function GET() {
	const posts = await getAllPosts();
	const latest = posts.map((p) => rfc822(p.date)).find(Boolean);

	const items = posts
		.map((post) => {
			const url = postUrl(post);
			const date = rfc822(post.date);
			return [
				'\t\t<item>',
				`\t\t\t<title>${esc(post.title)}</title>`,
				`\t\t\t<link>${esc(url)}</link>`,
				`\t\t\t<guid isPermaLink="true">${esc(url)}</guid>`,
				date ? `\t\t\t<pubDate>${date}</pubDate>` : null,
				post.tag ? `\t\t\t<category>${esc(post.tag)}</category>` : null,
				`\t\t\t<description>${esc(plainText(post.excerpt))}</description>`,
				'\t\t</item>'
			]
				.filter(Boolean)
				.join('\n');
		})
		.join('\n');

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>Rōmy Blog — Major Gift Fundraising &amp; Prospect Research</title>
		<link>${SITE_URL}/blog</link>
		<atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
		<description>Field notes and research on major gift fundraising, prospect research, donor stewardship, and AI donor intelligence for small nonprofits.</description>
		<language>en-us</language>
		<image>
			<url>${SITE_URL}/icon-logo.png</url>
			<title>Rōmy</title>
			<link>${SITE_URL}</link>
		</image>
${latest ? `\t\t<lastBuildDate>${latest}</lastBuildDate>\n` : ''}${items}
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
