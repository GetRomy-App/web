import { getAllPosts } from '$lib/content';
import { metaDescription } from '$lib/seo';
import { LLMS_INTRO, postUrl } from '$lib/llms';

export const prerender = true;

export async function GET() {
	const posts = await getAllPosts();
	const labs = posts.filter((p) => p.has_benchmarks);
	const blog = posts.filter((p) => !p.has_benchmarks);
	const line = (p: (typeof posts)[number]) =>
		`- [${p.title}](${postUrl(p)}): ${p.description || metaDescription(p.excerpt)}`;

	const body = `${LLMS_INTRO}
## Research (Rōmy Labs)

${labs.map(line).join('\n')}

## Field Notes

${blog.map(line).join('\n')}
`;
	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
}
