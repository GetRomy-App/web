import { getAllPosts, postPath } from '$lib/content';
import { SITE_URL } from '$lib/seo';

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
	const posts = await getAllPosts();
	const newest = posts[0]?.date ? new Date(posts[0].date).toUTCString() : new Date().toUTCString();

	const items = posts
		.map((p) => {
			const url = SITE_URL + postPath(p);
			const date = p.date ? `\n\t\t\t<pubDate>${new Date(p.date).toUTCString()}</pubDate>` : '';
			const cats = [p.tag, ...p.keywords]
				.filter(Boolean)
				.map((c) => `\n\t\t\t<category>${esc(c)}</category>`)
				.join('');
			return `\t\t<item>
			<title>${esc(p.title)}</title>
			<link>${url}</link>
			<guid isPermaLink="true">${url}</guid>${date}
			<description>${esc(p.excerpt || p.seo_description)}</description>${cats}
		</item>`;
		})
		.join('\n');

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>Rōmy Blog — Major Gifts, Donor Research &amp; Nonprofit Fundraising</title>
		<link>${SITE_URL}/blog</link>
		<atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
		<description>Field notes and research on major gift fundraising, donor stewardship, prospect research, and AI donor intelligence for small nonprofits.</description>
		<language>en-us</language>
		<lastBuildDate>${newest}</lastBuildDate>
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
