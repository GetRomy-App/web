<script lang="ts">
	const SITE = 'https://getromy.app';
	const DEFAULT_IMAGE = '/og-image.jpg';

	interface Props {
		/** Page title, without the "— Rōmy" suffix — this component appends it. */
		title: string;
		description: string;
		/** Comma-separated keywords. Falls back to the sitewide default list when omitted. */
		keywords?: string;
		/** Path only, e.g. "/blog/my-post" — used to build canonical + og:url. */
		path: string;
		type?: 'website' | 'article';
		image?: string;
		noindex?: boolean;
		/** Article-only fields (ignored unless type="article"). */
		publishedTime?: string;
		modifiedTime?: string;
		section?: string;
	}

	const DEFAULT_KEYWORDS =
		'nonprofit donor intelligence, fundraising software, prospect research tool, donor discovery platform, wealth screening, giving history, AI donor research, nonprofit fundraising, major donor prospecting, small nonprofit tools, donor management, philanthropy intelligence, fundraising CRM, nonprofit technology, donor wealth indicators';

	/** Truncate at a word boundary so search/social snippets aren't cut mid-word. Doesn't touch the source content — display/on-page text always uses the full string. */
	function truncate(text: string, max: number): string {
		if (text.length <= max) return text;
		const cut = text.slice(0, max - 1);
		const lastSpace = cut.lastIndexOf(' ');
		return `${cut.slice(0, lastSpace > 0 ? lastSpace : max - 1)}…`;
	}

	let {
		title,
		description,
		keywords = DEFAULT_KEYWORDS,
		path,
		type = 'website',
		image = DEFAULT_IMAGE,
		noindex = false,
		publishedTime,
		modifiedTime,
		section
	}: Props = $props();

	// Some titles are already fully composed (e.g. "Post Title — Rōmy Blog") — only
	// append the sitewide suffix when the brand name isn't already present.
	const fullTitle = $derived(title.includes('Rōmy') ? title : `${title} — Rōmy`);
	const url = $derived(`${SITE}${path}`);
	const absoluteImage = $derived(image.startsWith('http') ? image : `${SITE}${image}`);
	const robots = $derived(
		noindex
			? 'noindex, nofollow'
			: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
	);
	// Google typically renders ~155-160 chars of a meta description before truncating;
	// OG/Twitter card previews tolerate more before they clip.
	const metaDescription = $derived(truncate(description, 160));
	const socialDescription = $derived(truncate(description, 200));
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="title" content={fullTitle} />
	<meta name="description" content={metaDescription} />
	<meta name="keywords" content={keywords} />
	<meta name="robots" content={robots} />
	<link rel="canonical" href={url} />

	<!-- Open Graph -->
	<meta property="og:type" content={type} />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={socialDescription} />
	<meta property="og:site_name" content="Rōmy" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:image" content={absoluteImage} />
	<meta property="og:image:width" content="1920" />
	<meta property="og:image:height" content="1080" />
	<meta property="og:image:alt" content={fullTitle} />

	{#if type === 'article'}
		{#if publishedTime}
			<meta property="article:published_time" content={publishedTime} />
		{/if}
		{#if modifiedTime}
			<meta property="article:modified_time" content={modifiedTime} />
		{/if}
		{#if section}
			<meta property="article:section" content={section} />
		{/if}
	{/if}

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@RomyFindsMoney" />
	<meta name="twitter:creator" content="@RomyFindsMoney" />
	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={socialDescription} />
	<meta name="twitter:image" content={absoluteImage} />
</svelte:head>
