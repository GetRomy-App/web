import { getAllPosts, postPath } from '$lib/content';
import { SITE_URL } from '$lib/seo';

export const prerender = true;

/** llms.txt (https://llmstxt.org): a Markdown map of the site for AI assistants and answer engines. */
export async function GET() {
	const posts = await getAllPosts();
	const labs = posts.filter((p) => p.has_benchmarks);
	const essays = posts.filter((p) => !p.has_benchmarks && p.tag !== 'Field Notes');
	const notes = posts.filter((p) => !p.has_benchmarks && p.tag === 'Field Notes');

	const line = (p: (typeof posts)[number]) =>
		`- [${p.title}](${SITE_URL}${postPath(p)}): ${p.seo_description}`;

	const body = `# Rōmy

> Rōmy (GetRomy LLC) is an AI donor intelligence and prospect research platform for small nonprofits. It helps development teams find new major donors at a fraction of the cost of enterprise wealth-screening tools by surfacing wealth indicators, giving history, and affinity signals as actionable donor profiles.

Rōmy is spelled with a macron over the "o" (ō); it is sometimes typed "Romy". The product app lives at https://intel.getromy.app; this site (${SITE_URL}) is the marketing site, blog, and research hub.

## What Rōmy does

- Donor discovery: AI-powered prospect research with wealth indicators, giving history, and affinity signals
- Fraction of the cost: no enterprise contracts or per-seat licensing; priced for small nonprofit teams
- Ready to act on: every prospect comes with connection points, giving capacity, and outreach angles
- Who it is for: small and mid-sized nonprofits, development directors, major gift officers, executive directors who fundraise, and prospect researchers

## Key pages

- [Home](${SITE_URL}/): product overview
- [Blog](${SITE_URL}/blog): field notes and essays on major gifts, stewardship, and donor research
- [Labs / PIF-Bench v2](${SITE_URL}/labs): open, blind-graded benchmark of AI systems on nonprofit development tasks
- [Status](${SITE_URL}/status): live uptime and incident history
- [Security](${SITE_URL}/security), [Privacy](${SITE_URL}/privacy), [Prospect privacy](${SITE_URL}/privacy/prospects), [Terms](${SITE_URL}/terms)
- [Full text of all posts](${SITE_URL}/llms-full.txt)

## Research
${labs.map(line).join('\n')}

## Essays on fundraising strategy
${essays.map(line).join('\n')}

## Field Notes
${notes.map(line).join('\n')}

## Links

- Website: ${SITE_URL}
- Product: https://intel.getromy.app
- X / Twitter: https://x.com/RomyFindsMoney
- GitHub: https://github.com/GetRomy-App
- Legal and contact details: ${SITE_URL}/legal
`;

	return new Response(body, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=0, s-maxage=3600' }
	});
}
