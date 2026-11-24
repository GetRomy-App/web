import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),
		prerender: {
			// Feeds and machine-readable files aren't linked from page bodies, so list them explicitly.
			entries: ['*', '/sitemap.xml', '/blog/rss.xml', '/llms.txt', '/llms-full.txt']
		}
	}
};

export default config;
