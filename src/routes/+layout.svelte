<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import Lenis from 'lenis';
	import { gsap, ScrollTrigger, registerGsap } from '$lib/gsap';
	import ContactModal from '$lib/components/ui/ContactModal.svelte';
	import { contactModal } from '$lib/stores/contact.svelte';
	import { SITE_URL, jsonLdScript } from '$lib/seo';

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
		crossorigin="anonymous"
	/>
	<link rel="dns-prefetch" href="//api.github.com" />
	<link rel="preconnect" href="//api.github.com" crossorigin="anonymous" />

	<!-- Favicons -->
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
	<link rel="shortcut icon" href="/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<link rel="manifest" href="/site.webmanifest" />
	<link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt" />

	<!-- Site-wide structured data (page-specific blocks live in each page's SeoHead) -->
	{@html jsonLdScript({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Organization',
				'@id': `${SITE_URL}/#organization`,
				name: 'GetRomy LLC',
				legalName: 'GetRomy LLC',
				alternateName: 'Rōmy',
				url: SITE_URL,
				logo: {
					'@type': 'ImageObject',
					url: `${SITE_URL}/icon-logo.png`
				},
				description:
					'GetRomy LLC builds Rōmy, a donor intelligence platform for small nonprofits.',
				contactPoint: {
					'@type': 'ContactPoint',
					email: 'solomon@getromy.app',
					contactType: 'sales'
				},
				sameAs: ['https://x.com/RomyFindsMoney', 'https://github.com/GetRomy-App']
			},
			{
				'@type': 'WebSite',
				'@id': `${SITE_URL}/#website`,
				url: SITE_URL,
				name: 'Rōmy',
				alternateName: ['Romy', 'getromy.app'],
				inLanguage: 'en-US',
				publisher: { '@id': `${SITE_URL}/#organization` }
			}
		]
	})}
</svelte:head>

{@render children()}

<ContactModal />
