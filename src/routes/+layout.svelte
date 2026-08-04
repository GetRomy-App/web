<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import Lenis from 'lenis';
	import { page } from '$app/state';
	import { gsap, ScrollTrigger, registerGsap } from '$lib/gsap';
	import ContactModal from '$lib/components/ui/ContactModal.svelte';
	import { contactModal } from '$lib/stores/contact.svelte';
	import { DEFAULT_SEO, DEFAULT_OG_IMAGE, SITE_URL, type SeoData } from '$lib/seo';

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

	// Per-route SEO comes from `page.data.seo` (set by each route's `load`),
	// falling back to the site default. See $lib/seo.ts for why this indirection
	// exists — it's what makes <title> actually differ per page.
	const seo = $derived<SeoData>({ ...DEFAULT_SEO, ...(page.data?.seo as Partial<SeoData> | undefined) });
	const canonicalUrl = $derived(`${SITE_URL}${seo.path ?? '/'}`);
	const ogImage = $derived(seo.image ?? DEFAULT_OG_IMAGE);
</script>

<svelte:head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />

	<title>{seo.title}</title>
	<meta name="title" content={seo.title} />
	<meta name="description" content={seo.description} />
	{#if seo.keywords}
		<meta name="keywords" content={seo.keywords} />
	{/if}
	<meta name="author" content="GetRomy LLC" />
	<meta
		name="robots"
		content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
	/>
	<meta name="theme-color" content="#0d0d0e" media="(prefers-color-scheme: dark)" />
	<meta name="theme-color" content="#fcfcfc" media="(prefers-color-scheme: light)" />

	<!-- Open Graph -->
	<meta property="og:type" content={seo.type ?? 'website'} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:title" content={seo.title} />
	<meta property="og:description" content={seo.description} />
	<meta property="og:site_name" content="Rōmy" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:width" content="1920" />
	<meta property="og:image:height" content="1080" />
	<meta property="og:image:alt" content="Rōmy — donor intelligence for small nonprofits" />
	{#if seo.article}
		{#if seo.article.publishedTime}
			<meta property="article:published_time" content={seo.article.publishedTime} />
		{/if}
		{#if seo.article.modifiedTime}
			<meta property="article:modified_time" content={seo.article.modifiedTime} />
		{/if}
		{#if seo.article.section}
			<meta property="article:section" content={seo.article.section} />
		{/if}
		<meta property="article:publisher" content={SITE_URL} />
	{/if}

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@RomyFindsMoney" />
	<meta name="twitter:creator" content="@RomyFindsMoney" />
	<meta name="twitter:url" content={canonicalUrl} />
	<meta name="twitter:title" content={seo.title} />
	<meta name="twitter:description" content={seo.description} />
	<meta name="twitter:image" content={ogImage} />
	<meta name="twitter:image:alt" content="Rōmy — donor intelligence for small nonprofits" />

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

	<link rel="canonical" href={canonicalUrl} />

	<!-- Structured Data (JSON-LD) -->
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
</svelte:head>

{@render children()}

<ContactModal />
