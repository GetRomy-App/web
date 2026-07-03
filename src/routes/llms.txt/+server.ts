import { getAllPosts } from '$lib/content';

export const prerender = true;

export const GET = async () => {
	const allPosts = await getAllPosts();
	const fieldPosts = allPosts.filter((p) => !p.has_benchmarks);
	const labsPosts = allPosts.filter((p) => p.has_benchmarks);

	const lines = [
		'# Rōmy',
		'',
		'> Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions.',
		'',
		'Rōmy is a donor intelligence platform built for small nonprofit teams. It uses AI-powered prospect research to surface wealth indicators, giving histories, and affinity signals — then distills them into actionable donor profiles.',
		'',
		'## Features',
		'',
		'- Donor Discovery: AI-powered prospect research with wealth indicators, giving history, and affinity signals',
		'- Fraction of the Cost: No enterprise contracts or per-seat licensing — donor intelligence at a price built for small nonprofits',
		'- Ready to Act On: Every prospect comes with connection points, giving capacity, and outreach angles',
		'',
		'## Links',
		'',
		'- Website: https://getromy.app',
		'- Product: https://intel.getromy.app',
		'- Download (macOS): https://github.com/GetRomy-App/web/releases',
		'- Twitter: https://x.com/RomyFindsMoney',
		'- GitHub: https://github.com/GetRomy-App',
		'- Contact: howard@getromy.app, solomon@getromy.app',
		'',
		'## Blog',
		'',
		...fieldPosts.map((p) => `- [${p.title}](https://getromy.app/blog/${p.slug}): ${p.excerpt}`),
		'',
		'## Labs (benchmarks & research)',
		'',
		...labsPosts.map(
			(p) => `- [${p.title}](https://getromy.app/labs/blog/${p.slug}): ${p.excerpt}`
		),
		'',
		'## Company',
		'',
		'GetRomy LLC',
		''
	];

	return new Response(lines.join('\n'), {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' }
	});
};
