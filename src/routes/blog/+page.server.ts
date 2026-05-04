import type { PageServerLoad } from './$types';
import { getAllPosts } from '$lib/content';

export const prerender = true;

export const load: PageServerLoad = async () => {
	const allPosts = await getAllPosts();
	// Benchmark / research posts live on /labs — keep /blog focused on field-facing writing.
	const posts = allPosts.filter((p) => !p.has_benchmarks);
	return { posts };
};
