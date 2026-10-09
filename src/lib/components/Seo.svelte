<script lang="ts">
	import { SITE, SITE_NAME, DEFAULT_IMAGE, TWITTER_HANDLE, BASE_KEYWORDS } from '$lib/seo';

	interface Props {
		title: string;
		description: string;
		path: string;
		type?: 'website' | 'article';
		keywords?: string[];
		image?: string;
		published?: string;
		section?: string;
		jsonLd?: object[];
	}

	let {
		title,
		description,
		path,
		type = 'website',
		keywords = [],
		image = DEFAULT_IMAGE,
		published,
		section,
		jsonLd = []
	}: Props = $props();

	const url = $derived(SITE + path);
	const allKeywords = $derived([...keywords, ...BASE_KEYWORDS].join(', '));
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={description} />
	<meta name="keywords" content={allKeywords} />
	<meta
		name="robots"
		content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
	/>
	<link rel="canonical" href={url} />

	<meta property="og:type" content={type} />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:image" content={image} />
	<meta property="og:image:width" content="1920" />
	<meta property="og:image:height" content="1080" />
	<meta property="og:image:alt" content="Rōmy — AI donor intelligence for small nonprofits" />
	{#if type === 'article'}
		{#if published}<meta property="article:published_time" content={published} />{/if}
		{#if section}<meta property="article:section" content={section} />{/if}
		<meta property="article:author" content="Rōmy" />
	{/if}

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={TWITTER_HANDLE} />
	<meta name="twitter:creator" content={TWITTER_HANDLE} />
	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />

	{#each jsonLd as block}
		{@html `<script type="application/ld+json">${JSON.stringify(block).replace(/</g, '\\u003c')}</script>`}
	{/each}
</svelte:head>
