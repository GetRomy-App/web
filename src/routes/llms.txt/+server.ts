import { loadPosts, postUrl, shortDescription, SITE_SUMMARY } from '$lib/feeds';

export const prerender = true;

export async function GET() {
	const posts = await loadPosts();
	const labs = posts.filter((p) => p.has_benchmarks);
	const byTag = new Map<string, typeof posts>();
	for (const p of posts.filter((p) => !p.has_benchmarks)) {
		byTag.set(p.tag, [...(byTag.get(p.tag) ?? []), p]);
	}

	const line = (p: (typeof posts)[number]) =>
		`- [${p.title}](${postUrl(p)}): ${shortDescription(p)}`;

	let body = SITE_SUMMARY;
	if (labs.length) body += `\n## Research & benchmarks\n\n${labs.map(line).join('\n')}\n`;
	for (const [tag, list] of byTag) body += `\n## Blog — ${tag}\n\n${list.map(line).join('\n')}\n`;

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=0, s-maxage=3600'
		}
	});
}
