<script lang="ts">
	const SITE = 'https://getromy.app';
	const DEFAULT_IMAGE = `${SITE}/og-image.jpg`;

	interface Props {
		title: string;
		description: string;
		path: string;
		keywords?: string;
		type?: 'website' | 'article';
		image?: string;
		published?: string;
		section?: string;
		jsonLd?: Record<string, unknown>[];
	}

	let {
		title,
		description,
		path,
		keywords,
		type = 'website',
		image = DEFAULT_IMAGE,
		published,
		section,
		jsonLd = []
	}: Props = $props();

	const url = $derived(`${SITE}${path === '/' ? '/' : path}`);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={description} />
	{#if keywords}
		<meta name="keywords" content={keywords} />
	{/if}
	<link rel="canonical" href={url} />

	<meta property="og:type" content={type} />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />
	<meta property="og:image:alt" content="Rōmy — donor intelligence for small nonprofits" />
	{#if published}
		<meta property="article:published_time" content={published} />
	{/if}
	{#if section}
		<meta property="article:section" content={section} />
	{/if}

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />

	{#each jsonLd as block}
		{@html `<script type="application/ld+json">${JSON.stringify(block).replace(/</g, '\\u003c')}</script>`}
	{/each}
</svelte:head>
