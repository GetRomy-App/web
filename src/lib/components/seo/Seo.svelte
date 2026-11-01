<script lang="ts">
	/**
	 * One place for every per-page head tag: title, description, canonical,
	 * Open Graph, Twitter, robots and JSON-LD. Site-wide tags (favicons,
	 * Organization/WebSite schema) live in the root layout.
	 */
	import { SITE } from '$lib/seo';

	interface Props {
		title: string;
		description: string;
		/** Absolute path beginning with "/" (e.g. "/blog/my-post"). */
		path: string;
		type?: 'website' | 'article';
		keywords?: string;
		image?: string;
		imageAlt?: string;
		published?: string;
		modified?: string;
		section?: string;
		noindex?: boolean;
		/** Extra schema.org nodes to emit as JSON-LD. */
		jsonLd?: Record<string, unknown>[];
	}

	let {
		title,
		description,
		path,
		type = 'website',
		keywords = '',
		image = SITE.image,
		imageAlt = SITE.imageAlt,
		published = '',
		modified = '',
		section = '',
		noindex = false,
		jsonLd = []
	}: Props = $props();

	const url = $derived(`${SITE.url}${path === '/' ? '/' : path}`);
	const imageUrl = $derived(image.startsWith('http') ? image : `${SITE.url}${image}`);
	const robots = $derived(
		noindex
			? 'noindex, follow'
			: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
	);

	/** Serialize for an inline <script>; "<" is escaped so content can't close the tag. */
	const ld = (node: Record<string, unknown>) =>
		`<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', ...node }).replace(/</g, '\\u003c')}</${'script'}>`;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	{#if keywords}
		<meta name="keywords" content={keywords} />
	{/if}
	<meta name="robots" content={robots} />
	<link rel="canonical" href={url} />

	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={SITE.name} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:width" content="1920" />
	<meta property="og:image:height" content="1080" />
	<meta property="og:image:alt" content={imageAlt} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={SITE.twitter} />
	<meta name="twitter:creator" content={SITE.twitter} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />
	<meta name="twitter:image:alt" content={imageAlt} />

	{#if type === 'article'}
		{#if published}<meta property="article:published_time" content={published} />{/if}
		{#if modified || published}<meta property="article:modified_time" content={modified || published} />{/if}
		{#if section}<meta property="article:section" content={section} />{/if}
		<meta property="article:author" content={SITE.url} />
	{/if}

	{#each jsonLd as node}
		{@html ld(node)}
	{/each}
</svelte:head>
