import { getAllPosts } from '$lib/content';
import { SITE_URL, postDescription } from '$lib/seo';

export const prerender = true;

function xml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function rfc822(value: string): string | undefined {
	const d = new Date(value);
	return isNaN(d.getTime()) ? undefined : d.toUTCString();
}

const CHANNEL_TITLE = 'Rōmy Blog: Major Gift Fundraising &amp; Prospect Research';

/** RSS 2.0 feed of every post on /blog and /labs. */
export async function GET() {
	const posts = await getAllPosts();
	const latest = posts[0] ? rfc822(posts[0].date) : undefined;

	const items = posts
		.map((p) => {
			const link = `${SITE_URL}${p.has_benchmarks ? '/labs/blog' : '/blog'}/${p.slug}`;
			const date = rfc822(p.date);
			return [
				'\t\t<item>',
				`\t\t\t<title>${xml(p.title)}</title>`,
				`\t\t\t<link>${link}</link>`,
				`\t\t\t<guid isPermaLink="true">${link}</guid>`,
				date ? `\t\t\t<pubDate>${date}</pubDate>` : null,
				p.tag ? `\t\t\t<category>${xml(p.tag)}</category>` : null,
				`\t\t\t<description>${xml(postDescription(p, 300))}</description>`,
				'\t\t</item>'
			]
				.filter(Boolean)
				.join('\n');
		})
		.join('\n');

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>${CHANNEL_TITLE}</title>
		<link>${SITE_URL}/blog</link>
		<atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
		<description>Field notes and research on major gift fundraising, donor stewardship, prospect research and AI donor intelligence for small nonprofits.</description>
		<language>en-us</language>${latest ? `\n\t\t<lastBuildDate>${latest}</lastBuildDate>` : ''}
		<image>
			<url>${SITE_URL}/icon-logo.png</url>
			<title>${CHANNEL_TITLE}</title>
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
