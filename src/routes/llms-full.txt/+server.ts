import { getAllPosts, getPostSource } from '$lib/content';
import { LLMS_INTRO, LLMS_OUTRO, postUrl } from '$lib/llms';

export const prerender = true;

export async function GET() {
	const posts = await getAllPosts();
	const sections = await Promise.all(
		posts.map(async (post) => {
			const source = (await getPostSource(post.slug)) ?? '';
			// Drop the leading H1 — we print our own title line with the canonical URL.
			const bodyText = source.replace(/^#\s+.*\n+/, '');
			return [
				`## ${post.title}`,
				`URL: ${postUrl(post)}`,
				`Published: ${post.date}`,
				`Section: ${post.tag}`,
				'',
				bodyText
			].join('\n');
		})
	);

	const body = [LLMS_INTRO, '# Articles', sections.join('\n\n---\n\n'), LLMS_OUTRO].join('\n\n');

	return new Response(body + '\n', {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=0, s-maxage=3600'
		}
	});
}
