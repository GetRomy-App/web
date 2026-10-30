<script lang="ts">
	import { SITE, OG_IMAGE, OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT, jsonLdScript } from '$lib/seo';

	interface Props {
		title: string;
		description: string;
		path: string;
		ogTitle?: string;
		ogDescription?: string;
		keywords?: string;
		type?: 'website' | 'article';
		published?: string;
		modified?: string;
		section?: string;
		jsonLd?: unknown[];
	}

	let {
		title,
		description,
		path,
		ogTitle = title,
		ogDescription = description,
		keywords,
		type = 'website',
		published,
		modified,
		section,
		jsonLd = []
	}: Props = $props();

	const url = $derived(`${SITE}${path === '/' ? '/' : path}`);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={description} />
	{#if keywords}<meta name="keywords" content={keywords} />{/if}
	<link rel="canonical" href={url} />

	<meta property="og:type" content={type} />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={ogTitle} />
	<meta property="og:description" content={ogDescription} />
	<meta property="og:image" content={OG_IMAGE} />
	<meta property="og:image:width" content={String(OG_IMAGE_WIDTH)} />
	<meta property="og:image:height" content={String(OG_IMAGE_HEIGHT)} />
	<meta property="og:image:alt" content="Rōmy — donor intelligence for small nonprofits" />
	{#if published}<meta property="article:published_time" content={published} />{/if}
	{#if published || modified}<meta
			property="article:modified_time"
			content={modified ?? published}
		/>{/if}
	{#if section}<meta property="article:section" content={section} />{/if}

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={ogTitle} />
	<meta name="twitter:description" content={ogDescription} />
	<meta name="twitter:image" content={OG_IMAGE} />

	{#each jsonLd as block, i (i)}
		{@html jsonLdScript(block)}
	{/each}
</svelte:head>
