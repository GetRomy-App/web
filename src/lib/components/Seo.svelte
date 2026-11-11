<script lang="ts">
	import {
		DEFAULT_IMAGE,
		LOCALE,
		SITE_NAME,
		TWITTER,
		absoluteUrl,
		isoDate,
		jsonLd,
		truncate
	} from '$lib/seo';

	interface Props {
		/** Full <title>. Pages pass the finished string; keep it under ~60 chars. */
		title: string;
		description: string;
		/** Path ("/blog/foo") or absolute URL. Becomes the one and only canonical. */
		path: string;
		type?: 'website' | 'article';
		keywords?: string[];
		image?: { url: string; width?: number; height?: number; alt?: string };
		noindex?: boolean;
		/** Article-only. */
		published?: string;
		section?: string;
		/** Social title if it should differ from <title> (e.g. without the brand suffix). */
		socialTitle?: string;
		/** One or more JSON-LD objects. */
		schema?: unknown;
	}

	let {
		title,
		description,
		path,
		type = 'website',
		keywords = [],
		image = DEFAULT_IMAGE,
		noindex = false,
		published,
		section,
		socialTitle,
		schema
	}: Props = $props();

	const url = $derived(absoluteUrl(path));
	const desc = $derived(truncate(description, 160));
	const ogTitle = $derived(socialTitle ?? title);
	const imageUrl = $derived(absoluteUrl(image.url));
	const publishedIso = $derived(isoDate(published));
	const robots = $derived(
		noindex
			? 'noindex, follow'
			: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
	);
	const schemas = $derived(schema ? (Array.isArray(schema) ? schema : [schema]) : []);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={desc} />
	{#if keywords.length}
		<meta name="keywords" content={keywords.join(', ')} />
	{/if}
	<meta name="robots" content={robots} />
	<link rel="canonical" href={url} />
	<link rel="alternate" hreflang="en" href={url} />
	<link rel="alternate" hreflang="x-default" href={url} />

	<!-- Open Graph -->
	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content={LOCALE} />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={ogTitle} />
	<meta property="og:description" content={desc} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:secure_url" content={imageUrl} />
	{#if image.width}<meta property="og:image:width" content={String(image.width)} />{/if}
	{#if image.height}<meta property="og:image:height" content={String(image.height)} />{/if}
	{#if image.alt}<meta property="og:image:alt" content={image.alt} />{/if}
	{#if type === 'article'}
		{#if publishedIso}
			<meta property="article:published_time" content={publishedIso} />
			<meta property="article:modified_time" content={publishedIso} />
		{/if}
		<meta property="article:author" content={SITE_NAME} />
		<meta property="article:publisher" content="https://x.com/RomyFindsMoney" />
		{#if section}<meta property="article:section" content={section} />{/if}
		{#each keywords.slice(0, 6) as tag (tag)}
			<meta property="article:tag" content={tag} />
		{/each}
	{/if}

	<!-- Twitter / X -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={TWITTER} />
	<meta name="twitter:creator" content={TWITTER} />
	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={ogTitle} />
	<meta name="twitter:description" content={desc} />
	<meta name="twitter:image" content={imageUrl} />
	{#if image.alt}<meta name="twitter:image:alt" content={image.alt} />{/if}

	{#each schemas as s, i (i)}
		{@html jsonLd(s)}
	{/each}
</svelte:head>
