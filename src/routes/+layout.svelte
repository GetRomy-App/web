<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import Lenis from 'lenis';
	import { gsap, ScrollTrigger, registerGsap } from '$lib/gsap';
	import ContactModal from '$lib/components/ui/ContactModal.svelte';
	import { contactModal } from '$lib/stores/contact.svelte';
	import { SITE_URL, DEFAULT_OG_IMAGE, ORGANIZATION_ID, WEBSITE_ID, jsonLdScript } from '$lib/seo';

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

	const organization = {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		'@id': ORGANIZATION_ID,
		name: 'Rōmy',
		legalName: 'GetRomy LLC',
		alternateName: 'GetRomy',
		url: SITE_URL,
		logo: {
			'@type': 'ImageObject',
			url: `${SITE_URL}/icon-logo.png`
		},
		image: DEFAULT_OG_IMAGE,
		description:
			'Rōmy is a donor intelligence platform that helps small nonprofits find new major donors with AI-powered prospect research.',
		slogan: 'Donor intelligence for small nonprofits',
		knowsAbout: [
			'nonprofit fundraising',
			'major gift prospecting',
			'donor prospect research',
			'wealth screening',
			'donor intelligence'
		],
		contactPoint: {
			'@type': 'ContactPoint',
			email: 'solomon@getromy.app',
			contactType: 'sales'
		},
		sameAs: ['https://x.com/RomyFindsMoney', 'https://github.com/GetRomy-App']
	};

	const website = {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'@id': WEBSITE_ID,
		name: 'Rōmy',
		alternateName: 'GetRomy',
		url: `${SITE_URL}/`,
		inLanguage: 'en-US',
		publisher: { '@id': ORGANIZATION_ID }
	};
</script>

<svelte:head>
	<meta name="author" content="GetRomy LLC" />
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

	<!-- Feeds & machine-readable site summary -->
	<link rel="alternate" type="application/rss+xml" title="Rōmy Blog" href="/rss.xml" />
	<link rel="alternate" type="text/markdown" title="Rōmy — LLM summary" href="/llms.txt" />

	<!-- Site-wide structured data (page-specific schema lives in each page's <Seo>) -->
	{@html jsonLdScript(organization)}
	{@html jsonLdScript(website)}
</svelte:head>

{@render children()}

<ContactModal />
