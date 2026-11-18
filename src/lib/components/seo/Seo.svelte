<script lang="ts">
	import {
		absoluteUrl,
		jsonLdScript,
		DEFAULT_OG_IMAGE,
		SITE_NAME,
		TWITTER_HANDLE,
		isoDate
	} from '$lib/seo';

	interface Props {
		/** Full <title>, already including the brand. */
		title: string;
		description?: string;
		/** Site-relative canonical path, e.g. `/blog/my-post`. */
		path: string;
		type?: 'website' | 'article';
		/** Shorter headline for social cards; defaults to `title`. */
		socialTitle?: string;
		socialDescription?: string;
		image?: string;
		imageAlt?: string;
		keywords?: string[];
		noindex?: boolean;
		article?: { published?: string; modified?: string; section?: string; tags?: string[] };
		schema?: Record<string, unknown>[];
	}

	let {
		title,
		description,
		path,
		type = 'website',
		socialTitle,
		socialDescription,
		image = DEFAULT_OG_IMAGE,
		imageAlt = 'Rōmy — donor intelligence for small nonprofits',
		keywords = [],
		noindex = false,
		article,
		schema = []
	}: Props = $props();

	const url = $derived(absoluteUrl(path));
	const ogTitle = $derived(socialTitle ?? title);
	const ogDescription = $derived(socialDescription ?? description);
	const published = $derived(isoDate(article?.published));
	const modified = $derived(isoDate(article?.modified ?? article?.published));
	const isDefaultImage = $derived(image === DEFAULT_OG_IMAGE);
</script>

<svelte:head>
	<title>{title}</title>
	{#if description}
		<meta name="description" content={description} />
	{/if}
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

	<meta property="og:type" content={type} />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={ogTitle} />
	{#if ogDescription}
		<meta property="og:description" content={ogDescription} />
	{/if}
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:image" content={image} />
	{#if isDefaultImage}
		<meta property="og:image:type" content="image/jpeg" />
		<meta property="og:image:width" content="1920" />
		<meta property="og:image:height" content="1080" />
	{/if}
	<meta property="og:image:alt" content={imageAlt} />

	{#if type === 'article'}
		{#if published}
			<meta property="article:published_time" content={published} />
		{/if}
		{#if modified}
			<meta property="article:modified_time" content={modified} />
		{/if}
		{#if article?.section}
			<meta property="article:section" content={article.section} />
		{/if}
		{#each article?.tags ?? [] as tag}
			<meta property="article:tag" content={tag} />
		{/each}
		<meta name="author" content={SITE_NAME} />
	{/if}

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={TWITTER_HANDLE} />
	<meta name="twitter:creator" content={TWITTER_HANDLE} />
	<meta name="twitter:title" content={ogTitle} />
	{#if ogDescription}
		<meta name="twitter:description" content={ogDescription} />
	{/if}
	<meta name="twitter:image" content={image} />
	<meta name="twitter:image:alt" content={imageAlt} />

	{#each schema as item}
		{@html jsonLdScript(item)}
	{/each}
</svelte:head>
