<script lang="ts">
	import { SITE_URL, SITE_NAME, TWITTER_HANDLE, DEFAULT_OG_IMAGE, jsonLd } from '$lib/seo';

	interface Props {
		title: string;
		description: string;
		/** Path beginning with "/" — used for canonical, og:url and twitter:url. */
		path: string;
		/** Social share title; defaults to `title`. */
		socialTitle?: string;
		keywords?: string[];
		type?: 'website' | 'article';
		image?: { url: string; width?: number; height?: number; alt?: string };
		robots?: string;
		article?: {
			published?: string;
			modified?: string;
			section?: string;
			tags?: string[];
		};
		/** schema.org nodes; wrapped in a single @graph. */
		schema?: Record<string, unknown>[];
	}

	let {
		title,
		description,
		path,
		socialTitle,
		keywords = [],
		type = 'website',
		image = DEFAULT_OG_IMAGE,
		robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
		article,
		schema = []
	}: Props = $props();

	const url = $derived(`${SITE_URL}${path}`);
	const shareTitle = $derived(socialTitle ?? title);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={description} />
	{#if keywords.length}
		<meta name="keywords" content={keywords.join(', ')} />
	{/if}
	<meta name="robots" content={robots} />
	<link rel="canonical" href={url} />

	<!-- Open Graph -->
	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={shareTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image.url} />
	<meta property="og:image:secure_url" content={image.url} />
	{#if image.width}<meta property="og:image:width" content={String(image.width)} />{/if}
	{#if image.height}<meta property="og:image:height" content={String(image.height)} />{/if}
	{#if image.alt}<meta property="og:image:alt" content={image.alt} />{/if}

	{#if type === 'article' && article}
		{#if article.published}<meta
				property="article:published_time"
				content={article.published}
			/>{/if}
		{#if article.modified}<meta property="article:modified_time" content={article.modified} />{/if}
		{#if article.section}<meta property="article:section" content={article.section} />{/if}
		<meta property="article:publisher" content={SITE_URL} />
		{#each article.tags ?? [] as tag (tag)}
			<meta property="article:tag" content={tag} />
		{/each}
	{/if}

	<!-- Twitter / X -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={TWITTER_HANDLE} />
	<meta name="twitter:creator" content={TWITTER_HANDLE} />
	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={shareTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image.url} />
	{#if image.alt}<meta name="twitter:image:alt" content={image.alt} />{/if}

	{#if schema.length}
		{@html jsonLd({ '@context': 'https://schema.org', '@graph': schema })}
	{/if}
</svelte:head>
