<script lang="ts">
	import { absoluteUrl, DEFAULT_OG_IMAGE, jsonLdScript, toMetaDescription } from '$lib/seo';

	interface Props {
		title: string;
		description: string;
		path: string;
		type?: 'website' | 'article';
		/** Shorter title for social cards; falls back to `title`. */
		socialTitle?: string;
		image?: string;
		published?: string;
		section?: string;
		jsonLd?: unknown[];
	}

	let {
		title,
		description,
		path,
		type = 'website',
		socialTitle,
		image = DEFAULT_OG_IMAGE,
		published,
		section,
		jsonLd = []
	}: Props = $props();

	const url = $derived(absoluteUrl(path));
	const desc = $derived(toMetaDescription(description));
	const ogTitle = $derived(socialTitle ?? title);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={desc} />
	<link rel="canonical" href={url} />

	<meta property="og:type" content={type} />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={ogTitle} />
	<meta property="og:description" content={desc} />
	<meta property="og:image" content={image} />
	<meta property="og:image:alt" content={ogTitle} />
	{#if type === 'article'}
		{#if published}<meta property="article:published_time" content={published} />{/if}
		{#if section}<meta property="article:section" content={section} />{/if}
	{/if}

	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={ogTitle} />
	<meta name="twitter:description" content={desc} />
	<meta name="twitter:image" content={image} />

	{#each jsonLd as block, i (i)}
		{@html jsonLdScript(block)}
	{/each}
</svelte:head>
