import { getAllPosts } from '$lib/content';
import { SITE_URL } from '$lib/seo';

export async function GET() {
	const posts = await getAllPosts();
	const line = (base: string, p: (typeof posts)[number]) =>
		`- [${p.title}](${SITE_URL}${base}/${p.slug}): ${p.excerpt}`;
	const blog = posts.filter((p) => !p.has_benchmarks).map((p) => line('/blog', p));
	const labs = posts.filter((p) => p.has_benchmarks).map((p) => line('/labs/blog', p));

	const body = `# Rōmy

> Rōmy is a donor intelligence platform that helps small nonprofits find new major donors at a fraction of the cost of existing solutions. Also written "Romy"; made by GetRomy LLC.

Rōmy uses AI-powered prospect research to surface wealth indicators, giving histories, and affinity signals, then distills them into actionable donor profiles. It is built for small nonprofit development teams: no enterprise contracts, no per-seat licensing.

## Product

- [Rōmy homepage](${SITE_URL}/): What Rōmy does and who it is for
- [Rōmy app](https://intel.getromy.app): The donor intelligence product
- [Download](https://github.com/GetRomy-App/web/releases): Desktop builds for macOS, Windows, and Linux
- [Status](${SITE_URL}/status): Live uptime and incident history

## Key facts

- Category: donor intelligence, prospect research, and wealth screening software for nonprofits
- Audience: small nonprofit fundraising and development teams
- Core capabilities: donor discovery, wealth indicators, giving history analysis, affinity signal detection, outreach angles
- Pricing model: built for small teams; no enterprise contracts or per-seat licensing

## Research

- [Rōmy Labs](${SITE_URL}/labs): PIF-Bench, an open, rubric-graded benchmark of AI systems on nonprofit development work
${labs.join('\n')}

## Blog

- [Rōmy Blog](${SITE_URL}/blog): Essays and field notes on donor retention, major gifts, and nonprofit fundraising
${blog.join('\n')}

## Policies

- [Privacy](${SITE_URL}/privacy)
- [Terms](${SITE_URL}/terms)
- [Security](${SITE_URL}/security)
- [Sub-processors](${SITE_URL}/subprocessors)

## Contact

- Email: howard@getromy.app, solomon@getromy.app
- X: https://x.com/RomyFindsMoney
- GitHub: https://github.com/GetRomy-App
`;
	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=0, s-maxage=3600'
		}
	});
}
