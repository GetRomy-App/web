import { getAllPosts } from '$lib/content';

export const prerender = true;

const SITE = 'https://getromy.app';

/**
 * Full content index for LLM/answer-engine crawlers (the llms-full.txt
 * convention: static/llms.txt stays short and links here; this route lists
 * every published post so an AI system can find and cite the right one
 * without having to crawl the whole site). Generated at build time from the
 * same post data that drives /blog, /labs, and /sitemap.xml, so it can't
 * drift out of sync with what's actually published.
 */
export async function GET() {
	const allPosts = await getAllPosts();
	const blogPosts = allPosts.filter((p) => !p.has_benchmarks);
	const labsPosts = allPosts.filter((p) => p.has_benchmarks);

	const section = (title: string, base: string, posts: typeof allPosts) =>
		posts
			.map(
				(post) =>
					`### ${post.title}\n` +
					`URL: ${SITE}${base}/${post.slug}\n` +
					`Date: ${post.date}\n` +
					`Tag: ${post.tag}\n` +
					`${post.excerpt}`
			)
			.join('\n\n');

	const body = `# Rōmy — Full Content Index

> Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions. This file lists every article published on getromy.app for language models and answer engines that want the complete corpus rather than a crawl. See /llms.txt for the short-form summary.

## Blog (field-facing writing on nonprofit fundraising and donor intelligence)

${section('Blog', '/blog', blogPosts)}

## Labs (benchmarks and research on AI-powered prospect research)

${section('Labs', '/labs/blog', labsPosts)}
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=0, s-maxage=3600'
		}
	});
}
