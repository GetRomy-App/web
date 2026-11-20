import { getAllPosts } from '$lib/content';
import { LLMS_HEADER, postLine, textResponse } from '$lib/llms';
import { SITE_URL } from '$lib/seo';

export const prerender = true;

export async function GET() {
	const posts = await getAllPosts();
	const research = posts.filter((p) => p.has_benchmarks || p.tag !== 'Field Notes');
	const fieldNotes = posts.filter((p) => !p.has_benchmarks && p.tag === 'Field Notes');

	const body = `${LLMS_HEADER}
## Research & guides

${research.map(postLine).join('\n')}

## Field Notes (essays on major gifts, stewardship and donor relationships)

${fieldNotes.map(postLine).join('\n')}

## Optional

- [Full text of every post](${SITE_URL}/llms-full.txt): all articles in one plain-text file
- [Sitemap](${SITE_URL}/sitemap.xml)
- [RSS feed](${SITE_URL}/blog/rss.xml)
`;
	return textResponse(body);
}
