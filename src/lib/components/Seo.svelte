<script lang="ts">
	const SITE = 'https://getromy.app';
	const DEFAULT_IMAGE = `${SITE}/og-image.jpg`;

	interface Props {
		/** Full <title> text, e.g. "Post Title — Rōmy Blog". Callers own the suffix. */
		title: string;
		description: string;
		/** Root-relative path, e.g. "/" or "/blog/my-post". */
		path: string;
		keywords?: string;
		type?: 'website' | 'article';
		/** Root-relative or absolute image URL. Defaults to the site's OG image. */
		image?: string;
		publishedTime?: string;
		modifiedTime?: string;
		section?: string;
		noindex?: boolean;
		/** Extra JSON-LD objects to emit alongside the page's own <script> tags. */
		jsonLd?: Record<string, unknown>[];
	}

	let {
		title,
		description,
		path,
		keywords,
		type = 'website',
		image,
		publishedTime,
		modifiedTime,
		section,
		noindex = false,
		jsonLd = []
	}: Props = $props();

	const url = $derived(`${SITE}${path}`);
	const imageUrl = $derived(
		image ? (image.startsWith('http') ? image : `${SITE}${image}`) : DEFAULT_IMAGE
	);
	const robots = $derived(
		noindex
			? 'noindex, follow'
			: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={description} />
	{#if keywords}
		<meta name="keywords" content={keywords} />
	{/if}
	<meta name="robots" content={robots} />

	<!-- Open Graph -->
	<meta property="og:type" content={type} />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:site_name" content="Rōmy" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	{#if publishedTime}
		<meta property="article:published_time" content={publishedTime} />
	{/if}
	{#if modifiedTime}
		<meta property="article:modified_time" content={modifiedTime} />
	{/if}
	{#if section}
		<meta property="article:section" content={section} />
	{/if}

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@RomyFindsMoney" />
	<meta name="twitter:creator" content="@RomyFindsMoney" />
	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />

	<link rel="canonical" href={url} />

	{#each jsonLd as block}
		{@html `<script type="application/ld+json">${JSON.stringify(block)}</script>`}
	{/each}
</svelte:head>
