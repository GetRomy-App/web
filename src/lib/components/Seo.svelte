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
		tag?: string;
		jsonLd?: Record<string, unknown>[];
	}

	let {
		title,
		description,
		path,
		keywords,
		type = 'website',
		image = '/og-image.jpg',
		published,
		tag,
		jsonLd = []
	}: Props = $props();

	const url = $derived(SITE + path);
	const imageUrl = $derived(image.startsWith('http') ? image : SITE + image);
</script>

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
	<link rel="canonical" href={url} />

	<meta property="og:type" content={type} />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:site_name" content="Rōmy" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:width" content="1920" />
	<meta property="og:image:height" content="1080" />
	<meta property="og:image:alt" content="Rōmy — donor intelligence for small nonprofits" />
	{#if type === 'article' && published}
		<meta property="article:published_time" content={published} />
		<meta property="article:modified_time" content={published} />
		<meta property="article:author" content="Rōmy" />
		{#if tag}
			<meta property="article:section" content={tag} />
			<meta property="article:tag" content={tag} />
		{/if}
	{/if}

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@RomyFindsMoney" />
	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />

	{#each jsonLd as block}
		{@html `<script type="application/ld+json">${JSON.stringify(block).replace(/</g, '\\u003c')}</script>`}
	{/each}
</svelte:head>
