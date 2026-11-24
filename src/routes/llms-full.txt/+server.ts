import { LLMS_INTRO, postsFullMarkdown, textResponse } from '$lib/llms';

export const prerender = true;

export async function GET() {
	return textResponse(`${LLMS_INTRO}\n# All articles\n\n${await postsFullMarkdown()}`);
}
