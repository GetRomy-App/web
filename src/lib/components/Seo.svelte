<script lang="ts">
	import {
		absoluteUrl,
		DEFAULT_OG_IMAGE,
		DEFAULT_OG_IMAGE_ALT,
		SITE_NAME,
		TWITTER,
		ldGraph,
		snippet
	} from '$lib/seo';

	interface Props {
		/** Full <title> text, brand included. */
		title: string;
		description: string;
		/** Path (e.g. "/blog/foo") or absolute URL. */
		path: string;
		type?: 'website' | 'article';
		image?: string;
		imageAlt?: string;
		keywords?: string[];
		noindex?: boolean;
		published?: string;
		modified?: string;
		section?: string;
		tags?: string[];
		/** JSON-LD nodes; combined into one @graph script. */
		jsonld?: object[];
	}

	let {
		title,
		description,
		path,
		type = 'website',
		image = DEFAULT_OG_IMAGE,
		imageAlt = DEFAULT_OG_IMAGE_ALT,
		keywords = [],
		noindex = false,
		published,
		modified,
		section,
		tags = [],
		jsonld = []
	}: Props = $props();

	const url = $derived(absoluteUrl(path));
	const desc = $derived(snippet(description));
	const img = $derived(absoluteUrl(image));
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={desc} />
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
	<link rel="alternate" hreflang="en" href={url} />
	<link rel="alternate" hreflang="x-default" href={url} />

	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={desc} />
	<meta property="og:image" content={img} />
	<meta property="og:image:secure_url" content={img} />
	<meta property="og:image:alt" content={imageAlt} />
	{#if image === DEFAULT_OG_IMAGE}
		<meta property="og:image:type" content="image/jpeg" />
		<meta property="og:image:width" content="1920" />
		<meta property="og:image:height" content="1080" />
	{/if}
	{#if type === 'article'}
		{#if published}<meta property="article:published_time" content={published} />{/if}
		{#if modified ?? published}<meta
				property="article:modified_time"
				content={modified ?? published}
			/>{/if}
		{#if section}<meta property="article:section" content={section} />{/if}
		<meta property="article:publisher" content="https://x.com/RomyFindsMoney" />
		{#each tags as tag (tag)}<meta property="article:tag" content={tag} />{/each}
	{/if}

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={TWITTER} />
	<meta name="twitter:creator" content={TWITTER} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={desc} />
	<meta name="twitter:image" content={img} />
	<meta name="twitter:image:alt" content={imageAlt} />

	{#if jsonld.length}
		{@html `<script type="application/ld+json">${ldGraph(...jsonld)}</script>`}
	{/if}
</svelte:head>
