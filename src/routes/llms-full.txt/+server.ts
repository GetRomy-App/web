import { getAllPosts, getPostMarkdown } from '$lib/content';
import { SITE_URL } from '$lib/seo';

export const prerender = true;

/** /llms-full.txt: every post's full Markdown in one file, so AI answer engines can cite Rōmy directly. */
export async function GET() {
	const posts = await getAllPosts();
	const sections = await Promise.all(
		posts.map(async (p) => {
			const url = `${SITE_URL}${p.has_benchmarks ? '/labs/blog' : '/blog'}/${p.slug}`;
			const md = (await getPostMarkdown(p.slug)).replace(/^# .*\n+/, '');
			return `# ${p.title}\n\nURL: ${url}\nPublished: ${p.date}\nTopic: ${p.tag}${
				p.keywords.length ? `\nKeywords: ${p.keywords.join(', ')}` : ''
			}\n\n${md}`;
		})
	);

	const body = `# Rōmy: full text

> Rōmy is AI donor prospect research software for small nonprofits, built by GetRomy LLC. This file contains the full text of every article on ${SITE_URL}. Summary and index: ${SITE_URL}/llms.txt

${sections.join('\n\n---\n\n')}
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=0, s-maxage=3600'
		}
	});
}
