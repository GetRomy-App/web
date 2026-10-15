<script lang="ts">
	import {
		SITE_NAME,
		TWITTER_HANDLE,
		DEFAULT_OG_IMAGE,
		DEFAULT_OG_IMAGE_ALT,
		absoluteUrl,
		truncate,
		jsonLdScript
	} from '$lib/seo';

	interface Props {
		title: string;
		description: string;
		path: string;
		type?: 'website' | 'article';
		image?: string;
		imageAlt?: string;
		keywords?: string;
		published?: string;
		section?: string;
		noindex?: boolean;
		jsonLd?: unknown[];
	}

	let {
		title,
		description,
		path,
		type = 'website',
		image = DEFAULT_OG_IMAGE,
		imageAlt = DEFAULT_OG_IMAGE_ALT,
		keywords,
		published,
		section,
		noindex = false,
		jsonLd = []
	}: Props = $props();

	const url = $derived(absoluteUrl(path));
	const desc = $derived(truncate(description));
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={desc} />
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
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={desc} />
	<meta property="og:image" content={image} />
	<meta property="og:image:alt" content={imageAlt} />
	<meta property="og:image:width" content="1920" />
	<meta property="og:image:height" content="1080" />
	{#if type === 'article' && published}
		<meta property="article:published_time" content={published} />
		<meta property="article:modified_time" content={published} />
		<meta property="article:author" content={SITE_NAME} />
	{/if}
	{#if type === 'article' && section}
		<meta property="article:section" content={section} />
	{/if}

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={TWITTER_HANDLE} />
	<meta name="twitter:creator" content={TWITTER_HANDLE} />
	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={desc} />
	<meta name="twitter:image" content={image} />
	<meta name="twitter:image:alt" content={imageAlt} />

	{#each jsonLd as block, i (i)}
		{@html jsonLdScript(block)}
	{/each}
</svelte:head>
