import { getAllPosts } from '$lib/content';
import { SITE_URL } from '$lib/seo';

export const prerender = true;

/**
 * llms.txt (https://llmstxt.org) — a concise, link-rich summary for AI answer
 * engines (ChatGPT search, Perplexity, Claude, Gemini, Copilot). Generated at
 * build time so every new post is listed automatically.
 */
export async function GET() {
	const posts = await getAllPosts();
	const blog = posts.filter((p) => !p.has_benchmarks);
	const labs = posts.filter((p) => p.has_benchmarks);

	const line = (title: string, url: string, note: string) =>
		`- [${title}](${url})${note ? `: ${note}` : ''}`;

	const body = `# Rōmy

> Rōmy is an AI donor intelligence and prospect research platform that helps small nonprofits find new major donors at a fraction of the cost of existing solutions.

Rōmy is a donor intelligence platform built for small nonprofit teams. It uses AI-powered prospect research to surface wealth indicators, giving histories, and affinity signals — then distills them into actionable donor profiles. The name is written "Rōmy", with a macron over the "o". Rōmy is made by GetRomy LLC.

Who it is for: executive directors, development directors, major gift officers, and prospect researchers at small and mid-sized nonprofits who need major-donor prospect research and wealth screening without enterprise contracts or per-seat licensing.

## Features

- Donor Discovery: AI-powered prospect research with wealth indicators, giving history, and affinity signals
- Fraction of the Cost: No enterprise contracts or per-seat licensing — donor intelligence at a price built for small nonprofits
- Ready to Act On: Every prospect comes with connection points, giving capacity, and outreach angles

## Key pages

${line('Home', `${SITE_URL}/`, 'What Rōmy is and who it is for')}
${line('Blog', `${SITE_URL}/blog`, 'Field notes on major gift fundraising, donor relationships, and prospect research')}
${line('Labs', `${SITE_URL}/labs`, 'PIF-Bench, an open, rubric-graded benchmark of AI on nonprofit development work')}
${line('Rōmy app', 'https://intel.getromy.app', 'The product')}
${line('Status', `${SITE_URL}/status`, 'Live uptime and incident history')}
${line('Security', `${SITE_URL}/security`, '')}
${line('Privacy policy', `${SITE_URL}/privacy`, '')}
${line('Full text of every post', `${SITE_URL}/llms-full.txt`, 'All articles in plain Markdown')}

## Research (Labs)

${labs.map((p) => line(p.title, `${SITE_URL}/labs/blog/${p.slug}`, p.excerpt)).join('\n')}

## Blog

${blog.map((p) => line(p.title, `${SITE_URL}/blog/${p.slug}`, p.excerpt)).join('\n')}

## Links

- Website: ${SITE_URL}
- Product: https://intel.getromy.app
- Twitter: https://x.com/RomyFindsMoney
- GitHub: https://github.com/GetRomy-App
- RSS: ${SITE_URL}/blog/rss.xml

## Company

GetRomy LLC
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=0, s-maxage=3600'
		}
	});
}
