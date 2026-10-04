<script lang="ts">
	import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '$lib/seo';

	interface Props {
		title: string;
		description: string;
		/** Path starting with "/" — drives canonical and og:url. */
		path: string;
		keywords?: string;
		type?: 'website' | 'article';
		image?: string;
		imageAlt?: string;
		published?: string;
		section?: string;
		noindex?: boolean;
		/** Extra JSON-LD objects, each emitted as its own script tag. */
		jsonLd?: Record<string, unknown>[];
	}

	let {
		title,
		description,
		path,
		keywords = '',
		type = 'website',
		image = DEFAULT_OG_IMAGE,
		imageAlt = `${SITE_NAME} — donor intelligence for small nonprofits`,
		published = '',
		section = '',
		noindex = false,
		jsonLd = []
	}: Props = $props();

	const url = $derived(`${SITE_URL}${path === '/' ? '/' : path}`);
	const imageUrl = $derived(image.startsWith('http') ? image : `${SITE_URL}${image}`);
	const robots = $derived(
		noindex
			? 'noindex, follow'
			: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={description} />
	{#if keywords}
		<meta name="keywords" content={keywords} />
	{/if}
	<meta name="robots" content={robots} />
	<link rel="canonical" href={url} />

	<meta property="og:type" content={type} />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:alt" content={imageAlt} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content="en_US" />
	{#if type === 'article' && published}
		<meta property="article:published_time" content={published} />
		<meta property="article:modified_time" content={published} />
		<meta property="article:author" content="GetRomy LLC" />
	{/if}
	{#if type === 'article' && section}
		<meta property="article:section" content={section} />
	{/if}

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />
	<meta name="twitter:image:alt" content={imageAlt} />

	{#each jsonLd as block}
		{@html `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', ...block }).replace(/</g, '\\u003c')}</script>`}
	{/each}
</svelte:head>
