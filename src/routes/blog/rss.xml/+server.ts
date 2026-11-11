import { getAllPosts, getPost } from '$lib/content';
import { SITE_URL, truncate } from '$lib/seo';

export const prerender = true;

function esc(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function postUrl(slug: string, labs: boolean): string {
	return `${SITE_URL}${labs ? '/labs/blog' : '/blog'}/${slug}`;
}

/** RSS 2.0 feed of every post (blog + labs), full content included for readers and AI crawlers. */
export async function GET() {
	const metas = await getAllPosts();
	const posts = (await Promise.all(metas.map((m) => getPost(m.slug)))).filter(
		(p): p is NonNullable<typeof p> => Boolean(p)
	);

	const items = posts
		.map((p) => {
			const url = postUrl(p.slug, p.has_benchmarks);
			const date = new Date(p.date);
			const categories = [p.tag, ...p.keywords].filter(Boolean);
			return [
				'\t\t<item>',
				`\t\t\t<title>${esc(p.title)}</title>`,
				`\t\t\t<link>${url}</link>`,
				`\t\t\t<guid isPermaLink="true">${url}</guid>`,
				isNaN(date.getTime()) ? null : `\t\t\t<pubDate>${date.toUTCString()}</pubDate>`,
				`\t\t\t<description>${esc(p.seo_description || truncate(p.excerpt, 300))}</description>`,
				...categories.map((c) => `\t\t\t<category>${esc(c)}</category>`),
				`\t\t\t<content:encoded><![CDATA[${p.content.replace(/]]>/g, ']]]]><![CDATA[>')}]]></content:encoded>`,
				'\t\t</item>'
			]
				.filter(Boolean)
				.join('\n');
		})
		.join('\n');

	const newest = posts[0] ? new Date(posts[0].date) : new Date();

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
	<channel>
		<title>Rōmy Blog: Major Gifts, Donor Research &amp; Nonprofit Fundraising</title>
		<link>${SITE_URL}/blog</link>
		<atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
		<description>Field notes and research on major gifts, donor stewardship, prospect research, and small-nonprofit fundraising from Rōmy.</description>
		<language>en-us</language>
		<copyright>GetRomy LLC</copyright>
		<lastBuildDate>${(isNaN(newest.getTime()) ? new Date() : newest).toUTCString()}</lastBuildDate>
		<image>
			<url>${SITE_URL}/icon-logo.png</url>
			<title>Rōmy Blog: Major Gifts, Donor Research &amp; Nonprofit Fundraising</title>
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
