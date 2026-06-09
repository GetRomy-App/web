import { getAllPosts } from '$lib/content';

const BASE = 'https://getromy.app';
const TITLE = 'Rōmy Blog — Donor Intelligence & Nonprofit Fundraising';
const DESCRIPTION =
	'Technical deep-dives, research findings, and perspectives on nonprofit fundraising, prospect research, and purpose-built AI donor intelligence.';

function escapeXml(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

export async function GET() {
	const posts = await getAllPosts();
	const blogPosts = posts.filter((p) => !p.has_benchmarks);
	const lastBuildDate = blogPosts[0]?.date
		? new Date(blogPosts[0].date).toUTCString()
		: new Date().toUTCString();

	const items = blogPosts
		.map((post) => {
			const url = `${BASE}/blog/${post.slug}`;
			const pubDate = post.date ? new Date(post.date).toUTCString() : '';
			return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(post.tag)}</category>
    </item>`;
		})
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(TITLE)}</title>
    <link>${BASE}/blog</link>
    <description>${escapeXml(DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${BASE}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${BASE}/og-image.jpg</url>
      <title>${escapeXml(TITLE)}</title>
      <link>${BASE}/blog</link>
    </image>
${items}
  </channel>
</rss>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/rss+xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
}
