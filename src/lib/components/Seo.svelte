<script lang="ts">
	import {
		SITE_NAME,
		DEFAULT_OG_IMAGE,
		OG_IMAGE_WIDTH,
		OG_IMAGE_HEIGHT,
		TWITTER_HANDLE,
		absoluteUrl,
		metaDescription,
		isoDate,
		jsonLd
	} from '$lib/seo';

	interface Props {
		/** Full <title> text, brand included. */
		title: string;
		description: string;
		/** Path relative to the site root, e.g. "/blog/my-post". */
		path: string;
		keywords?: string[];
		type?: 'website' | 'article';
		image?: string;
		imageAlt?: string;
		/** Social title if different from the <title>. */
		ogTitle?: string;
		publishedTime?: string;
		modifiedTime?: string;
		section?: string;
		tags?: string[];
		noindex?: boolean;
		/** One or more schema.org objects (each with its own @context or a @graph). */
		schema?: unknown | unknown[];
	}

	let {
		title,
		description,
		path,
		keywords = [],
		type = 'website',
		image = DEFAULT_OG_IMAGE,
		imageAlt = 'Rōmy — AI donor intelligence and prospect research for small nonprofits',
		ogTitle,
		publishedTime,
		modifiedTime,
		section,
		tags = [],
		noindex = false,
		schema
	}: Props = $props();

	const url = $derived(absoluteUrl(path));
	const desc = $derived(metaDescription(description));
	const socialTitle = $derived(ogTitle ?? title);
	const img = $derived(absoluteUrl(image));
	const schemas = $derived(schema ? (Array.isArray(schema) ? schema : [schema]) : []);
	const robots = $derived(
		noindex
			? 'noindex, follow'
			: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={desc} />
	{#if keywords.length}
		<meta name="keywords" content={keywords.join(', ')} />
	{/if}
	<meta name="robots" content={robots} />
	<meta name="googlebot" content={robots} />
	<meta name="bingbot" content={robots} />
	<link rel="canonical" href={url} />
	<link rel="alternate" hreflang="en-us" href={url} />
	<link rel="alternate" hreflang="x-default" href={url} />

	<!-- Open Graph -->
	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={socialTitle} />
	<meta property="og:description" content={desc} />
	<meta property="og:image" content={img} />
	<meta property="og:image:secure_url" content={img} />
	{#if img === DEFAULT_OG_IMAGE}
		<meta property="og:image:width" content={String(OG_IMAGE_WIDTH)} />
		<meta property="og:image:height" content={String(OG_IMAGE_HEIGHT)} />
		<meta property="og:image:type" content="image/jpeg" />
	{/if}
	<meta property="og:image:alt" content={imageAlt} />

	{#if type === 'article'}
		{#if isoDate(publishedTime)}
			<meta property="article:published_time" content={isoDate(publishedTime)} />
		{/if}
		{#if isoDate(modifiedTime ?? publishedTime)}
			<meta property="article:modified_time" content={isoDate(modifiedTime ?? publishedTime)} />
		{/if}
		<meta property="article:author" content={SITE_NAME} />
		<meta property="article:publisher" content="https://getromy.app" />
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
	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={socialTitle} />
	<meta name="twitter:description" content={desc} />
	<meta name="twitter:image" content={img} />
	<meta name="twitter:image:alt" content={imageAlt} />

	{#each schemas as s, i (i)}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html jsonLd(s)}
	{/each}
</svelte:head>
