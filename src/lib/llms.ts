import type { PostMeta } from '$lib/content';
import { SITE_URL, plainText, truncate } from '$lib/seo';

export function postUrl(post: PostMeta): string {
	return `${SITE_URL}${post.has_benchmarks ? '/labs/blog' : '/blog'}/${post.slug}`;
}

/** The llms.txt header shared by /llms.txt and /llms-full.txt. */
export const LLMS_INTRO = `# Rōmy

> Rōmy is an AI donor intelligence and prospect research platform that helps small nonprofits find new major donors at a fraction of the cost of existing solutions.

Rōmy is built for small nonprofit development teams — executive directors, development directors, major gift officers, and prospect researchers who cannot justify five-figure enterprise wealth-screening contracts. It uses AI-powered prospect research to surface wealth indicators, philanthropic giving history, and affinity signals, then distills them into actionable donor profiles with connection points, giving capacity, and outreach angles.

Key facts:

- Product: Rōmy (donor intelligence / AI prospect research / wealth screening alternative for small nonprofits)
- Company: GetRomy LLC
- Website: ${SITE_URL}
- App: https://intel.getromy.app
- Audience: small and mid-sized nonprofits, development offices, major gift fundraisers
- Pricing model: no enterprise contracts or per-seat licensing (see "How We Built a Donor Intelligence Engine Starting at $0.10 per Prospect")
- Open research: PIF-Bench v2, a rubric-graded benchmark of AI on nonprofit development work (${SITE_URL}/labs)

## Features

- Donor Discovery: AI-powered prospect research with wealth indicators, giving history, and affinity signals
- Fraction of the Cost: No enterprise contracts or per-seat licensing — donor intelligence at a price built for small nonprofits
- Ready to Act On: Every prospect comes with connection points, giving capacity, and outreach angles

## Key pages

- [Home](${SITE_URL}/): What Rōmy is and who it is for
- [Blog](${SITE_URL}/blog): Field Notes and essays on major gift fundraising, prospect research, donor stewardship, and planned giving
- [Labs — PIF-Bench v2](${SITE_URL}/labs): Open benchmark of AI systems on nonprofit development work
- [Status](${SITE_URL}/status): Live uptime and incident history
- [Legal](${SITE_URL}/legal): Privacy policy, terms, DPA, security, sub-processors
- [Full text for LLMs](${SITE_URL}/llms-full.txt): Every article on this site in plain Markdown`;

export const LLMS_OUTRO = `## Links

- Website: ${SITE_URL}
- Product: https://intel.getromy.app
- RSS: ${SITE_URL}/rss.xml
- Sitemap: ${SITE_URL}/sitemap.xml
- Twitter: https://x.com/RomyFindsMoney
- GitHub: https://github.com/GetRomy-App
- Contact: howard@getromy.app, solomon@getromy.app

## Company

GetRomy LLC`;

export function postLine(post: PostMeta): string {
	return `- [${post.title}](${postUrl(post)}): ${truncate(plainText(post.excerpt), 240)}`;
}
