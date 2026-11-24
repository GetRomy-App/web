<script lang="ts">
	import {
		SITE_NAME,
		TWITTER_HANDLE,
		DEFAULT_OG_IMAGE,
		DEFAULT_OG_IMAGE_WIDTH,
		DEFAULT_OG_IMAGE_HEIGHT,
		absoluteUrl,
		metaDescription,
		jsonLd
	} from '$lib/seo';

	interface Props {
		/** Full <title>. Keep under ~60 characters where possible. */
		title: string;
		/** Long copy is fine — it is trimmed to snippet length automatically. */
		description: string;
		/** Site path, e.g. "/blog/the-ninth-card". */
		path: string;
		/** Social-card title; defaults to `title`. */
		ogTitle?: string;
		type?: 'website' | 'article';
		image?: string;
		imageAlt?: string;
		keywords?: string;
		robots?: string;
		publishedTime?: string;
		modifiedTime?: string;
		section?: string;
		tags?: string[];
		/** One or more schema.org nodes; wrapped in a single @graph. */
		schema?: Record<string, unknown>[];
	}

	let {
		title,
		description,
		path,
		ogTitle,
		type = 'website',
		image = DEFAULT_OG_IMAGE,
		imageAlt = 'Rōmy — donor intelligence for small nonprofits',
		keywords,
		robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
		publishedTime,
		modifiedTime,
		section,
		tags = [],
		schema = []
	}: Props = $props();

	const url = $derived(absoluteUrl(path));
	const desc = $derived(metaDescription(description));
	const img = $derived(absoluteUrl(image));
	const isDefaultImage = $derived(img === DEFAULT_OG_IMAGE);
	const graph = $derived(
		schema.length ? jsonLd({ '@context': 'https://schema.org', '@graph': schema }) : ''
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={desc} />
	{#if keywords}
		<meta name="keywords" content={keywords} />
	{/if}
	<meta name="robots" content={robots} />
	<meta name="googlebot" content={robots} />
	<link rel="canonical" href={url} />

	<!-- Open Graph -->
	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={ogTitle ?? title} />
	<meta property="og:description" content={desc} />
	<meta property="og:image" content={img} />
	<meta property="og:image:secure_url" content={img} />
	<meta property="og:image:alt" content={imageAlt} />
	{#if isDefaultImage}
		<meta property="og:image:width" content={String(DEFAULT_OG_IMAGE_WIDTH)} />
		<meta property="og:image:height" content={String(DEFAULT_OG_IMAGE_HEIGHT)} />
		<meta property="og:image:type" content="image/jpeg" />
	{/if}
	{#if type === 'article'}
		{#if publishedTime}
			<meta property="article:published_time" content={publishedTime} />
		{/if}
		{#if modifiedTime}
			<meta property="article:modified_time" content={modifiedTime} />
		{/if}
		{#if section}
			<meta property="article:section" content={section} />
		{/if}
		<meta property="article:publisher" content="https://x.com/RomyFindsMoney" />
		{#each tags as tag (tag)}
			<meta property="article:tag" content={tag} />
		{/each}
	{/if}

	<!-- Twitter / X -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={TWITTER_HANDLE} />
	<meta name="twitter:creator" content={TWITTER_HANDLE} />
	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={ogTitle ?? title} />
	<meta name="twitter:description" content={desc} />
	<meta name="twitter:image" content={img} />
	<meta name="twitter:image:alt" content={imageAlt} />

	{#if graph}
		{@html graph}
	{/if}
</svelte:head>
