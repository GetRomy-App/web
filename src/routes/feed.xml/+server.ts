import { getAllPosts } from '$lib/content';
import type { RequestHandler } from './$types';

export const prerender = true;

const BASE = 'https://getromy.app';
const SITE_NAME = 'Rōmy Blog';
const SITE_DESCRIPTION =
	'Insights on AI donor research, nonprofit fundraising, and prospect intelligence from the team at Rōmy.';

function escapeXml(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

export const GET: RequestHandler = async () => {
	const posts = await getAllPosts();

	const items = posts
		.slice(0, 50)
		.map((post) => {
			const url = `${BASE}/blog/${post.slug}`;
			const pubDate = post.date ? new Date(post.date + 'T12:00:00Z').toUTCString() : '';
			return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(post.tag)}</category>
      <author>solomon@getromy.app (Rōmy)</author>
    </item>`;
		})
		.join('\n');

	const lastBuildDate = posts[0]?.date
		? new Date(posts[0].date + 'T12:00:00Z').toUTCString()
		: new Date().toUTCString();

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${BASE}/blog</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${BASE}/feed.xml" rel="self" type="application/rss+xml" />
    <managingEditor>solomon@getromy.app (Rōmy)</managingEditor>
    <webMaster>solomon@getromy.app (Rōmy)</webMaster>
    <ttl>60</ttl>
    <image>
      <url>${BASE}/favicon-96x96.png</url>
      <title>${escapeXml(SITE_NAME)}</title>
      <link>${BASE}/blog</link>
    </image>
${items}
  </channel>
</rss>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/rss+xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600, s-maxage=3600'
		}
	});
};
