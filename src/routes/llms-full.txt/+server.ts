import { getAllPosts, getPost } from '$lib/content';
import { LLMS_HEADER, postUrl, textResponse } from '$lib/llms';

export const prerender = true;

export async function GET() {
	const metas = await getAllPosts();
	const posts = (await Promise.all(metas.map((m) => getPost(m.slug)))).filter(
		(p): p is NonNullable<typeof p> => p !== null
	);

	const sections = posts.map((p) => {
		const date = p.date ? new Date(p.date).toISOString().slice(0, 10) : '';
		const body = p.source.replace(/^#\s+.*\n+/, '');
		return `---

# ${p.title}

URL: ${postUrl(p)}
Published: ${date}
Section: ${p.tag}
${p.keywords.length ? `Topics: ${p.keywords.join(', ')}\n` : ''}
${body}
`;
	});

	return textResponse(`${LLMS_HEADER}\n# Articles\n\n${sections.join('\n')}`);
}
