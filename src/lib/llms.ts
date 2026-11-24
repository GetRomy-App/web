import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { getAllPosts, type PostMeta } from '$lib/content';
import { SITE_URL, metaDescription } from '$lib/seo';

/**
 * llms.txt (https://llmstxt.org) — a plain-Markdown map of the site for AI answer engines
 * (ChatGPT search, Perplexity, Claude, Gemini, Google AI Overviews). Generated at build time
 * so every post is listed without anyone having to remember to update a static file.
 */

export const LLMS_INTRO = `# Rōmy

> Rōmy is a donor intelligence and AI prospect research platform that helps small nonprofits find new major donors at a fraction of the cost of existing solutions.

Rōmy is built by GetRomy LLC for small nonprofit teams: development directors, executive directors, major gift officers and prospect researchers. It uses AI-powered prospect research to surface wealth indicators, giving histories, and affinity signals, then distills them into actionable donor profiles.

## Key facts

- Name: Rōmy (written with a macron over the "o")
- Category: donor intelligence, prospect research, wealth screening software for nonprofits
- Who it is for: small nonprofits that cannot justify enterprise wealth-screening contracts
- Product app: https://intel.getromy.app
- Company: GetRomy LLC

## Features

- Donor Discovery: AI-powered prospect research with wealth indicators, giving history, and affinity signals
- Fraction of the Cost: No enterprise contracts or per-seat licensing — donor intelligence at a price built for small nonprofits
- Ready to Act On: Every prospect comes with connection points, giving capacity, and outreach angles

## Research

- [PIF-Bench v2](${SITE_URL}/labs): an open, rubric-graded benchmark of AI systems on 25 real nonprofit development-office tasks with 331 pass/fail checks, graded blind. Rubrics and verdicts: https://github.com/getromy-app/pif-bench

## Links

- Website: ${SITE_URL}
- Product: https://intel.getromy.app
- Blog: ${SITE_URL}/blog
- Labs: ${SITE_URL}/labs
- RSS: ${SITE_URL}/blog/rss.xml
- Full text for LLMs: ${SITE_URL}/llms-full.txt
- Status: ${SITE_URL}/status
- Legal: ${SITE_URL}/legal
- Twitter: https://x.com/RomyFindsMoney
- GitHub: https://github.com/GetRomy-App
- Contact: howard@getromy.app, solomon@getromy.app
`;

export function postUrl(p: PostMeta): string {
	return `${SITE_URL}${p.has_benchmarks ? '/labs/blog/' : '/blog/'}${p.slug}`;
}

export async function postIndexMarkdown(): Promise<string> {
	const posts = await getAllPosts();
	const groups = new Map<string, PostMeta[]>();
	for (const p of posts) {
		const key = p.has_benchmarks ? 'Labs' : p.tag || 'Blog';
		if (!groups.has(key)) groups.set(key, []);
		groups.get(key)!.push(p);
	}
	let out = '';
	for (const [group, list] of groups) {
		out += `\n## ${group === 'Labs' ? 'Labs research' : `Blog: ${group}`}\n\n`;
		for (const p of list) {
			out += `- [${p.title}](${postUrl(p)}) (${p.date}): ${metaDescription(p.excerpt, 220)}\n`;
		}
	}
	return out;
}

/** Full Markdown body of every post, for llms-full.txt. */
export async function postsFullMarkdown(): Promise<string> {
	const posts = await getAllPosts();
	const dir = path.join(process.cwd(), 'content', 'posts');
	const parts: string[] = [];
	for (const p of posts) {
		try {
			const raw = await fs.readFile(path.join(dir, p.slug, 'index.mdoc'), 'utf-8');
			const { content } = matter(raw);
			// Drop Markdoc tags ({% ... %}) — plain Markdown is what crawlers expect.
			const body = content.replace(/\{%[\s\S]*?%\}/g, '').trim();
			parts.push(`---\n\nURL: ${postUrl(p)}\nPublished: ${p.date}\nSection: ${p.tag}\n\n${body}\n`);
		} catch {
			// skip unreadable posts
		}
	}
	return parts.join('\n');
}

export function textResponse(body: string): Response {
	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=0, s-maxage=3600'
		}
	});
}
