<script lang="ts">
	import { SITE_URL, SITE_NAME, metaDescription } from '$lib/seo';

	interface Props {
		title: string;
		description: string;
		path: string;
		type?: 'website' | 'article';
		keywords?: string;
		published?: string;
		section?: string;
		jsonLd?: Record<string, unknown>[];
	}

	let {
		title,
		description,
		path,
		type = 'website',
		keywords,
		published,
		section,
		jsonLd = []
	}: Props = $props();

	const url = $derived(`${SITE_URL}${path}`);
	const desc = $derived(metaDescription(description));
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={desc} />
	{#if keywords}
		<meta name="keywords" content={keywords} />
	{/if}
	<link rel="canonical" href={url} />

	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={desc} />
	{#if published}
		<meta property="article:published_time" content={published} />
	{/if}
	{#if section}
		<meta property="article:section" content={section} />
	{/if}

	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={desc} />

	{#each jsonLd as block}
		{@html `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', ...block }).replace(/</g, '\\u003c')}</script>`}
	{/each}
</svelte:head>
