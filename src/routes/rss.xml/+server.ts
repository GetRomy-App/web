import { getAllPosts } from '$lib/content';
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
	const items = posts
		.filter((p) => !isNaN(new Date(p.date).getTime()))
		.map((p) => {
			const link = `${SITE_URL}${p.has_benchmarks ? '/labs/blog/' : '/blog/'}${p.slug}`;
			return [
				'\t\t<item>',
				`\t\t\t<title>${esc(p.title)}</title>`,
				`\t\t\t<link>${link}</link>`,
				`\t\t\t<guid isPermaLink="true">${link}</guid>`,
				`\t\t\t<pubDate>${new Date(p.date).toUTCString()}</pubDate>`,
				p.tag ? `\t\t\t<category>${esc(p.tag)}</category>` : null,
				...p.keywords.map((k) => `\t\t\t<category>${esc(k)}</category>`),
				`\t\t\t<description>${esc(p.excerpt || p.seo_description)}</description>`,
				'\t\t</item>'
			]
				.filter(Boolean)
				.join('\n');
		});

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>Rōmy Blog — Major Gifts, Donor Stewardship &amp; Prospect Research</title>
		<link>${SITE_URL}/blog</link>
		<atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
		<description>Field notes and essays for small-shop fundraisers on major gifts, donor stewardship and AI prospect research, from Rōmy.</description>
		<language>en-us</language>
		${posts[0] ? `<lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>` : ''}
${items.join('\n')}
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
