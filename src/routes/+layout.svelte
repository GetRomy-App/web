<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import Lenis from 'lenis';
	import { gsap, ScrollTrigger, registerGsap } from '$lib/gsap';
	import ContactModal from '$lib/components/ui/ContactModal.svelte';
	import { contactModal } from '$lib/stores/contact.svelte';
	import { SITE_URL, ORG_ID } from '$lib/seo';

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
	<meta name="application-name" content="Rōmy" />
	<meta name="apple-mobile-web-app-title" content="Rōmy" />
	<meta name="format-detection" content="telephone=no" />
	<meta name="theme-color" content="#0d0d0e" media="(prefers-color-scheme: dark)" />
	<meta name="theme-color" content="#fcfcfc" media="(prefers-color-scheme: light)" />
	<meta name="twitter:site" content="@RomyFindsMoney" />
	<meta name="twitter:creator" content="@RomyFindsMoney" />

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

	<!-- Discovery for crawlers and AI agents -->
	<link rel="sitemap" type="application/xml" href="/sitemap.xml" />
	<link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt" />

	<!-- Site-wide structured data (JSON-LD). Page-specific blocks live in each route's <Seo>. -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Organization',
				'@id': ORG_ID,
				name: 'GetRomy LLC',
				alternateName: ['Rōmy', 'GetRomy'],
				url: SITE_URL,
				logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon-logo.png` },
				description:
					'GetRomy LLC makes Rōmy, a donor intelligence platform for small nonprofits.',
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
				publisher: { '@id': ORG_ID }
			}
		]
	})}</script>`}
</svelte:head>

{@render children()}

<ContactModal />
