<script lang="ts">
	import {
		SITE_NAME,
		DEFAULT_OG_IMAGE,
		DEFAULT_OG_IMAGE_ALT,
		absoluteUrl,
		serializeJsonLd
	} from '$lib/seo';

	interface Props {
		/** Full <title>, brand included. */
		title: string;
		description: string;
		/** Site path of the canonical URL, e.g. "/blog/the-yellow-legal-pad". */
		path: string;
		/** Shorter headline for social cards; defaults to `title`. */
		socialTitle?: string;
		socialDescription?: string;
		type?: 'website' | 'article';
		keywords?: string[];
		image?: string;
		imageAlt?: string;
		noindex?: boolean;
		published?: string;
		modified?: string;
		section?: string;
		tags?: string[];
		/** One JSON-LD document (use `graph()` from $lib/seo to combine nodes). */
		jsonLd?: object;
	}

	let {
		title,
		description,
		path,
		socialTitle,
		socialDescription,
		type = 'website',
		keywords = [],
		image = DEFAULT_OG_IMAGE,
		imageAlt = DEFAULT_OG_IMAGE_ALT,
		noindex = false,
		published,
		modified,
		section,
		tags = [],
		jsonLd
	}: Props = $props();

	const url = $derived(absoluteUrl(path));
	const ogTitle = $derived(socialTitle ?? title);
	const ogDescription = $derived(socialDescription ?? description);
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
	<link rel="canonical" href={url} />

	<meta property="og:type" content={type} />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={ogTitle} />
	<meta property="og:description" content={ogDescription} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:image" content={image} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={imageAlt} />
	{#if type === 'article'}
		{#if published}<meta property="article:published_time" content={published} />{/if}
		{#if modified}<meta property="article:modified_time" content={modified} />{/if}
		{#if section}<meta property="article:section" content={section} />{/if}
		{#each tags as tag}<meta property="article:tag" content={tag} />{/each}
	{/if}

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={ogTitle} />
	<meta name="twitter:description" content={ogDescription} />
	<meta name="twitter:image" content={image} />
	<meta name="twitter:image:alt" content={imageAlt} />

	{#if jsonLd}
		{@html `<script type="application/ld+json">${serializeJsonLd(jsonLd)}</` + `script>`}
	{/if}
</svelte:head>
