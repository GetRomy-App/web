<script lang="ts">
	import { SITE_URL, DEFAULT_OG_IMAGE } from '$lib/seo';

	interface Props {
		title: string;
		description: string;
		path: string;
		/** Appended to the page title, e.g. "Rōmy Blog". Omit when the title already carries the brand. */
		titleSuffix?: string;
		keywords?: string;
		type?: 'website' | 'article';
		image?: string;
		published?: string;
		section?: string;
		jsonLd?: Record<string, unknown>[];
	}

	let {
		title,
		description,
		path,
		titleSuffix = '',
		keywords = '',
		type = 'website',
		image = DEFAULT_OG_IMAGE,
		published = '',
		section = '',
		jsonLd = []
	}: Props = $props();

	const fullTitle = $derived(titleSuffix ? `${title} — ${titleSuffix}` : title);
	const url = $derived(SITE_URL + path);
	const imageUrl = $derived(image.startsWith('http') ? image : SITE_URL + image);
	const ld = $derived(
		jsonLd.map(
			(item) =>
				`<script type="application/ld+json">${JSON.stringify(item).replace(/</g, '\\u003c')}</${'script'}>`
		)
	);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="title" content={fullTitle} />
	<meta name="description" content={description} />
	{#if keywords}
		<meta name="keywords" content={keywords} />
	{/if}
	<link rel="canonical" href={url} />

	<meta property="og:type" content={type} />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:width" content="1920" />
	<meta property="og:image:height" content="1080" />
	<meta property="og:image:alt" content="Rōmy — donor intelligence for small nonprofits" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />

	{#if type === 'article'}
		{#if published}
			<meta property="article:published_time" content={published} />
		{/if}
		{#if section}
			<meta property="article:section" content={section} />
		{/if}
	{/if}

	{#each ld as block, i (i)}
		{@html block}
	{/each}
</svelte:head>
