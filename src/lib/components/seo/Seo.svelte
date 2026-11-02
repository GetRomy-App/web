<script lang="ts">
	import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE, jsonLdScript } from '$lib/seo';

	interface Props {
		title: string;
		description: string;
		/** Canonical path, e.g. "/blog/my-post". */
		path: string;
		type?: 'website' | 'article';
		keywords?: string;
		/** Short title for social cards (defaults to title). */
		socialTitle?: string;
		socialDescription?: string;
		published?: string;
		modified?: string;
		section?: string;
		robots?: string;
		jsonLd?: unknown[];
	}

	let {
		title,
		description,
		path,
		type = 'website',
		keywords,
		socialTitle,
		socialDescription,
		published,
		modified,
		section,
		robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
		jsonLd = []
	}: Props = $props();

	const url = $derived(SITE_URL + path);
	const ogTitle = $derived(socialTitle ?? title);
	const ogDescription = $derived(socialDescription ?? description);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	{#if keywords}
		<meta name="keywords" content={keywords} />
	{/if}
	<meta name="robots" content={robots} />
	<link rel="canonical" href={url} />

	<meta property="og:type" content={type} />
	<meta property="og:url" content={url} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:title" content={ogTitle} />
	<meta property="og:description" content={ogDescription} />
	<meta property="og:image" content={DEFAULT_OG_IMAGE.url} />
	<meta property="og:image:width" content={String(DEFAULT_OG_IMAGE.width)} />
	<meta property="og:image:height" content={String(DEFAULT_OG_IMAGE.height)} />
	<meta property="og:image:alt" content={DEFAULT_OG_IMAGE.alt} />

	{#if type === 'article'}
		{#if published}<meta property="article:published_time" content={published} />{/if}
		{#if modified ?? published}<meta
				property="article:modified_time"
				content={modified ?? published}
			/>{/if}
		{#if section}<meta property="article:section" content={section} />{/if}
		<meta property="article:author" content={SITE_URL} />
	{/if}

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@RomyFindsMoney" />
	<meta name="twitter:creator" content="@RomyFindsMoney" />
	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={ogTitle} />
	<meta name="twitter:description" content={ogDescription} />
	<meta name="twitter:image" content={DEFAULT_OG_IMAGE.url} />
	<meta name="twitter:image:alt" content={DEFAULT_OG_IMAGE.alt} />

	{#each jsonLd as block}
		{@html jsonLdScript(block)}
	{/each}
</svelte:head>
