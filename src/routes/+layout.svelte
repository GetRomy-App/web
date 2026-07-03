<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import Lenis from 'lenis';
	import { gsap, ScrollTrigger, registerGsap } from '$lib/gsap';
	import ContactModal from '$lib/components/ui/ContactModal.svelte';
	import { contactModal } from '$lib/stores/contact.svelte';
	import { page } from '$app/state';
	import type { SeoData } from '$lib/seo';

	let { children } = $props();

	registerGsap();

	let lenis = $state<Lenis>();

	onMount(() => {
		const instance = new Lenis();
		lenis = instance;

		instance.on('scroll', ScrollTrigger.update);

		gsap.ticker.add((time: number) => {
			instance.raf(time * 1000);
		});

		gsap.ticker.lagSmoothing(0);

		return () => {
			instance.destroy();
			lenis = undefined;
		};
	});

	// Freeze background scrolling while the contact dialog is open.
	$effect(() => {
		if (!lenis) return;
		if (contactModal.open) lenis.stop();
		else lenis.start();
	});

	const DEFAULT_SEO: SeoData = {
		title: 'Rōmy — Donor Intelligence for Small Nonprofits',
		description:
			'Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions. AI-powered prospect research, wealth indicators, and giving history — at a price built for small teams.',
		path: '/',
		type: 'website',
		keywords:
			'nonprofit donor intelligence, fundraising software, prospect research tool, donor discovery platform, wealth screening, giving history, AI donor research, nonprofit fundraising, major donor prospecting, small nonprofit tools, donor management, philanthropy intelligence, fundraising CRM, nonprofit technology, donor wealth indicators'
	};

	// The route tree's merged load data — every +page.server.ts / +page.ts in this
	// app can return a `seo` field to override the page's title/description/etc.
	// This drives <svelte:head> from ONE place (the layout) rather than letting
	// individual pages declare their own <svelte:head>, which — for reasons that
	// only reproduce in the prerendered production build, never in `vite dev` —
	// silently loses the page's <title>/canonical override on this SvelteKit
	// version whenever the page also passes a bind: prop to a child component.
	const seo = $derived<SeoData>({ ...DEFAULT_SEO, ...(page.data?.seo ?? {}) });
	const url = $derived(`https://getromy.app${seo.path}`);
	const image = $derived(seo.image ?? 'https://getromy.app/og-image.jpg');
	const robots = $derived(
		seo.robots ?? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
	);
</script>

<svelte:head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />

	<title>{seo.title}</title>
	<meta name="title" content={seo.title} />
	<meta name="description" content={seo.description} />
	<meta name="keywords" content={seo.keywords ?? DEFAULT_SEO.keywords} />
	<meta name="author" content="GetRomy LLC" />
	<meta name="robots" content={robots} />
	<meta name="theme-color" content="#0d0d0e" media="(prefers-color-scheme: dark)" />
	<meta name="theme-color" content="#fcfcfc" media="(prefers-color-scheme: light)" />

	<!-- Open Graph -->
	<meta property="og:type" content={seo.type ?? 'website'} />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={seo.title} />
	<meta property="og:description" content={seo.description} />
	<meta property="og:site_name" content="Rōmy" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:image" content={image} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={seo.title} />

	{#if seo.article}
		<meta property="article:published_time" content={seo.article.publishedTime} />
		{#if seo.article.modifiedTime}
			<meta property="article:modified_time" content={seo.article.modifiedTime} />
		{/if}
		{#if seo.article.section}
			<meta property="article:section" content={seo.article.section} />
		{/if}
		{#if seo.article.tag}
			<meta property="article:tag" content={seo.article.tag} />
		{/if}
		<meta property="article:publisher" content="https://getromy.app" />
	{/if}

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@RomyFindsMoney" />
	<meta name="twitter:creator" content="@RomyFindsMoney" />
	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={seo.title} />
	<meta name="twitter:description" content={seo.description} />
	<meta name="twitter:image" content={image} />
	<meta name="twitter:image:alt" content={seo.title} />

	<!-- Performance -->
	<link
		rel="preload"
		href="/fonts/Archivo-VariableFont_wdth,wght.woff2"
		as="font"
		type="font/woff2"
		crossorigin
	/>
	<link rel="dns-prefetch" href="//api.github.com" />
	<link rel="preconnect" href="//api.github.com" crossorigin />

	<!-- Favicons -->
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
	<link rel="shortcut icon" href="/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<link rel="manifest" href="/site.webmanifest" />

	<link rel="canonical" href={url} />

	<!-- Structured Data (JSON-LD) -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: 'Rōmy',
		alternateName: 'GetRomy',
		url: 'https://getromy.app',
		description: DEFAULT_SEO.description,
		publisher: {
			'@type': 'Organization',
			name: 'GetRomy LLC'
		}
	})}</script>`}

	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: 'Rōmy',
		url: 'https://getromy.app',
		applicationCategory: 'BusinessApplication',
		operatingSystem: 'macOS, Windows, Linux',
		description:
			'Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions. AI-powered prospect research with wealth indicators, giving history, and affinity signals.',
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD',
			availability: 'https://schema.org/InStock'
		},
		publisher: {
			'@type': 'Organization',
			name: 'GetRomy LLC',
			url: 'https://getromy.app'
		},
		featureList: [
			'AI-powered donor prospect research',
			'Wealth indicator screening',
			'Giving history analysis',
			'Affinity signal detection',
			'Actionable donor profiles',
			'No enterprise contracts required'
		]
	})}</script>`}

	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: 'GetRomy LLC',
		url: 'https://getromy.app',
		logo: 'https://getromy.app/icon-logo.png',
		description: 'Donor intelligence platform for small nonprofits',
		contactPoint: {
			'@type': 'ContactPoint',
			email: 'solomon@getromy.app',
			contactType: 'sales'
		},
		sameAs: ['https://x.com/RomyFindsMoney', 'https://github.com/GetRomy-App']
	})}</script>`}

	{#each seo.jsonLd ?? [] as block}
		{@html `<script type="application/ld+json">${JSON.stringify(block)}</script>`}
	{/each}
</svelte:head>

{@render children()}

<ContactModal />
