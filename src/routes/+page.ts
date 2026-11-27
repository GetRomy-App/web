import type { PageLoad } from './$types';

// Static landing page — prerender so crawlers get instant, fully-rendered HTML.
export const prerender = true;

export const load: PageLoad = async () => {
	return {};
};
