<script lang="ts">
	import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE, jsonLdScript } from '$lib/seo';

	interface Props {
		title: string;
		description: string;
		path: string;
		ogTitle?: string;
		keywords?: string;
		type?: 'website' | 'article';
		published?: string;
		section?: string;
		image?: { url: string; width: number; height: number; alt: string };
		jsonLd?: unknown[];
	}

	let {
		title,
		description,
		path,
		ogTitle = title,
		keywords = '',
		type = 'website',
		published = '',
		section = '',
		image = DEFAULT_OG_IMAGE,
		jsonLd = []
	}: Props = $props();

	const url = $derived(`${SITE_URL}${path}`);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	{#if keywords}<meta name="keywords" content={keywords} />{/if}
	<meta
		name="robots"
		content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
	/>
	<link rel="canonical" href={url} />

	<meta property="og:type" content={type} />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={ogTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:image" content={image.url} />
	<meta property="og:image:width" content={String(image.width)} />
	<meta property="og:image:height" content={String(image.height)} />
	<meta property="og:image:alt" content={image.alt} />
	{#if type === 'article' && published}
		<meta property="article:published_time" content={published} />
		<meta property="article:author" content="Rōmy" />
		{#if section}<meta property="article:section" content={section} />{/if}
	{/if}

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@RomyFindsMoney" />
	<meta name="twitter:creator" content="@RomyFindsMoney" />
	<meta name="twitter:title" content={ogTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image.url} />
	<meta name="twitter:image:alt" content={image.alt} />

	{#each jsonLd as block}
		{@html jsonLdScript(block)}
	{/each}
</svelte:head>
