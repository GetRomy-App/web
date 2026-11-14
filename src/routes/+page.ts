import type { PageLoad } from './$types';

// Static HTML for the landing page: fastest TTFB/LCP and fully crawlable markup.
export const prerender = true;

export const load: PageLoad = async () => {
	return {};
};
