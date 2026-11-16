<script lang="ts">
	import {
		SITE_NAME,
		TWITTER_HANDLE,
		DEFAULT_OG_IMAGE,
		DEFAULT_OG_IMAGE_ALT,
		absoluteUrl,
		clampDescription,
		isoDate,
		jsonLdScript
	} from '$lib/seo';

	interface Props {
		/** Full <title>. Pass `titleSuffix={false}` if it already contains the brand. */
		title: string;
		titleSuffix?: boolean;
		description: string;
		/** Path on getromy.app, e.g. `/blog/my-post`. Used for canonical + og:url. */
		path: string;
		type?: 'website' | 'article';
		image?: string;
		imageAlt?: string;
		keywords?: string[];
		published?: string;
		modified?: string;
		section?: string;
		tags?: string[];
		noindex?: boolean;
		jsonLd?: unknown[];
	}

	let {
		title,
		titleSuffix = true,
		description,
		path,
		type = 'website',
		image = DEFAULT_OG_IMAGE,
		imageAlt = DEFAULT_OG_IMAGE_ALT,
		keywords = [],
		published,
		modified,
		section,
		tags = [],
		noindex = false,
		jsonLd = []
	}: Props = $props();

	const fullTitle = $derived(titleSuffix ? `${title} — ${SITE_NAME}` : title);
	const desc = $derived(clampDescription(description));
	const url = $derived(absoluteUrl(path));
	const img = $derived(absoluteUrl(image));
	const publishedIso = $derived(isoDate(published));
	const modifiedIso = $derived(isoDate(modified ?? published));
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={desc} />
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
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={desc} />
	<meta property="og:image" content={img} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={imageAlt} />
	{#if type === 'article'}
		{#if publishedIso}
			<meta property="article:published_time" content={publishedIso} />
			<meta property="article:modified_time" content={modifiedIso} />
		{/if}
		{#if section}
			<meta property="article:section" content={section} />
		{/if}
		{#each tags as tag (tag)}
			<meta property="article:tag" content={tag} />
		{/each}
	{/if}

	<!-- Twitter / X -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={TWITTER_HANDLE} />
	<meta name="twitter:creator" content={TWITTER_HANDLE} />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={desc} />
	<meta name="twitter:image" content={img} />
	<meta name="twitter:image:alt" content={imageAlt} />

	{#each jsonLd as block, i (i)}
		{@html jsonLdScript(block)}
	{/each}
</svelte:head>
