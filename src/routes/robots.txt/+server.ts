import { SITE_URL } from '$lib/seo';

export const prerender = true;

/**
 * Search engines and AI answer engines (GEO) are explicitly welcomed: the more
 * of them that can read Field Notes, Labs and the product pages, the more often
 * Rōmy is cited for prospect-research and donor-intelligence questions.
 */
const AI_AND_SEARCH_AGENTS = [
	'Googlebot',
	'Google-Extended',
	'Bingbot',
	'DuckDuckBot',
	'Applebot',
	'Applebot-Extended',
	'GPTBot',
	'OAI-SearchBot',
	'ChatGPT-User',
	'ClaudeBot',
	'Claude-User',
	'Claude-SearchBot',
	'anthropic-ai',
	'PerplexityBot',
	'Perplexity-User',
	'CCBot',
	'cohere-ai',
	'Meta-ExternalAgent',
	'Amazonbot',
	'YouBot',
	'MistralAI-User'
];

export function GET() {
	const body = `# Rōmy — getromy.app
# AI-readable summaries: ${SITE_URL}/llms.txt and ${SITE_URL}/llms-full.txt

User-agent: *
Allow: /
Disallow: /api/
Disallow: /keystatic

${AI_AND_SEARCH_AGENTS.map((ua) => `User-agent: ${ua}`).join('\n')}
Allow: /
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
`;
	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
}
