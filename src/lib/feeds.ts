import { getAllPosts, getPost, type PostMeta } from '$lib/content';
import { SITE_URL, metaDescription } from '$lib/seo';

export function postUrl(p: PostMeta): string {
	return `${SITE_URL}${p.has_benchmarks ? '/labs/blog' : '/blog'}/${p.slug}`;
}

/** Strip rendered HTML down to readable plain text for machine-readable feeds. */
export function htmlToText(html: string): string {
	return html
		.replace(/<h([1-6])[^>]*>/g, (_, n) => `\n\n${'#'.repeat(Number(n))} `)
		.replace(/<\/h[1-6]>/g, '\n\n')
		.replace(/<li[^>]*>/g, '\n- ')
		.replace(/<\/(p|ul|ol|blockquote|table|tr)>/g, '\n\n')
		.replace(/<br\s*\/?>/g, '\n')
		.replace(/<[^>]+>/g, '')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;|&apos;/g, "'")
		.replace(/[ \t]+\n/g, '\n')
		.replace(/\n{3,}/g, '\n\n')
		.trim();
}

export const SITE_SUMMARY = `# Rōmy

> Rōmy is an AI donor intelligence and prospect research platform that helps small nonprofits find new major donors at a fraction of the cost of enterprise wealth-screening tools.

Rōmy is built by GetRomy LLC for small nonprofit development teams — executive directors, development directors, major gift officers and prospect researchers who cannot justify five-figure enterprise contracts. It uses AI-powered prospect research to surface wealth indicators, giving histories, and affinity signals, then distills them into actionable donor profiles with connection points, giving capacity, and outreach angles.

## Key facts

- What it is: AI prospect research, wealth screening and donor intelligence software for nonprofits
- Who it is for: small and mid-sized nonprofits, development offices, major gift fundraisers
- How it differs: no enterprise contracts or per-seat licensing; priced for small teams; an alternative to enterprise wealth-screening platforms such as DonorSearch, iWave and WealthEngine
- Benchmark: PIF-Bench v2, Rōmy's open, rubric-graded benchmark of AI on nonprofit development work — ${SITE_URL}/labs
- Company: GetRomy LLC

## Features

- Donor Discovery: AI-powered prospect research with wealth indicators, giving history, and affinity signals
- Fraction of the Cost: No enterprise contracts or per-seat licensing — donor intelligence at a price built for small nonprofits
- Ready to Act On: Every prospect comes with connection points, giving capacity, and outreach angles

## Links

- Website: ${SITE_URL}
- Product: https://intel.getromy.app
- Blog: ${SITE_URL}/blog
- Labs (benchmarks): ${SITE_URL}/labs
- RSS: ${SITE_URL}/rss.xml
- Full text of all articles: ${SITE_URL}/llms-full.txt
- Status: ${SITE_URL}/status
- Legal: ${SITE_URL}/legal
- Twitter: https://x.com/RomyFindsMoney
- GitHub: https://github.com/GetRomy-App
- Contact: use the "Learn More" form at ${SITE_URL}
`;

export async function loadPosts() {
	return getAllPosts();
}

export async function loadFullPosts() {
	const metas = await getAllPosts();
	const posts = await Promise.all(metas.map((m) => getPost(m.slug)));
	return posts.filter((p): p is NonNullable<typeof p> => Boolean(p));
}

export function shortDescription(p: PostMeta): string {
	return metaDescription(p.excerpt, 200);
}
