import type { PageLoad } from './$types';

// Static marketing page: prerender for instant, crawlable HTML.
export const prerender = true;

export const load: PageLoad = async () => {
	return {};
};
