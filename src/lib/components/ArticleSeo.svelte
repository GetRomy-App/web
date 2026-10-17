<script lang="ts">
	import {
		SITE_URL,
		SITE_NAME,
		DEFAULT_OG_IMAGE,
		jsonLd,
		withBrand,
		clip,
		toIsoDate
	} from '$lib/seo';
	import type { PostMeta } from '$lib/content';

	let {
		post,
		section,
		sectionPath,
		path
	}: { post: PostMeta; section: 'Blog' | 'Labs'; sectionPath: string; path: string } = $props();

	const url = $derived(`${SITE_URL}${path}`);
	const title = $derived(withBrand(post.title, `${SITE_NAME} ${section}`));
	const description = $derived(clip(post.excerpt));
	const published = $derived(toIsoDate(post.date));

	const structured = $derived(
		jsonLd({
			'@context': 'https://schema.org',
			'@graph': [
				{
					'@type': 'BlogPosting',
					'@id': `${url}#article`,
					mainEntityOfPage: { '@type': 'WebPage', '@id': url },
					headline: post.title.slice(0, 110),
					description: post.excerpt,
					image: [DEFAULT_OG_IMAGE],
					datePublished: published,
					dateModified: published,
					articleSection: post.tag,
					inLanguage: 'en-US',
					author: { '@type': 'Organization', name: 'GetRomy LLC', url: SITE_URL },
					publisher: {
						'@type': 'Organization',
						name: 'GetRomy LLC',
						url: SITE_URL,
						logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon-logo.png` }
					}
				},
				{
					'@type': 'BreadcrumbList',
					itemListElement: [
						{ '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
						{
							'@type': 'ListItem',
							position: 2,
							name: section,
							item: `${SITE_URL}${sectionPath}`
						},
						{ '@type': 'ListItem', position: 3, name: post.title, item: url }
					]
				}
			]
		})
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta
		name="keywords"
		content="donor intelligence, nonprofit fundraising, prospect research, AI donor research, wealth screening, {post.tag.toLowerCase()}"
	/>
	<link rel="canonical" href={url} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={post.title} />
	<meta property="og:description" content={description} />
	{#if published}
		<meta property="article:published_time" content={published} />
		<meta property="article:modified_time" content={published} />
	{/if}
	<meta property="article:section" content={post.tag} />
	<meta property="article:author" content="GetRomy LLC" />
	<meta name="twitter:title" content={post.title} />
	<meta name="twitter:description" content={description} />
	{@html structured}
</svelte:head>
