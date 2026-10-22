<script lang="ts">
	import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE, TWITTER_HANDLE } from '$lib/seo';

	interface Props {
		title: string;
		description: string;
		/** Absolute-path route, e.g. "/blog/my-post". */
		path: string;
		type?: 'website' | 'article';
		keywords?: string;
		image?: string;
		imageAlt?: string;
		noindex?: boolean;
		published?: string;
		modified?: string;
		section?: string;
		jsonLd?: Record<string, unknown>[];
	}

	let {
		title,
		description,
		path,
		type = 'website',
		keywords,
		image = DEFAULT_OG_IMAGE,
		imageAlt = `${SITE_NAME} — donor intelligence for small nonprofits`,
		noindex = false,
		published,
		modified,
		section,
		jsonLd = []
	}: Props = $props();

	const url = $derived(`${SITE_URL}${path === '/' ? '/' : path}`);
	const imageUrl = $derived(image.startsWith('http') ? image : `${SITE_URL}${image}`);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={description} />
	{#if keywords}
		<meta name="keywords" content={keywords} />
	{/if}
	<meta
		name="robots"
		content={noindex
			? 'noindex, follow'
			: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}
	/>
	<link rel="canonical" href={url} />

	<meta property="og:type" content={type} />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:alt" content={imageAlt} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={TWITTER_HANDLE} />
	<meta name="twitter:creator" content={TWITTER_HANDLE} />
	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />
	<meta name="twitter:image:alt" content={imageAlt} />

	{#if type === 'article'}
		{#if published}<meta property="article:published_time" content={published} />{/if}
		{#if modified || published}
			<meta property="article:modified_time" content={modified ?? published} />
		{/if}
		{#if section}<meta property="article:section" content={section} />{/if}
		<meta property="article:author" content={SITE_NAME} />
	{/if}

	{#each jsonLd as block}
		{@html `<script type="application/ld+json">${JSON.stringify(block).replace(/</g, '\\u003c')}</script>`}
	{/each}
</svelte:head>
