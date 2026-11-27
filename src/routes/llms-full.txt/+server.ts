import { htmlToText, loadFullPosts, postUrl, SITE_SUMMARY } from '$lib/feeds';

export const prerender = true;

export async function GET() {
	const posts = await loadFullPosts();
	const sections = posts.map(
		(p) =>
			`---\n\n# ${p.title}\n\nURL: ${postUrl(p)}\nPublished: ${p.date}\nTopic: ${p.tag}\nPublisher: Rōmy (GetRomy LLC)\n\n${htmlToText(p.content)}\n`
	);
	const body = `${SITE_SUMMARY}\n## Articles (full text)\n\n${sections.join('\n')}`;
	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=0, s-maxage=3600'
		}
	});
}
