<script lang="ts">
	const SITE = 'https://getromy.app';
	const DEFAULT_IMAGE = `${SITE}/og-image.jpg`;

	interface Props {
		title: string;
		description?: string;
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
		description = '',
		path,
		keywords = '',
		type = 'website',
		image = DEFAULT_IMAGE,
		published = '',
		section = '',
		jsonLd = []
	}: Props = $props();

	const url = $derived(`${SITE}${path === '/' ? '/' : path}`);

	/** Serialise for an inline script tag; `<` is escaped so content can't close the tag early. */
	function ld(data: Record<string, unknown>): string {
		return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</${'script'}>`;
	}
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="title" content={title} />
	{#if description}
		<meta name="description" content={description} />
	{/if}
	{#if keywords}
		<meta name="keywords" content={keywords} />
	{/if}
	<link rel="canonical" href={url} />

	<meta property="og:type" content={type} />
	<meta property="og:site_name" content="Rōmy" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	{#if description}
		<meta property="og:description" content={description} />
	{/if}
	<meta property="og:image" content={image} />
	<meta property="og:image:alt" content="Rōmy — donor intelligence for small nonprofits" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@RomyFindsMoney" />
	<meta name="twitter:creator" content="@RomyFindsMoney" />
	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={title} />
	{#if description}
		<meta name="twitter:description" content={description} />
	{/if}
	<meta name="twitter:image" content={image} />

	{#if type === 'article'}
		{#if published}
			<meta property="article:published_time" content={published} />
		{/if}
		{#if section}
			<meta property="article:section" content={section} />
		{/if}
		<meta property="article:author" content="Rōmy" />
	{/if}

	{#each jsonLd as data}
		{@html ld(data)}
	{/each}
</svelte:head>
