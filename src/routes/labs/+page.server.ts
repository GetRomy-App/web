import type { PageServerLoad } from './$types';
import { getAllPosts } from '$lib/content';

export const prerender = true;

export const load: PageServerLoad = async () => {
	const allPosts = await getAllPosts();
	// Field-facing posts live on /blog. Labs is benchmarks / research only — no duplicates between the two.
	const posts = allPosts.filter((p) => p.has_benchmarks);
	return { posts };
};
