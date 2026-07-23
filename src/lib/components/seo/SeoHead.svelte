<script lang="ts">
	const SITE_URL = 'https://getromy.app';
	const DEFAULT_IMAGE = '/og-image.jpg';
	const DEFAULT_IMAGE_ALT = 'Rōmy — Donor Intelligence for Small Nonprofits';

	interface Props {
		title: string;
		description: string;
		path: string;
		type?: 'website' | 'article';
		keywords?: string;
		image?: string;
		imageAlt?: string;
		publishedTime?: string;
		modifiedTime?: string;
		section?: string;
		noindex?: boolean;
	}

	let {
		title,
		description,
		path,
		type = 'website',
		keywords = '',
		image = DEFAULT_IMAGE,
		imageAlt = DEFAULT_IMAGE_ALT,
		publishedTime = '',
		modifiedTime = '',
		section = '',
		noindex = false
	}: Props = $props();

	// svelte-ignore state_referenced_locally
	const url = `${SITE_URL}${path}`;
	// svelte-ignore state_referenced_locally
	const absoluteImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;
	// svelte-ignore state_referenced_locally
	const robots = noindex
		? 'noindex, nofollow'
		: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={description} />
	{#if keywords}
		<meta name="keywords" content={keywords} />
	{/if}
	<meta name="robots" content={robots} />

	<!-- Open Graph -->
	<meta property="og:type" content={type} />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:site_name" content="Rōmy" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:image" content={absoluteImage} />
	<meta property="og:image:alt" content={imageAlt} />
	{#if type === 'article'}
		{#if publishedTime}
			<meta property="article:published_time" content={publishedTime} />
		{/if}
		{#if modifiedTime}
			<meta property="article:modified_time" content={modifiedTime} />
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
	<meta name="twitter:image" content={absoluteImage} />
	<meta name="twitter:image:alt" content={imageAlt} />

	<link rel="canonical" href={url} />
</svelte:head>
