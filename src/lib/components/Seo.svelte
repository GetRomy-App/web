<script lang="ts">
	import {
		SITE_NAME,
		TWITTER_HANDLE,
		DEFAULT_OG_IMAGE,
		DEFAULT_OG_IMAGE_WIDTH,
		DEFAULT_OG_IMAGE_HEIGHT,
		absoluteUrl,
		jsonLdScript,
		metaDescription
	} from '$lib/seo';

	interface Props {
		/** Full <title> text. */
		title: string;
		/** Page description; trimmed to snippet length for meta description. */
		description: string;
		/** Social description (defaults to `description`, lightly trimmed). */
		socialDescription?: string;
		/** Route path, e.g. "/blog/foo". Used for canonical + og:url. */
		path: string;
		type?: 'website' | 'article';
		image?: string;
		imageAlt?: string;
		keywords?: string[];
		publishedTime?: string;
		modifiedTime?: string;
		section?: string;
		tags?: string[];
		noindex?: boolean;
		jsonLd?: unknown[];
	}

	let {
		title,
		description,
		socialDescription,
		path,
		type = 'website',
		image = DEFAULT_OG_IMAGE,
		imageAlt = 'Rōmy — AI donor intelligence for small nonprofits',
		keywords = [],
		publishedTime,
		modifiedTime,
		section,
		tags = [],
		noindex = false,
		jsonLd = []
	}: Props = $props();

	const url = $derived(absoluteUrl(path));
	const metaDesc = $derived(metaDescription(description));
	const ogDesc = $derived(metaDescription(socialDescription ?? description, 200));
	const imageUrl = $derived(absoluteUrl(image));
	const isDefaultImage = $derived(imageUrl === DEFAULT_OG_IMAGE);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={metaDesc} />
	{#if keywords.length}
		<meta name="keywords" content={keywords.join(', ')} />
	{/if}
	<meta
		name="robots"
		content={noindex
			? 'noindex, follow'
			: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}
	/>
	<link rel="canonical" href={url} />

	<!-- Open Graph -->
	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={ogDesc} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:secure_url" content={imageUrl} />
	<meta property="og:image:alt" content={imageAlt} />
	{#if isDefaultImage}
		<meta property="og:image:type" content="image/jpeg" />
		<meta property="og:image:width" content={String(DEFAULT_OG_IMAGE_WIDTH)} />
		<meta property="og:image:height" content={String(DEFAULT_OG_IMAGE_HEIGHT)} />
	{/if}
	{#if type === 'article'}
		{#if publishedTime}<meta property="article:published_time" content={publishedTime} />{/if}
		{#if modifiedTime}<meta property="article:modified_time" content={modifiedTime} />{/if}
		{#if section}<meta property="article:section" content={section} />{/if}
		<meta property="article:publisher" content="https://getromy.app" />
		{#each tags as tag (tag)}
			<meta property="article:tag" content={tag} />
		{/each}
	{/if}

	<!-- Twitter / X -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={TWITTER_HANDLE} />
	<meta name="twitter:creator" content={TWITTER_HANDLE} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={ogDesc} />
	<meta name="twitter:image" content={imageUrl} />
	<meta name="twitter:image:alt" content={imageAlt} />

	{#each jsonLd as data, i (i)}
		{@html jsonLdScript(data)}
	{/each}
</svelte:head>
