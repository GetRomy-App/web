<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import Lenis from 'lenis';
	import { gsap, ScrollTrigger, registerGsap } from '$lib/gsap';
	import ContactModal from '$lib/components/ui/ContactModal.svelte';
	import { contactModal } from '$lib/stores/contact.svelte';
	import { graph, jsonLd, organizationSchema, websiteSchema } from '$lib/seo';

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
	<meta name="author" content="Rōmy" />
	<meta name="publisher" content="GetRomy LLC" />
	<meta name="application-name" content="Rōmy" />
	<meta name="apple-mobile-web-app-title" content="Rōmy" />
	<meta name="format-detection" content="telephone=no" />
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

	<!-- Feeds & machine-readable summaries (GEO) -->
	<link rel="alternate" type="application/rss+xml" title="Rōmy Field Notes — RSS" href="https://getromy.app/rss.xml" />
	<link rel="alternate" type="text/plain" title="llms.txt" href="https://getromy.app/llms.txt" />
	<link rel="sitemap" type="application/xml" href="https://getromy.app/sitemap.xml" />

	<!-- Site-wide structured data. Per-page title, description, canonical and schema live in <Seo />. -->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html jsonLd(graph(organizationSchema, websiteSchema))}
</svelte:head>

{@render children()}

<ContactModal />
