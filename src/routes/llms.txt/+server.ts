import { LLMS_INTRO, postIndexMarkdown, textResponse } from '$lib/llms';

export const prerender = true;

export async function GET() {
	return textResponse(LLMS_INTRO + (await postIndexMarkdown()));
}
