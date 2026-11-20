import { getAllPosts } from '$lib/content';
import { postUrl } from '$lib/llms';
import { SITE_URL, clip } from '$lib/seo';

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
	const latest = posts[0]?.date ? new Date(posts[0].date).toUTCString() : new Date().toUTCString();

	const items = posts
		.map((p) => {
			const url = postUrl(p);
			const cats = [p.tag, ...p.keywords].filter(Boolean);
			return `		<item>
			<title>${esc(p.title)}</title>
			<link>${url}</link>
			<guid isPermaLink="true">${url}</guid>
			${p.date ? `<pubDate>${new Date(p.date).toUTCString()}</pubDate>` : ''}
			<description>${esc(clip(p.seo_description || p.excerpt, 400))}</description>
${cats.map((c) => `			<category>${esc(c)}</category>`).join('\n')}
		</item>`;
		})
		.join('\n');

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>Rōmy Blog — Major Gifts, Donor Stewardship &amp; Prospect Research</title>
		<link>${SITE_URL}/blog</link>
		<atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
		<description>Field notes and research on major gift fundraising, donor stewardship and AI prospect research for small nonprofits.</description>
		<language>en-us</language>
		<lastBuildDate>${latest}</lastBuildDate>
		<image>
			<url>${SITE_URL}/icon-logo.png</url>
			<title>Rōmy Blog</title>
			<link>${SITE_URL}/blog</link>
		</image>
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
