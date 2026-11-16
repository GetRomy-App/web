import type { PageLoad } from './$types';

// The landing page is fully static — prerender it for fastest TTFB / Core Web Vitals.
export const prerender = true;

export const load: PageLoad = async () => {
	return {};
};
