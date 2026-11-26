<script lang="ts">
	import {
		SITE_NAME,
		TWITTER_HANDLE,
		DEFAULT_OG_IMAGE,
		absoluteUrl,
		isoDate,
		jsonLdScript
	} from '$lib/seo';

	interface Props {
		/** Full <title> text, brand included. */
		title: string;
		description: string;
		/** Path on getromy.app, e.g. "/blog/her-first-ask". */
		path: string;
		/** Shorter title for social cards; defaults to `title`. */
		ogTitle?: string;
		type?: 'website' | 'article';
		keywords?: string[];
		image?: { url: string; width?: number; height?: number; alt?: string };
		published?: string;
		modified?: string;
		section?: string;
		tags?: string[];
		noindex?: boolean;
		/** One or more JSON-LD objects for this page. */
		schema?: unknown[];
	}

	let {
		title,
		description,
		path,
		ogTitle,
		type = 'website',
		keywords = [],
		image = DEFAULT_OG_IMAGE,
		published,
		modified,
		section,
		tags = [],
		noindex = false,
		schema = []
	}: Props = $props();

	const url = $derived(absoluteUrl(path));
	const socialTitle = $derived(ogTitle ?? title);
	const publishedIso = $derived(isoDate(published));
	const modifiedIso = $derived(isoDate(modified ?? published));
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

	<!-- Open Graph -->
	<meta property="og:type" content={type} />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={socialTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:image" content={image.url} />
	<meta property="og:image:secure_url" content={image.url} />
	{#if image.width}<meta property="og:image:width" content={String(image.width)} />{/if}
	{#if image.height}<meta property="og:image:height" content={String(image.height)} />{/if}
	{#if image.alt}<meta property="og:image:alt" content={image.alt} />{/if}

	{#if type === 'article'}
		{#if publishedIso}<meta property="article:published_time" content={publishedIso} />{/if}
		{#if modifiedIso}<meta property="article:modified_time" content={modifiedIso} />{/if}
		{#if section}<meta property="article:section" content={section} />{/if}
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
	<meta name="twitter:title" content={socialTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image.url} />
	{#if image.alt}<meta name="twitter:image:alt" content={image.alt} />{/if}

	{#each schema as item, i (i)}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html jsonLdScript(item)}
	{/each}
</svelte:head>
