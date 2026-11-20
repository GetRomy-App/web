import type { PostMeta } from '$lib/content';
import { SITE_URL, APP_URL, clip } from '$lib/seo';

/** Shared header for /llms.txt and /llms-full.txt (https://llmstxt.org). */
export const LLMS_HEADER = `# Rōmy

> Rōmy is a donor intelligence and AI prospect research platform for small nonprofits. It helps small development teams find new major donors at a fraction of the cost of enterprise wealth-screening tools.

Rōmy uses AI-powered prospect research to surface wealth indicators, giving histories, and affinity signals — then distills them into actionable donor profiles with connection points, giving capacity, and outreach angles. It is built and run by GetRomy LLC.

## Key facts

- What it is: AI prospect research and donor intelligence software for nonprofits
- Who it's for: small nonprofits, executive directors, development directors and major gift officers
- What it does: donor discovery, wealth screening, giving history analysis, affinity signal detection, actionable donor profiles
- Pricing model: no enterprise contracts or per-seat licensing — priced for small nonprofit teams
- Independent benchmark: PIF-Bench v2 (${SITE_URL}/labs) grades AI systems on 25 real development-office tasks with 331 pass/fail checks

## Links

- Website: ${SITE_URL}
- Product: ${APP_URL}
- Blog: ${SITE_URL}/blog
- Labs / benchmarks: ${SITE_URL}/labs
- Status: ${SITE_URL}/status
- Legal: ${SITE_URL}/legal
- Twitter: https://x.com/RomyFindsMoney
- GitHub: https://github.com/GetRomy-App
- Contact: howard@getromy.app
`;

export function postUrl(p: PostMeta): string {
	return `${SITE_URL}${p.has_benchmarks ? '/labs/blog' : '/blog'}/${p.slug}`;
}

export function postLine(p: PostMeta): string {
	const desc = clip(p.seo_description || p.excerpt, 200);
	return `- [${p.title}](${postUrl(p)}): ${desc}`;
}

export function textResponse(body: string): Response {
	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=0, s-maxage=3600'
		}
	});
}
