<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import Lenis from 'lenis';
	import { page } from '$app/state';
	import { gsap, ScrollTrigger, registerGsap } from '$lib/gsap';
	import ContactModal from '$lib/components/ui/ContactModal.svelte';
	import { contactModal } from '$lib/stores/contact.svelte';

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

	const title = 'Rōmy — Donor Intelligence for Small Nonprofits';
	const description =
		'Rōmy helps small nonprofits find major donors for a fraction of the cost of legacy tools. AI-powered prospect research, wealth screening, and giving history.';
	const url = 'https://getromy.app/';
	const ogImage = 'https://getromy.app/og-image.jpg';

	// The tags below describe the product itself — they belong only on the homepage.
	// Every other route (blog posts, labs, legal pages, status) defines its own
	// title/description/canonical/JSON-LD in its own <svelte:head>; rendering the
	// homepage's tags there too created duplicate <title>/<meta description>/
	// rel=canonical/JSON-LD on every page, which made Google treat the homepage as
	// the canonical version of the whole site instead of indexing each page on its
	// own terms.
	let isHome = $derived(page.url.pathname === '/');
</script>

<svelte:head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />

	<meta
		name="robots"
		content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
	/>
	<meta name="theme-color" content="#0d0d0e" media="(prefers-color-scheme: dark)" />
	<meta name="theme-color" content="#fcfcfc" media="(prefers-color-scheme: light)" />

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

	<!-- Organization identity — safe and useful on every page, unlike the homepage-only tags below. -->
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

	{#if isHome}
		<title>{title}</title>
		<meta name="title" content={title} />
		<meta name="description" content={description} />
		<meta
			name="keywords"
			content="donor intelligence software, nonprofit donor research tool, AI prospect research, donor wealth screening, small nonprofit fundraising software, major donor prospecting tool, donor discovery platform, giving history lookup, philanthropy intelligence, nonprofit fundraising CRM, affordable wealth screening, donor management software, nonprofit technology, capacity ratings alternative, donor prospect list builder"
		/>
		<meta name="author" content="GetRomy LLC" />

		<!-- Open Graph -->
		<meta property="og:type" content="website" />
		<meta property="og:url" content={url} />
		<meta property="og:title" content={title} />
		<meta property="og:description" content={description} />
		<meta property="og:site_name" content="Rōmy" />
		<meta property="og:locale" content="en_US" />
		<meta property="og:image" content={ogImage} />
		<meta property="og:image:width" content="1920" />
		<meta property="og:image:height" content="1080" />
		<meta property="og:image:alt" content={title} />

		<!-- Twitter -->
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:site" content="@RomyFindsMoney" />
		<meta name="twitter:creator" content="@RomyFindsMoney" />
		<meta name="twitter:url" content={url} />
		<meta name="twitter:title" content={title} />
		<meta name="twitter:description" content={description} />
		<meta name="twitter:image" content={ogImage} />

		<link rel="canonical" href={url} />

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
			image: ogImage,
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
	{/if}
</svelte:head>

{@render children()}

<ContactModal />
