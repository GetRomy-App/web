<script lang="ts">
	interface JsonLdSchema {
		[key: string]: unknown;
	}

	interface Props {
		title: string;
		description: string;
		path: string;
		type?: 'website' | 'article';
		image?: string;
		robots?: string;
		publishedTime?: string;
		section?: string;
		jsonLd?: JsonLdSchema[];
	}

	let {
		title,
		description,
		path,
		type = 'website',
		image = '/og-image.jpg',
		robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
		publishedTime,
		section,
		jsonLd = []
	}: Props = $props();

	const SITE_URL = 'https://getromy.app';
	const canonical = $derived(`${SITE_URL}${path}`);
	const imageUrl = $derived(image.startsWith('http') ? image : `${SITE_URL}${image}`);

	// Prevent JSON-LD payloads from breaking out of the <script> tag they're embedded in.
	function toJsonLd(schema: JsonLdSchema): string {
		return JSON.stringify(schema).replace(/</g, '\\u003c');
	}
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={description} />
	<meta name="robots" content={robots} />
	<link rel="canonical" href={canonical} />

	<!-- Open Graph -->
	<meta property="og:type" content={type} />
	<meta property="og:url" content={canonical} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:site_name" content="Rōmy" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:width" content="1920" />
	<meta property="og:image:height" content="1080" />
	<meta property="og:image:alt" content={title} />

	{#if type === 'article' && publishedTime}
		<meta property="article:published_time" content={publishedTime} />
	{/if}
	{#if type === 'article' && section}
		<meta property="article:section" content={section} />
	{/if}

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@RomyFindsMoney" />
	<meta name="twitter:creator" content="@RomyFindsMoney" />
	<meta name="twitter:url" content={canonical} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />

	<!-- Structured Data (JSON-LD) -->
	{#each jsonLd as schema, i (i)}
		{@html `<script type="application/ld+json">${toJsonLd(schema)}</script>`}
	{/each}
</svelte:head>
