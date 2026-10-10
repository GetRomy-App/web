<script lang="ts">
	import {
		DEFAULT_OG_IMAGE,
		DEFAULT_OG_IMAGE_ALT,
		SITE_NAME,
		absoluteUrl,
		jsonLdScript,
		toMetaDescription
	} from '$lib/seo';

	interface Props {
		title: string;
		description: string;
		path: string;
		keywords?: string;
		ogTitle?: string;
		ogDescription?: string;
		type?: 'website' | 'article';
		image?: string;
		imageAlt?: string;
		publishedTime?: string;
		section?: string;
		jsonLd?: unknown[];
	}

	let {
		title,
		description,
		path,
		keywords,
		ogTitle,
		ogDescription,
		type = 'website',
		image = DEFAULT_OG_IMAGE,
		imageAlt = DEFAULT_OG_IMAGE_ALT,
		publishedTime,
		section,
		jsonLd = []
	}: Props = $props();

	const url = $derived(absoluteUrl(path));
	const desc = $derived(toMetaDescription(description));
	const socialDesc = $derived(toMetaDescription(ogDescription ?? description, 200));
	const socialTitle = $derived(ogTitle ?? title);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={desc} />
	{#if keywords}
		<meta name="keywords" content={keywords} />
	{/if}
	<link rel="canonical" href={url} />

	<meta property="og:type" content={type} />
	<meta property="og:url" content={url} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:title" content={socialTitle} />
	<meta property="og:description" content={socialDesc} />
	<meta property="og:image" content={image} />
	<meta property="og:image:alt" content={imageAlt} />
	{#if type === 'article'}
		{#if publishedTime}
			<meta property="article:published_time" content={publishedTime} />
		{/if}
		{#if section}
			<meta property="article:section" content={section} />
		{/if}
		<meta property="article:author" content="Rōmy" />
	{/if}

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={socialTitle} />
	<meta name="twitter:description" content={socialDesc} />
	<meta name="twitter:image" content={image} />
	<meta name="twitter:image:alt" content={imageAlt} />

	{#each jsonLd as block}
		{@html jsonLdScript(block)}
	{/each}
</svelte:head>
