<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description: string;
		url: string;
		keywords?: string;
		type?: 'website' | 'article';
		image?: string;
		siteName?: string;
		articlePublishedTime?: string;
		articleSection?: string;
		extra?: Snippet;
	}

	let {
		title,
		description,
		url,
		keywords,
		type = 'website',
		image,
		siteName = 'Rōmy',
		articlePublishedTime,
		articleSection,
		extra
	}: Props = $props();
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
		content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
	/>
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content={type} />
	<meta property="og:url" content={url} />
	<meta property="og:site_name" content={siteName} />
	{#if image}
		<meta property="og:image" content={image} />
	{/if}
	{#if articlePublishedTime}
		<meta property="article:published_time" content={articlePublishedTime} />
	{/if}
	{#if articleSection}
		<meta property="article:section" content={articleSection} />
	{/if}
	<meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	{#if image}
		<meta name="twitter:image" content={image} />
	{/if}
	<link rel="canonical" href={url} />
	{@render extra?.()}
</svelte:head>
