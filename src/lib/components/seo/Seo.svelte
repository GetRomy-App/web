<script lang="ts" module>
	export const SITE = 'https://getromy.app';
	export const DEFAULT_IMAGE = `${SITE}/og-image.jpg`;
</script>

<script lang="ts">
	interface Props {
		title: string;
		description: string;
		/** Absolute path beginning with "/", e.g. "/blog/my-post". */
		path: string;
		keywords?: string;
		type?: 'website' | 'article';
		image?: string;
		imageAlt?: string;
		publishedTime?: string;
		section?: string;
		/** One or more schema.org objects, emitted as JSON-LD. */
		jsonLd?: Record<string, unknown> | Record<string, unknown>[];
	}

	let {
		title,
		description,
		path,
		keywords = '',
		type = 'website',
		image = DEFAULT_IMAGE,
		imageAlt = 'Rōmy — AI donor intelligence for small nonprofits',
		publishedTime = '',
		section = '',
		jsonLd = []
	}: Props = $props();

	const url = $derived(`${SITE}${path === '/' ? '/' : path}`);
	const blocks = $derived(Array.isArray(jsonLd) ? jsonLd : [jsonLd]);

	// Escape "<" so post-derived strings can never close the script element.
	const serialize = (obj: Record<string, unknown>) =>
		`<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}<\/script>`;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={description} />
	{#if keywords}
		<meta name="keywords" content={keywords} />
	{/if}
	<link rel="canonical" href={url} />

	<meta property="og:type" content={type} />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />
	<meta property="og:image:alt" content={imageAlt} />
	{#if image === DEFAULT_IMAGE}
		<meta property="og:image:width" content="1920" />
		<meta property="og:image:height" content="1080" />
	{/if}

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />
	<meta name="twitter:image:alt" content={imageAlt} />

	{#if type === 'article'}
		{#if publishedTime}
			<meta property="article:published_time" content={publishedTime} />
		{/if}
		{#if section}
			<meta property="article:section" content={section} />
		{/if}
		<meta property="article:publisher" content="https://x.com/RomyFindsMoney" />
	{/if}

	{#each blocks as block}
		{@html serialize(block)}
	{/each}
</svelte:head>
