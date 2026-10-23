<script lang="ts">
	const SITE = 'https://getromy.app';

	interface Props {
		title: string;
		description: string;
		path: string;
		keywords?: string;
		type?: 'website' | 'article';
		published?: string;
		section?: string;
		jsonLd?: Record<string, unknown>[];
	}

	let {
		title,
		description,
		path,
		keywords = '',
		type = 'website',
		published = '',
		section = '',
		jsonLd = []
	}: Props = $props();

	const url = $derived(`${SITE}${path === '/' ? '/' : path}`);

	/** Escape `<` so serialized JSON can never close the script tag early. */
	function ld(data: Record<string, unknown>): string {
		return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}<\/script>`;
	}
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
	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />

	{#if type === 'article'}
		{#if published}
			<meta property="article:published_time" content={published} />
			<meta property="article:modified_time" content={published} />
		{/if}
		{#if section}
			<meta property="article:section" content={section} />
		{/if}
		<meta property="article:author" content="Rōmy" />
	{/if}

	{#each jsonLd as block}
		{@html ld(block)}
	{/each}
</svelte:head>
