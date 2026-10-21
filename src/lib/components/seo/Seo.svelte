<script lang="ts">
	import {
		SITE_URL,
		SITE_NAME,
		DEFAULT_IMAGE,
		DEFAULT_IMAGE_ALT,
		TWITTER_HANDLE,
		jsonLdScript
	} from '$lib/seo';

	interface Props {
		title: string;
		description?: string;
		path: string;
		keywords?: string;
		type?: 'website' | 'article';
		image?: string;
		imageAlt?: string;
		published?: string;
		section?: string;
		robots?: string;
		jsonLd?: unknown[];
	}

	let {
		title,
		description,
		path,
		keywords,
		type = 'website',
		image = DEFAULT_IMAGE,
		imageAlt = DEFAULT_IMAGE_ALT,
		published,
		section,
		robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
		jsonLd = []
	}: Props = $props();

	const url = $derived(`${SITE_URL}${path}`);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="title" content={title} />
	{#if description}
		<meta name="description" content={description} />
	{/if}
	{#if keywords}
		<meta name="keywords" content={keywords} />
	{/if}
	<meta name="robots" content={robots} />
	<link rel="canonical" href={url} />

	<meta property="og:type" content={type} />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	{#if description}
		<meta property="og:description" content={description} />
	{/if}
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:image" content={image} />
	<meta property="og:image:alt" content={imageAlt} />
	<meta property="og:image:width" content="1920" />
	<meta property="og:image:height" content="1080" />
	{#if type === 'article'}
		{#if published}<meta property="article:published_time" content={published} />{/if}
		{#if published}<meta property="article:modified_time" content={published} />{/if}
		{#if section}<meta property="article:section" content={section} />{/if}
		<meta property="article:author" content="{SITE_URL}/" />
	{/if}

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={TWITTER_HANDLE} />
	<meta name="twitter:creator" content={TWITTER_HANDLE} />
	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={title} />
	{#if description}
		<meta name="twitter:description" content={description} />
	{/if}
	<meta name="twitter:image" content={image} />
	<meta name="twitter:image:alt" content={imageAlt} />

	{#each jsonLd as block}
		{@html jsonLdScript(block)}
	{/each}
</svelte:head>
