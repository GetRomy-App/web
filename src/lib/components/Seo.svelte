<!--
	Single source of truth for per-page <head> SEO tags: title, description,
	canonical, Open Graph, Twitter and JSON-LD. Use once per page.
-->
<script lang="ts">
	import { SITE_NAME, DEFAULT_OG_IMAGE, absoluteUrl, jsonLdString, toIsoDate } from '$lib/seo';

	interface Props {
		/** Full <title> text. */
		title: string;
		description: string;
		/** Site-relative path used for canonical / og:url, e.g. "/blog". */
		path: string;
		/** Social title if it should differ from the <title>. */
		ogTitle?: string;
		type?: 'website' | 'article';
		keywords?: string[];
		image?: { url: string; width?: number; height?: number; alt?: string };
		published?: string;
		modified?: string;
		section?: string;
		noindex?: boolean;
		jsonLd?: Record<string, unknown>[];
	}

	let {
		title,
		description,
		path,
		ogTitle,
		type = 'website',
		keywords = [],
		image = DEFAULT_OG_IMAGE,
		published,
		modified,
		section,
		noindex = false,
		jsonLd = []
	}: Props = $props();

	const url = $derived(absoluteUrl(path));
	const social = $derived(ogTitle ?? title);
	const imageUrl = $derived(absoluteUrl(image.url));
	const publishedIso = $derived(toIsoDate(published));
	const modifiedIso = $derived(toIsoDate(modified) ?? publishedIso);
	const robots = $derived(
		noindex
			? 'noindex, follow'
			: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	{#if keywords.length}
		<meta name="keywords" content={keywords.join(', ')} />
	{/if}
	<meta name="robots" content={robots} />
	<meta name="googlebot" content={robots} />
	<link rel="canonical" href={url} />

	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={social} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:secure_url" content={imageUrl} />
	{#if image.width}<meta property="og:image:width" content={String(image.width)} />{/if}
	{#if image.height}<meta property="og:image:height" content={String(image.height)} />{/if}
	{#if image.alt}<meta property="og:image:alt" content={image.alt} />{/if}

	{#if type === 'article'}
		{#if publishedIso}<meta property="article:published_time" content={publishedIso} />{/if}
		{#if modifiedIso}<meta property="article:modified_time" content={modifiedIso} />{/if}
		{#if section}<meta property="article:section" content={section} />{/if}
		<meta property="article:author" content={SITE_NAME} />
		{#each keywords as tag (tag)}
			<meta property="article:tag" content={tag} />
		{/each}
	{/if}

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={social} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />
	{#if image.alt}<meta name="twitter:image:alt" content={image.alt} />{/if}

	{#each jsonLd as data, i (i)}
		{@html `<script type="application/ld+json">${jsonLdString(data)}</script>`}
	{/each}
</svelte:head>
