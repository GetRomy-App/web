import { getAllPosts } from '$lib/content';

export const prerender = true;

const SITE = 'https://getromy.app';

function xmlEscape(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function toRfc822(value: string): string | undefined {
	if (!value) return undefined;
	const d = new Date(value);
	if (isNaN(d.getTime())) return undefined;
	return d.toUTCString();
}

export async function GET() {
	const allPosts = await getAllPosts();
	const posts = allPosts.filter((p) => !p.has_benchmarks);
	const newest = posts.map((p) => toRfc822(p.date)).filter((d): d is string => Boolean(d))[0];

	const items = posts
		.map((post) => {
			const url = `${SITE}/blog/${post.slug}`;
			const pubDate = toRfc822(post.date);
			return [
				'\t<item>',
				`\t\t<title>${xmlEscape(post.title)}</title>`,
				`\t\t<link>${xmlEscape(url)}</link>`,
				`\t\t<guid isPermaLink="true">${xmlEscape(url)}</guid>`,
				pubDate ? `\t\t<pubDate>${pubDate}</pubDate>` : null,
				post.tag ? `\t\t<category>${xmlEscape(post.tag)}</category>` : null,
				`\t\t<description>${xmlEscape(post.excerpt)}</description>`,
				'\t</item>'
			]
				.filter(Boolean)
				.join('\n');
		})
		.join('\n');

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
	<title>Rōmy Blog</title>
	<link>${SITE}/blog</link>
	<atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
	<description>Technical deep-dives, research findings, and perspectives on nonprofit fundraising, prospect research, and purpose-built AI.</description>
	<language>en-us</language>
${newest ? `\t<lastBuildDate>${newest}</lastBuildDate>\n` : ''}${items}
</channel>
</rss>
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=0, s-maxage=3600'
		}
	});
}
