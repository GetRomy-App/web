<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import Lenis from 'lenis';
	import { gsap, ScrollTrigger, registerGsap } from '$lib/gsap';
	import ContactModal from '$lib/components/ui/ContactModal.svelte';
	import { contactModal } from '$lib/stores/contact.svelte';
	import {
		SITE_URL,
		SITE_NAME,
		ORG_NAME,
		ORG_ID,
		WEBSITE_ID,
		DEFAULT_DESCRIPTION,
		DEFAULT_OG_IMAGE,
		jsonLdScript
	} from '$lib/seo';

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

	const siteGraph = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Organization',
				'@id': ORG_ID,
				name: SITE_NAME,
				legalName: ORG_NAME,
				alternateName: ['Romy', 'GetRomy', 'Rōmy Donor Intelligence'],
				url: SITE_URL,
				logo: {
					'@type': 'ImageObject',
					url: `${SITE_URL}/icon-logo.png`
				},
				image: DEFAULT_OG_IMAGE,
				description:
					'Rōmy builds AI donor intelligence and prospect research software for small nonprofits.',
				knowsAbout: [
					'Prospect research',
					'Donor intelligence',
					'Wealth screening',
					'Major gift fundraising',
					'Donor stewardship',
					'Planned giving',
					'Nonprofit fundraising'
				],
				contactPoint: {
					'@type': 'ContactPoint',
					email: 'solomon@getromy.app',
					contactType: 'sales',
					availableLanguage: 'English'
				},
				sameAs: ['https://x.com/RomyFindsMoney', 'https://github.com/GetRomy-App']
			},
			{
				'@type': 'WebSite',
				'@id': WEBSITE_ID,
				url: SITE_URL,
				name: SITE_NAME,
				alternateName: 'Romy',
				description: DEFAULT_DESCRIPTION,
				inLanguage: 'en-US',
				publisher: { '@id': ORG_ID }
			}
		]
	};
</script>

<svelte:head>
	<!-- Page-specific title/description/canonical/OG live in $lib/components/Seo.svelte. -->
	<meta name="author" content={SITE_NAME} />
	<meta name="application-name" content={SITE_NAME} />
	<meta name="apple-mobile-web-app-title" content={SITE_NAME} />
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

	<!-- Favicons -->
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
	<link rel="shortcut icon" href="/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<link rel="manifest" href="/site.webmanifest" />

	<!-- Feeds & AI-readable summaries -->
	<link rel="alternate" type="application/rss+xml" title="Rōmy Blog" href="/blog/rss.xml" />
	<link rel="alternate" type="text/plain" title="LLM summary" href="/llms.txt" />

	<!-- Structured Data (JSON-LD): site-wide Organization + WebSite -->
	{@html jsonLdScript(siteGraph)}
</svelte:head>

{@render children()}

<ContactModal />
