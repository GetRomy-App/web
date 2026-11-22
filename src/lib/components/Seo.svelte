<script lang="ts">
	import {
		SITE_NAME,
		TWITTER_HANDLE,
		DEFAULT_OG_IMAGE,
		absoluteUrl,
		serializeJsonLd,
		type JsonLd,
		type OgImage
	} from '$lib/seo';

	interface Props {
		/** Full document title, brand suffix included. */
		title: string;
		description: string;
		/** Canonical path, e.g. "/blog/the-ninth-card". */
		path: string;
		/** Title for social cards when it should differ from the document title. */
		socialTitle?: string;
		type?: 'website' | 'article';
		image?: OgImage;
		keywords?: string[];
		published?: string;
		modified?: string;
		section?: string;
		tags?: string[];
		noindex?: boolean;
		jsonLd?: JsonLd[];
	}

	let {
		title,
		description,
		path,
		socialTitle,
		type = 'website',
		image = DEFAULT_OG_IMAGE,
		keywords = [],
		published,
		modified,
		section,
		tags = [],
		noindex = false,
		jsonLd = []
	}: Props = $props();

	const url = $derived(absoluteUrl(path));
	const ogTitle = $derived(socialTitle ?? title);
	const robots = $derived(
		noindex
			? 'noindex, follow'
			: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
	);
	const jsonLdHtml = $derived(
		jsonLd
			.map((block) => `<script type="application/ld+json">${serializeJsonLd(block)}<\/script>`)
			.join('')
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	{#if keywords.length}
		<meta name="keywords" content={keywords.join(', ')} />
	{/if}
	<meta name="robots" content={robots} />
	<meta name="googlebot" content={robots} />
	<meta name="bingbot" content={robots} />
	<link rel="canonical" href={url} />

	<!-- Open Graph -->
	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={ogTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image.url} />
	<meta property="og:image:secure_url" content={image.url} />
	{#if image.width}<meta property="og:image:width" content={String(image.width)} />{/if}
	{#if image.height}<meta property="og:image:height" content={String(image.height)} />{/if}
	{#if image.alt}<meta property="og:image:alt" content={image.alt} />{/if}
	{#if type === 'article'}
		{#if published}<meta property="article:published_time" content={published} />{/if}
		{#if modified ?? published}<meta
				property="article:modified_time"
				content={modified ?? published}
			/>{/if}
		{#if section}<meta property="article:section" content={section} />{/if}
		{#each tags as tag (tag)}<meta property="article:tag" content={tag} />{/each}
		<meta property="article:publisher" content="https://x.com/RomyFindsMoney" />
	{/if}

	<!-- Twitter / X -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={TWITTER_HANDLE} />
	<meta name="twitter:creator" content={TWITTER_HANDLE} />
	<meta name="twitter:title" content={ogTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image.url} />
	{#if image.alt}<meta name="twitter:image:alt" content={image.alt} />{/if}

	{@html jsonLdHtml}
</svelte:head>
