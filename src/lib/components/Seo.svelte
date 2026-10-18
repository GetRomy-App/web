<script lang="ts">
	const SITE = 'https://getromy.app';
	const DEFAULT_IMAGE = `${SITE}/og-image.jpg`;

	interface Props {
		title: string;
		description: string;
		path: string;
		type?: 'website' | 'article';
		image?: string;
		imageAlt?: string;
		publishedTime?: string;
		section?: string;
		keywords?: string;
		jsonLd?: Record<string, unknown>[];
	}

	let {
		title,
		description,
		path,
		type = 'website',
		image = DEFAULT_IMAGE,
		imageAlt = 'Rōmy — donor intelligence for small nonprofits',
		publishedTime,
		section,
		keywords,
		jsonLd = []
	}: Props = $props();

	const url = $derived(`${SITE}${path === '/' ? '/' : path}`);

	/** Search snippets truncate near 160 chars; trim at a word boundary so ours doesn't end mid-sentence. */
	const metaDescription = $derived.by(() => {
		const clean = description.replace(/\s+/g, ' ').trim();
		if (clean.length <= 160) return clean;
		const cut = clean.slice(0, 157);
		return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
	});

	const ldJson = $derived(
		jsonLd.map((entry) => JSON.stringify(entry).replace(/</g, '\\u003c'))
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={metaDescription} />
	{#if keywords}
		<meta name="keywords" content={keywords} />
	{/if}
	<link rel="canonical" href={url} />

	<meta property="og:type" content={type} />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={metaDescription} />
	<meta property="og:site_name" content="Rōmy" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:image" content={image} />
	<meta property="og:image:alt" content={imageAlt} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@RomyFindsMoney" />
	<meta name="twitter:creator" content="@RomyFindsMoney" />
	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={metaDescription} />
	<meta name="twitter:image" content={image} />
	<meta name="twitter:image:alt" content={imageAlt} />

	{#if type === 'article'}
		{#if publishedTime}
			<meta property="article:published_time" content={publishedTime} />
		{/if}
		{#if section}
			<meta property="article:section" content={section} />
		{/if}
		<meta property="article:author" content="Rōmy" />
	{/if}

	{#each ldJson as entry}
		{@html `<script type="application/ld+json">${entry}</script>`}
	{/each}
</svelte:head>
