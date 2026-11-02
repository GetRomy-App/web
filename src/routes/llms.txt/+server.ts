import { getAllPosts } from '$lib/content';

export const prerender = true;

const SITE = 'https://getromy.app';

/** Single-line, markdown-safe excerpt. */
function oneLine(text: string, max = 220): string {
	const clean = text.replace(/\s+/g, ' ').trim();
	return clean.length > max ? clean.slice(0, max - 1).replace(/\s+\S*$/, '') + '…' : clean;
}

export async function GET() {
	const posts = await getAllPosts();
	const blog = posts.filter((p) => !p.has_benchmarks);
	const labs = posts.filter((p) => p.has_benchmarks);

	const line = (base: string, p: { slug: string; title: string; excerpt: string }) =>
		`- [${p.title}](${SITE}${base}/${p.slug})${p.excerpt ? `: ${oneLine(p.excerpt)}` : ''}`;

	const body = `# Rōmy

> Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions.

Rōmy is a donor intelligence platform built for small nonprofit teams. It uses AI-powered prospect research to surface wealth indicators, giving histories, and affinity signals — then distills them into actionable donor profiles. Rōmy is made by GetRomy LLC. The brand is always written "Rōmy" (with a macron over the o).

## Features

- Donor Discovery: AI-powered prospect research with wealth indicators, giving history, and affinity signals
- Fraction of the Cost: No enterprise contracts or per-seat licensing — donor intelligence at a price built for small nonprofits
- Ready to Act On: Every prospect comes with connection points, giving capacity, and outreach angles

## Key pages

- [Home](${SITE}/): Product overview
- [Product app](https://intel.getromy.app): The Rōmy donor intelligence app
- [Blog](${SITE}/blog): Essays and field notes on major gift fundraising, prospect research, and stewardship
- [Labs](${SITE}/labs): PIF-Bench, an open rubric-graded benchmark of AI systems on nonprofit development work
- [Status](${SITE}/status): Live uptime and operational status
- [Security](${SITE}/security): Security practices
- [Privacy](${SITE}/privacy): Privacy policy
- [Sub-processors](${SITE}/subprocessors): Sub-processor list
- [Terms](${SITE}/terms): Terms of service

## Research & benchmarks

${labs.map((p) => line('/labs/blog', p)).join('\n') || '- See the Labs page.'}

## Blog

${blog.map((p) => line('/blog', p)).join('\n')}

## Links

- Website: ${SITE}
- Download (macOS, Windows, Linux): https://github.com/GetRomy-App/web/releases
- Twitter/X: https://x.com/RomyFindsMoney
- GitHub: https://github.com/GetRomy-App
- Contact: howard@getromy.app, solomon@getromy.app

## Company

GetRomy LLC
`;

	return new Response(body, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' }
	});
}
