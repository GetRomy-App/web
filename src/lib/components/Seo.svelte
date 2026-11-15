<script lang="ts">
	import {
		SITE_NAME,
		TWITTER_HANDLE,
		DEFAULT_OG_IMAGE,
		DEFAULT_OG_IMAGE_ALT,
		absoluteUrl,
		clip,
		jsonLdScript,
		toIsoDate
	} from '$lib/seo';

	interface Props {
		/** Full <title>, already including the brand. */
		title: string;
		description: string;
		/** Site-relative canonical path, e.g. "/blog/my-post". */
		path: string;
		/** Shorter title for social cards; defaults to `title`. */
		socialTitle?: string;
		type?: 'website' | 'article';
		image?: string;
		imageAlt?: string;
		keywords?: string[];
		published?: string;
		section?: string;
		noindex?: boolean;
		jsonLd?: unknown[];
	}

	let {
		title,
		description,
		path,
		socialTitle,
		type = 'website',
		image = DEFAULT_OG_IMAGE,
		imageAlt = DEFAULT_OG_IMAGE_ALT,
		keywords = [],
		published,
		section,
		noindex = false,
		jsonLd = []
	}: Props = $props();

	const url = $derived(absoluteUrl(path));
	const metaDescription = $derived(clip(description, 158));
	const socialDescription = $derived(clip(description, 200));
	const imageUrl = $derived(absoluteUrl(image));
	const publishedIso = $derived(toIsoDate(published));
	const ogTitle = $derived(socialTitle ?? title);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={metaDescription} />
	{#if keywords.length}
		<meta name="keywords" content={keywords.join(', ')} />
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
	<meta property="og:url" content={url} />
	<meta property="og:title" content={ogTitle} />
	<meta property="og:description" content={socialDescription} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={imageAlt} />
	{#if type === 'article'}
		{#if publishedIso}
			<meta property="article:published_time" content={publishedIso} />
			<meta property="article:modified_time" content={publishedIso} />
		{/if}
		{#if section}
			<meta property="article:section" content={section} />
		{/if}
		<meta property="article:author" content={SITE_NAME} />
		{#each keywords as keyword}
			<meta property="article:tag" content={keyword} />
		{/each}
	{/if}

	<!-- Twitter / X -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={TWITTER_HANDLE} />
	<meta name="twitter:creator" content={TWITTER_HANDLE} />
	<meta name="twitter:title" content={ogTitle} />
	<meta name="twitter:description" content={socialDescription} />
	<meta name="twitter:image" content={imageUrl} />
	<meta name="twitter:image:alt" content={imageAlt} />

	<!-- Structured data (JSON-LD) -->
	{#each jsonLd as block}
		{@html jsonLdScript(block)}
	{/each}
</svelte:head>
