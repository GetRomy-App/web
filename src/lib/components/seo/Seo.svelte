<script lang="ts">
	const SITE = 'https://getromy.app';

	interface Props {
		title: string;
		description: string;
		path: string;
		keywords?: string;
		type?: 'website' | 'article';
		image?: string;
		published?: string;
		modified?: string;
		section?: string;
		jsonLd?: Record<string, unknown>[];
	}

	let {
		title,
		description,
		path,
		keywords,
		type = 'website',
		image = `${SITE}/og-image.jpg`,
		published,
		modified,
		section,
		jsonLd = []
	}: Props = $props();

	const url = $derived(`${SITE}${path}`);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={description} />
	{#if keywords}<meta name="keywords" content={keywords} />{/if}
	<link rel="canonical" href={url} />
	<meta property="og:type" content={type} />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />
	{#if type === 'article'}
		{#if published}<meta property="article:published_time" content={published} />{/if}
		{#if modified ?? published}<meta
				property="article:modified_time"
				content={modified ?? published}
			/>{/if}
		{#if section}<meta property="article:section" content={section} />{/if}
		<meta property="article:author" content="Rōmy" />
	{/if}
	{#each jsonLd as block}
		{@html `<script type="application/ld+json">${JSON.stringify(block).replace(/</g, '\\u003c')}</script>`}
	{/each}
</svelte:head>
