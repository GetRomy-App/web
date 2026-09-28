<script lang="ts">
	interface Props {
		title: string;
		description: string;
		/** Canonical path, e.g. "/blog/my-post". */
		path: string;
		type?: 'website' | 'article';
		keywords?: string;
		/** ISO date; only used for articles. */
		published?: string;
		section?: string;
		/** Extra JSON-LD nodes to emit alongside the breadcrumb. */
		jsonLd?: Record<string, unknown>[];
		breadcrumbs?: { name: string; path: string }[];
		noindex?: boolean;
	}

	let {
		title,
		description,
		path,
		type = 'website',
		keywords = '',
		published = '',
		section = '',
		jsonLd = [],
		breadcrumbs = [],
		noindex = false
	}: Props = $props();

	const SITE = 'https://getromy.app';
	const image = `${SITE}/og-image.jpg`;
	const url = $derived(`${SITE}${path === '/' ? '/' : path}`);

	const crumbs = $derived(
		breadcrumbs.length
			? {
					'@context': 'https://schema.org',
					'@type': 'BreadcrumbList',
					itemListElement: [{ name: 'Rōmy', path: '/' }, ...breadcrumbs].map((c, i) => ({
						'@type': 'ListItem',
						position: i + 1,
						name: c.name,
						item: `${SITE}${c.path}`
					}))
				}
			: null
	);

	const nodes = $derived([...(crumbs ? [crumbs] : []), ...jsonLd]);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={description} />
	{#if keywords}
		<meta name="keywords" content={keywords} />
	{/if}
	{#if noindex}
		<meta name="robots" content="noindex, follow" />
	{/if}
	<link rel="canonical" href={url} />

	<meta property="og:type" content={type} />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />
	<meta property="og:image:width" content="1920" />
	<meta property="og:image:height" content="1080" />
	<meta property="og:image:alt" content="Rōmy — donor intelligence for small nonprofits" />
	{#if type === 'article'}
		{#if published}<meta property="article:published_time" content={published} />{/if}
		{#if section}<meta property="article:section" content={section} />{/if}
	{/if}

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />

	{#each nodes as node}
		{@html `<script type="application/ld+json">${JSON.stringify(node).replace(/</g, '\\u003c')}</script>`}
	{/each}
</svelte:head>
