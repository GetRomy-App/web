import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),
		prerender: {
			// Machine-readable SEO/GEO endpoints aren't linked with <a>, so list them explicitly.
			entries: ['*', '/sitemap.xml', '/rss.xml', '/llms.txt', '/llms-full.txt']
		}
	}
};

export default config;
