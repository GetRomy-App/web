<script lang="ts">
	interface Props {
		title: string;
		description: string;
		/** Absolute-path route, e.g. "/blog/my-post". */
		path: string;
		keywords?: string;
		type?: 'website' | 'article';
		image?: string;
		noindex?: boolean;
		publishedTime?: string;
		modifiedTime?: string;
		section?: string;
		/** Extra JSON-LD objects rendered as separate script tags. */
		jsonLd?: Record<string, unknown>[];
	}

	let {
		title,
		description,
		path,
		keywords,
		type = 'website',
		image = '/og-image.jpg',
		noindex = false,
		publishedTime,
		modifiedTime,
		section,
		jsonLd = []
	}: Props = $props();

	const SITE = 'https://getromy.app';
	const url = $derived(`${SITE}${path === '/' ? '/' : path}`);
	const imageUrl = $derived(image.startsWith('http') ? image : `${SITE}${image}`);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={description} />
	{#if keywords}
		<meta name="keywords" content={keywords} />
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
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:width" content="1920" />
	<meta property="og:image:height" content="1080" />
	<meta property="og:image:alt" content="Rōmy — donor intelligence for small nonprofits" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />

	{#if type === 'article'}
		{#if publishedTime}<meta property="article:published_time" content={publishedTime} />{/if}
		{#if modifiedTime}<meta property="article:modified_time" content={modifiedTime} />{/if}
		{#if section}<meta property="article:section" content={section} />{/if}
		<meta property="article:author" content="Rōmy" />
	{/if}

	{#each jsonLd as block}
		{@html `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', ...block }).replace(/</g, '\\u003c')}</script>`}
	{/each}
</svelte:head>
