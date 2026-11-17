<script lang="ts">
	import { SITE_NAME, TWITTER_HANDLE, DEFAULT_OG_IMAGE, absoluteUrl, jsonLdScript } from '$lib/seo';

	interface Props {
		/** Full <title>, including the brand. */
		title: string;
		description: string;
		/** Site-relative canonical path, e.g. "/blog/my-post". */
		path: string;
		type?: 'website' | 'article';
		/** Shorter headline for social cards; defaults to `title`. */
		socialTitle?: string;
		socialDescription?: string;
		keywords?: string[] | string;
		publishedTime?: string;
		modifiedTime?: string;
		section?: string;
		noindex?: boolean;
		jsonLd?: unknown[];
	}

	let {
		title,
		description,
		path,
		type = 'website',
		socialTitle,
		socialDescription,
		keywords,
		publishedTime,
		modifiedTime,
		section,
		noindex = false,
		jsonLd = []
	}: Props = $props();

	const url = $derived(absoluteUrl(path));
	const keywordList = $derived(
		Array.isArray(keywords) ? keywords : keywords ? keywords.split(',').map((k) => k.trim()) : []
	);
	const ogTitle = $derived(socialTitle ?? title);
	const ogDescription = $derived(socialDescription ?? description);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	{#if keywordList.length}
		<meta name="keywords" content={keywordList.join(', ')} />
	{/if}
	<meta
		name="robots"
		content={noindex
			? 'noindex, follow'
			: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}
	/>
	<link rel="canonical" href={url} />

	<!-- Open Graph -->
	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={ogTitle} />
	<meta property="og:description" content={ogDescription} />
	<meta property="og:image" content={DEFAULT_OG_IMAGE.url} />
	<meta property="og:image:width" content={String(DEFAULT_OG_IMAGE.width)} />
	<meta property="og:image:height" content={String(DEFAULT_OG_IMAGE.height)} />
	<meta property="og:image:alt" content={DEFAULT_OG_IMAGE.alt} />
	{#if type === 'article'}
		{#if publishedTime}
			<meta property="article:published_time" content={publishedTime} />
			<meta property="article:modified_time" content={modifiedTime ?? publishedTime} />
		{/if}
		{#if section}
			<meta property="article:section" content={section} />
		{/if}
		{#each keywordList as tag (tag)}
			<meta property="article:tag" content={tag} />
		{/each}
	{/if}

	<!-- Twitter / X -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={TWITTER_HANDLE} />
	<meta name="twitter:creator" content={TWITTER_HANDLE} />
	<meta name="twitter:title" content={ogTitle} />
	<meta name="twitter:description" content={ogDescription} />
	<meta name="twitter:image" content={DEFAULT_OG_IMAGE.url} />
	<meta name="twitter:image:alt" content={DEFAULT_OG_IMAGE.alt} />

	<!-- Structured data -->
	{#each jsonLd as item, i (i)}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- jsonLdScript escapes its payload -->
		{@html jsonLdScript(item)}
	{/each}
</svelte:head>
