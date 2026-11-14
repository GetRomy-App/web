<script lang="ts">
	import {
		SITE_NAME,
		TWITTER,
		DEFAULT_OG_IMAGE,
		DEFAULT_OG_IMAGE_ALT,
		absoluteUrl,
		truncate,
		plainText,
		keywordsFor,
		jsonLd
	} from '$lib/seo';

	interface Props {
		/** Full <title>. Keep the primary keyword near the front. */
		title: string;
		/** Meta description — trimmed to ~160 chars for the SERP; OG/Twitter get a longer cut. */
		description: string;
		/** Path relative to the site root, e.g. "/blog/foo". Used for canonical + og:url. */
		path: string;
		keywords?: string;
		type?: 'website' | 'article';
		image?: string;
		imageAlt?: string;
		robots?: string;
		publishedTime?: string;
		modifiedTime?: string;
		section?: string;
		tags?: string[];
		/** One or more JSON-LD objects (already wrapped in @context / @graph). */
		schema?: unknown | unknown[];
	}

	let {
		title,
		description,
		path,
		keywords = keywordsFor(),
		type = 'website',
		image = DEFAULT_OG_IMAGE,
		imageAlt = DEFAULT_OG_IMAGE_ALT,
		robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
		publishedTime,
		modifiedTime,
		section,
		tags = [],
		schema
	}: Props = $props();

	const url = $derived(absoluteUrl(path));
	const metaDescription = $derived(truncate(description, 160));
	const socialDescription = $derived(truncate(description, 220));
	const socialTitle = $derived(plainText(title));
	const imageUrl = $derived(absoluteUrl(image));
	const schemas = $derived(schema ? (Array.isArray(schema) ? schema : [schema]) : []);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={metaDescription} />
	<meta name="keywords" content={keywords} />
	<meta name="robots" content={robots} />
	<meta name="googlebot" content={robots} />
	<link rel="canonical" href={url} />
	<link rel="alternate" hreflang="en-us" href={url} />
	<link rel="alternate" hreflang="x-default" href={url} />

	<!-- Open Graph -->
	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={socialTitle} />
	<meta property="og:description" content={socialDescription} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:secure_url" content={imageUrl} />
	<meta property="og:image:width" content="1920" />
	<meta property="og:image:height" content="1080" />
	<meta property="og:image:type" content="image/jpeg" />
	<meta property="og:image:alt" content={imageAlt} />
	{#if type === 'article'}
		{#if publishedTime}
			<meta property="article:published_time" content={publishedTime} />
			<meta property="article:modified_time" content={modifiedTime ?? publishedTime} />
		{/if}
		<meta property="article:author" content={SITE_NAME} />
		<meta property="article:publisher" content="https://x.com/RomyFindsMoney" />
		{#if section}
			<meta property="article:section" content={section} />
		{/if}
		{#each tags as tag (tag)}
			<meta property="article:tag" content={tag} />
		{/each}
	{/if}

	<!-- Twitter / X -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={TWITTER} />
	<meta name="twitter:creator" content={TWITTER} />
	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={socialTitle} />
	<meta name="twitter:description" content={socialDescription} />
	<meta name="twitter:image" content={imageUrl} />
	<meta name="twitter:image:alt" content={imageAlt} />

	{#each schemas as s, i (i)}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- JSON-LD we build ourselves; `<` is escaped in jsonLd() -->
		{@html jsonLd(s)}
	{/each}
</svelte:head>
