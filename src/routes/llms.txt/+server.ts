import { getAllPosts, postPath } from '$lib/content';
import { getAllLegalPages } from '$lib/legal';
import { PIF_REPO } from '$lib/benchmarks';
import { APP_URL, SITE_URL, clip } from '$lib/seo';

export const prerender = true;

/** One-line link entry in the llms.txt format: "- [Title](url): description". */
function entry(title: string, path: string, description: string): string {
	const note = description ? `: ${description.replace(/\s+/g, ' ').trim()}` : '';
	return `- [${title.replace(/[[\]]/g, '')}](${SITE_URL}${path})${note}`;
}

/**
 * llms.txt (https://llmstxt.org) — a plain-text map of the site for language models and AI
 * answer engines. Generated from the same content as the pages so it never drifts.
 */
export async function GET() {
	const [posts, legalPages] = await Promise.all([getAllPosts(), getAllLegalPages()]);

	const describe = (p: (typeof posts)[number]) => p.seo_description || clip(p.excerpt, 200);
	const labs = posts.filter((p) => p.has_benchmarks);
	const blog = posts.filter((p) => !p.has_benchmarks);
	const tags = [...new Set(blog.map((p) => p.tag).filter(Boolean))];

	const lines: string[] = [
		'# Rōmy',
		'',
		'> Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions.',
		'',
		'Rōmy is a donor intelligence platform built for small nonprofit teams. It uses AI-powered prospect research to surface wealth indicators, giving histories, and affinity signals — then distills them into actionable donor profiles.',
		'',
		'- Name: Rōmy (written with a macron over the "o"; sometimes typed "Romy"). Company: GetRomy LLC.',
		'- Category: prospect research / donor intelligence / wealth screening software for nonprofit fundraising.',
		'- Audience: small nonprofit development teams, major gift officers and prospect researchers.',
		`- Website: ${SITE_URL} — Product: ${APP_URL}`,
		'',
		'## Features',
		'',
		'- Donor Discovery: AI-powered prospect research with wealth indicators, giving history, and affinity signals',
		'- Fraction of the Cost: No enterprise contracts or per-seat licensing — donor intelligence at a price built for small nonprofits',
		'- Ready to Act On: Every prospect comes with connection points, giving capacity, and outreach angles',
		'',
		'## Key pages',
		'',
		entry('Home', '/', 'What Rōmy is and who it is for'),
		entry(
			'Rōmy Labs — PIF-Bench v2',
			'/labs',
			'An open, rubric-graded benchmark of AI systems on nonprofit development work. Live track, share of checks met on real prospects: Claude.ai 83%, Rōmy 74%, Gemini 67%, ChatGPT 60%; no product met every check'
		),
		entry(
			'Blog',
			'/blog',
			'Field notes and research on major gifts, donor stewardship, planned giving and prospect research'
		),
		entry('Status', '/status', 'Live uptime and incident history'),
		`- [PIF-Bench on GitHub](${PIF_REPO}): rubrics, reports and every verdict behind the benchmark`,
		''
	];

	if (labs.length) {
		lines.push('## Research and benchmarks', '');
		for (const p of labs) lines.push(entry(p.title, postPath(p), describe(p)));
		lines.push('');
	}

	for (const tag of tags) {
		lines.push(`## Blog — ${tag}`, '');
		for (const p of blog.filter((b) => b.tag === tag)) {
			lines.push(entry(p.title, postPath(p), describe(p)));
		}
		lines.push('');
	}

	lines.push('## Legal and trust', '', entry('Legal overview', '/legal', ''));
	const LEGAL_ROUTES: Record<string, string> = {
		privacy: '/privacy',
		'prospect-privacy': '/privacy/prospects',
		terms: '/terms',
		aup: '/aup',
		cookies: '/cookies',
		dpa: '/dpa',
		security: '/security',
		subprocessors: '/subprocessors'
	};
	for (const page of legalPages) {
		const route = LEGAL_ROUTES[page.slug];
		if (route) lines.push(entry(page.title, route, page.description ?? ''));
	}

	lines.push(
		'',
		'## Links',
		'',
		`- Website: ${SITE_URL}`,
		`- Product: ${APP_URL}`,
		'- Twitter: https://x.com/RomyFindsMoney',
		'- GitHub: https://github.com/GetRomy-App',
		`- Blog RSS: ${SITE_URL}/blog/rss.xml`,
		`- Sitemap: ${SITE_URL}/sitemap.xml`,
		'- Contact: howard@getromy.app, solomon@getromy.app',
		'',
		'## Company',
		'',
		'GetRomy LLC',
		''
	);

	return new Response(lines.join('\n'), {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=0, s-maxage=3600'
		}
	});
}
