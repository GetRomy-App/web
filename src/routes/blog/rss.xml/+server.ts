import { getAllPosts, getPost } from '$lib/content';
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

function cdata(value: string): string {
	return `<![CDATA[${value.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;
}

export async function GET() {
	const metas = await getAllPosts();
	const posts = await Promise.all(metas.map((m) => getPost(m.slug)));

	const items = posts
		.filter((p): p is NonNullable<typeof p> => Boolean(p))
		.map((p) => {
			const url = `${SITE_URL}${p.has_benchmarks ? '/labs/blog/' : '/blog/'}${p.slug}`;
			const date = p.date ? new Date(p.date).toUTCString() : '';
			return [
				'\t\t<item>',
				`\t\t\t<title>${esc(p.title)}</title>`,
				`\t\t\t<link>${url}</link>`,
				`\t\t\t<guid isPermaLink="true">${url}</guid>`,
				date ? `\t\t\t<pubDate>${date}</pubDate>` : '',
				p.tag ? `\t\t\t<category>${esc(p.tag)}</category>` : '',
				...p.keywords.map((k) => `\t\t\t<category>${esc(k)}</category>`),
				`\t\t\t<description>${esc(p.excerpt || p.seo_description)}</description>`,
				`\t\t\t<content:encoded>${cdata(p.content)}</content:encoded>`,
				'\t\t</item>'
			]
				.filter(Boolean)
				.join('\n');
		})
		.join('\n');

	const lastBuild = metas[0]?.date
		? new Date(metas[0].date).toUTCString()
		: new Date().toUTCString();

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
	<channel>
		<title>Rōmy Blog — Nonprofit Fundraising, Major Gifts &amp; Prospect Research</title>
		<link>${SITE_URL}/blog</link>
		<atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
		<description>Field notes and research on major gift fundraising, prospect research, donor stewardship and AI donor intelligence for small nonprofits.</description>
		<language>en-us</language>
		<copyright>© GetRomy LLC</copyright>
		<lastBuildDate>${lastBuild}</lastBuildDate>
		<image>
			<url>${SITE_URL}/icon-logo.png</url>
			<title>Rōmy Blog — Nonprofit Fundraising, Major Gifts &amp; Prospect Research</title>
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
