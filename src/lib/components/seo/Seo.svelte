<script lang="ts">
	import { DEFAULT_IMAGE, SITE_NAME, SITE_URL, jsonLdScript, snippet } from '$lib/seo';

	interface Props {
		title: string;
		description: string;
		path: string;
		type?: 'website' | 'article';
		image?: string;
		keywords?: string;
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
		image = DEFAULT_IMAGE,
		keywords,
		published,
		section,
		noindex = false,
		jsonLd = []
	}: Props = $props();

	const url = $derived(`${SITE_URL}${path === '/' ? '/' : path}`);
	const desc = $derived(snippet(description));
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={desc} />
	{#if keywords}<meta name="keywords" content={keywords} />{/if}
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
	<meta property="og:description" content={desc} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:image" content={image} />
	<meta property="og:image:alt" content="Rōmy — donor intelligence for small nonprofits" />
	{#if type === 'article'}
		{#if published}<meta property="article:published_time" content={published} />{/if}
		{#if section}<meta property="article:section" content={section} />{/if}
		<meta property="article:author" content="Rōmy" />
	{/if}

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@RomyFindsMoney" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={desc} />
	<meta name="twitter:image" content={image} />

	{#each jsonLd as block}
		{@html jsonLdScript(block)}
	{/each}
</svelte:head>
