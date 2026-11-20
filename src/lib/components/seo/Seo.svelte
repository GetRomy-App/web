<script lang="ts">
	import {
		SITE_NAME,
		TWITTER,
		DEFAULT_OG_IMAGE,
		DEFAULT_OG_IMAGE_ALT,
		absoluteUrl,
		clip,
		isoDate,
		jsonLdScript
	} from '$lib/seo';

	interface Props {
		/** Full <title> text. */
		title: string;
		description: string;
		/** Site path, e.g. "/blog/the-ninth-card". */
		path: string;
		type?: 'website' | 'article';
		keywords?: string[];
		image?: string;
		imageAlt?: string;
		published?: string;
		section?: string;
		noindex?: boolean;
		jsonLd?: unknown[];
	}

	let {
		title,
		description,
		path,
		type = 'website',
		keywords = [],
		image = DEFAULT_OG_IMAGE,
		imageAlt = DEFAULT_OG_IMAGE_ALT,
		published,
		section,
		noindex = false,
		jsonLd = []
	}: Props = $props();

	const url = $derived(absoluteUrl(path));
	const desc = $derived(clip(description));
	const img = $derived(absoluteUrl(image));
	const publishedIso = $derived(isoDate(published));
</script>

<svelte:head>
	<title>{title}</title>
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

	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={desc} />
	<meta property="og:image" content={img} />
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
		{#each keywords.slice(0, 6) as tag (tag)}
			<meta property="article:tag" content={tag} />
		{/each}
	{/if}

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={TWITTER} />
	<meta name="twitter:creator" content={TWITTER} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={desc} />
	<meta name="twitter:image" content={img} />
	<meta name="twitter:image:alt" content={imageAlt} />

	{#each jsonLd as block, i (i)}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- JSON-LD is escaped by jsonLdScript -->
		{@html jsonLdScript(block)}
	{/each}
</svelte:head>
