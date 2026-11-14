import { getAllPosts } from '$lib/content';
import { LLMS_INTRO, LLMS_OUTRO, postLine } from '$lib/llms';

export const prerender = true;

export async function GET() {
	const posts = await getAllPosts();
	const research = posts.filter((p) => p.has_benchmarks);
	const essays = posts.filter((p) => !p.has_benchmarks && p.tag !== 'Field Notes');
	const fieldNotes = posts.filter((p) => !p.has_benchmarks && p.tag === 'Field Notes');

	const body = [
		LLMS_INTRO,
		'## Research',
		research.map(postLine).join('\n'),
		'## Essays on fundraising, prospect research, and donor intelligence',
		essays.map(postLine).join('\n'),
		'## Field Notes (major gift fundraising and donor stewardship)',
		fieldNotes.map(postLine).join('\n'),
		LLMS_OUTRO
	].join('\n\n');

	return new Response(body + '\n', {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=0, s-maxage=3600'
		}
	});
}
