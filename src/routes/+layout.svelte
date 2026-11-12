<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import Lenis from 'lenis';
	import { gsap, ScrollTrigger, registerGsap } from '$lib/gsap';
	import ContactModal from '$lib/components/ui/ContactModal.svelte';
	import { contactModal } from '$lib/stores/contact.svelte';
	import { TWITTER_HANDLE, LEGAL_NAME } from '$lib/seo';

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
	<!-- Site-wide tags only. Title, description, canonical, Open Graph and JSON-LD are per page
	     (see $lib/components/seo/Seo.svelte) so no page inherits the home page's canonical. -->
	<meta name="author" content={LEGAL_NAME} />
	<meta name="publisher" content={LEGAL_NAME} />
	<meta name="application-name" content="Rōmy" />
	<meta name="apple-mobile-web-app-title" content="Rōmy" />
	<meta name="format-detection" content="telephone=no" />
	<meta name="theme-color" content="#0d0d0e" media="(prefers-color-scheme: dark)" />
	<meta name="theme-color" content="#fcfcfc" media="(prefers-color-scheme: light)" />
	<meta name="twitter:site" content={TWITTER_HANDLE} />
	<meta name="twitter:creator" content={TWITTER_HANDLE} />

	<!-- Performance -->
	<link
		rel="preload"
		href="/fonts/Archivo-VariableFont_wdth,wght.woff2"
		as="font"
		type="font/woff2"
		crossorigin
	/>

	<!-- Feeds and machine-readable site summaries -->
	<link rel="alternate" type="application/rss+xml" title="Rōmy Blog" href="/blog/rss.xml" />
	<link rel="alternate" type="text/plain" title="llms.txt" href="/llms.txt" />
	<link rel="sitemap" type="application/xml" href="/sitemap.xml" />

	<!-- Favicons -->
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
	<link rel="shortcut icon" href="/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<link rel="manifest" href="/site.webmanifest" />
</svelte:head>

{@render children()}

<ContactModal />
