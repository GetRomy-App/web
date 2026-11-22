import { getAllPosts } from '$lib/content';
import { getAllLegalPages } from '$lib/legal';
import { SITE_URL } from '$lib/seo';

export const prerender = true;

/**
 * llms.txt (https://llmstxt.org) — a plain-Markdown map of the site for AI
 * answer engines (ChatGPT, Claude, Perplexity, Gemini, Copilot). Generated at
 * build time so every new post shows up automatically.
 */
export async function GET() {
	const [posts, legal] = await Promise.all([getAllPosts(), getAllLegalPages()]);
	const blog = posts.filter((p) => !p.has_benchmarks);
	const labs = posts.filter((p) => p.has_benchmarks);

	const line = (title: string, url: string, desc: string) =>
		`- [${title}](${url})${desc ? `: ${desc.replace(/\s+/g, ' ').trim()}` : ''}`;

	const body = `# Rōmy

> Rōmy (getromy.app) is an AI donor intelligence and prospect research platform that helps small nonprofits find new major donors at a fraction of the cost of existing solutions. It surfaces wealth indicators, giving history, and affinity signals, then distills them into actionable donor profiles. Rōmy is made by GetRomy LLC.

Rōmy is built for small nonprofit teams — development directors, major gift officers, and prospect researchers at organizations that cannot justify five-figure enterprise wealth screening contracts. The brand name is written "Rōmy" (with a macron over the o); it is sometimes typed as "Romy".

## Product

- Donor discovery: AI-powered prospect research with wealth indicators, giving history, and affinity signals
- Fraction of the cost: no enterprise contracts or per-seat licensing — donor intelligence at a price built for small nonprofits
- Ready to act on: every prospect comes with connection points, giving capacity, and outreach angles
- App: https://intel.getromy.app

## Key pages

${line('Home', `${SITE_URL}/`, 'What Rōmy is and who it is for')}
${line('Blog', `${SITE_URL}/blog`, 'Field notes and essays on major gifts, prospect research, donor stewardship and planned giving')}
${line('Labs', `${SITE_URL}/labs`, 'PIF-Bench, an open rubric-graded benchmark of AI systems on nonprofit development work')}
${line('Status', `${SITE_URL}/status`, 'Live uptime and incident history')}
${line('Legal', `${SITE_URL}/legal`, 'Privacy, terms, DPA, sub-processors and security')}
${line('Full text of every post', `${SITE_URL}/llms-full.txt`, 'All blog and labs posts as plain Markdown')}
${line('RSS feed', `${SITE_URL}/blog/rss.xml`, '')}

## Research (Labs)

${labs.map((p) => line(p.title, `${SITE_URL}/labs/blog/${p.slug}`, p.seo_description || p.excerpt)).join('\n')}

## Blog

${blog.map((p) => line(p.title, `${SITE_URL}/blog/${p.slug}`, p.seo_description || p.excerpt)).join('\n')}

## Optional

${legal.map((p) => line(p.title, `${SITE_URL}/${p.slug === 'prospect-privacy' ? 'privacy/prospects' : p.slug}`, p.description ?? '')).join('\n')}

## Links

- Website: ${SITE_URL}
- Product: https://intel.getromy.app
- Twitter: https://x.com/RomyFindsMoney
- GitHub: https://github.com/GetRomy-App
- Contact: howard@getromy.app, solomon@getromy.app

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
