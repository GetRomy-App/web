<script lang="ts">
	interface ArticleMeta {
		publishedTime: string;
		section: string;
	}

	interface Props {
		title: string;
		description: string;
		canonical: string;
		keywords?: string;
		ogType?: 'website' | 'article';
		image?: string;
		article?: ArticleMeta;
		jsonLd?: Record<string, unknown>[];
	}

	let {
		title,
		description,
		canonical,
		keywords,
		ogType = 'website',
		image = 'https://getromy.app/og-image.jpg',
		article,
		jsonLd = []
	}: Props = $props();
</script>

<!--
	Deliberately nested one component deep (mirrors LegalPage.svelte). Svelte's
	SSR title-election picks whichever <svelte:head> block sits at the "latest"
	position in the render tree — a <svelte:head> declared directly in a
	+page.svelte at the same tree depth as the root layout's can lose to the
	layout's <title>, silently leaving every page titled after the homepage.
	Nesting it here reliably wins.
-->
<svelte:head>
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={description} />
	{#if keywords}
		<meta name="keywords" content={keywords} />
	{/if}
	<meta
		name="robots"
		content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
	/>
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content={ogType} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={image} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:site_name" content="Rōmy" />
	{#if article}
		<meta property="article:published_time" content={article.publishedTime} />
		<meta property="article:section" content={article.section} />
	{/if}
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />
	<link rel="canonical" href={canonical} />
	{#each jsonLd as schema}
		{@html `<script type="application/ld+json">${JSON.stringify(schema)}</script>`}
	{/each}
</svelte:head>
