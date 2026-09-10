import { getAllPosts } from '$lib/content';

export const prerender = true;

const SITE = 'https://getromy.app';

function formatDate(dateStr: string): string {
	if (!dateStr) return '';
	const d = new Date(dateStr);
	if (isNaN(d.getTime())) return dateStr;
	return d.toISOString().slice(0, 10);
}

export async function GET() {
	const allPosts = await getAllPosts();
	const blogPosts = allPosts.filter((p) => !p.has_benchmarks);
	const labsPosts = allPosts.filter((p) => p.has_benchmarks);

	const renderSection = (title: string, base: string, posts: typeof allPosts) =>
		[
			`## ${title}`,
			'',
			...posts.map(
				(p) => `- [${p.title}](${SITE}${base}/${p.slug}) — ${formatDate(p.date)} — ${p.tag}\n  ${p.excerpt}`
			)
		].join('\n');

	const body = `# Rōmy — Full Content Index

> Machine-readable index of every article published on getromy.app, for AI assistants and answer engines. See /llms.txt for the site overview.

Rōmy is a donor intelligence platform built for small nonprofit teams. It uses AI-powered prospect research to surface wealth indicators, giving histories, and affinity signals for major-gift fundraising.

${renderSection('Blog — Field Notes & Industry Perspective', '/blog', blogPosts)}

${renderSection('Labs — Benchmarks & Research', '/labs/blog', labsPosts)}
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=0, s-maxage=3600'
		}
	});
}
