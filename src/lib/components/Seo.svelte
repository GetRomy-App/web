<script lang="ts">
	import {
		SITE_NAME,
		DEFAULT_OG_IMAGE,
		DEFAULT_OG_IMAGE_WIDTH,
		DEFAULT_OG_IMAGE_HEIGHT,
		absoluteUrl
	} from '$lib/seo';

	interface Props {
		title: string;
		description: string;
		path: string;
		type?: 'website' | 'article';
		keywords?: string;
		image?: string;
		imageAlt?: string;
		publishedTime?: string;
		section?: string;
		robots?: string;
		jsonLd?: object[];
	}

	let {
		title,
		description,
		path,
		type = 'website',
		keywords,
		image = DEFAULT_OG_IMAGE,
		imageAlt = `${SITE_NAME} — Donor Intelligence for Small Nonprofits`,
		publishedTime,
		section,
		robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
		jsonLd = []
	}: Props = $props();

	const url = $derived(absoluteUrl(path));
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={description} />
	{#if keywords}
		<meta name="keywords" content={keywords} />
	{/if}
	<meta name="author" content="GetRomy LLC" />
	<meta name="robots" content={robots} />

	<link rel="canonical" href={url} />

	<!-- Open Graph -->
	<meta property="og:type" content={type} />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:image" content={image} />
	<meta property="og:image:width" content={String(DEFAULT_OG_IMAGE_WIDTH)} />
	<meta property="og:image:height" content={String(DEFAULT_OG_IMAGE_HEIGHT)} />
	<meta property="og:image:alt" content={imageAlt} />
	{#if type === 'article'}
		{#if publishedTime}
			<meta property="article:published_time" content={publishedTime} />
		{/if}
		{#if section}
			<meta property="article:section" content={section} />
		{/if}
	{/if}

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@RomyFindsMoney" />
	<meta name="twitter:creator" content="@RomyFindsMoney" />
	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />
	<meta name="twitter:image:alt" content={imageAlt} />

	{#each jsonLd as schema}
		{@html `<script type="application/ld+json">${JSON.stringify(schema)}</script>`}
	{/each}
</svelte:head>
