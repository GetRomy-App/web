<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import Lenis from 'lenis';
	import { gsap, ScrollTrigger, registerGsap } from '$lib/gsap';
	import ContactModal from '$lib/components/ui/ContactModal.svelte';
	import { contactModal } from '$lib/stores/contact.svelte';
	import { page } from '$app/state';
	import Seo from '$lib/components/Seo.svelte';
	import { SITE, organizationId, websiteId } from '$lib/seo';

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

	const isHome = $derived(page.url.pathname === '/');

	const title = 'Rōmy — AI Donor Research & Wealth Screening Software for Small Nonprofits';
	const description =
		'Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions. AI-powered prospect research, wealth indicators, and giving history — at a price built for small teams.';

	const homeJsonLd = [
		{
			'@context': 'https://schema.org',
			'@type': 'SoftwareApplication',
			'@id': `${SITE}/#software`,
			name: 'Rōmy',
			alternateName: 'Rōmy Donor Intelligence',
			url: SITE,
			image: `${SITE}/og-image.jpg`,
			applicationCategory: 'BusinessApplication',
			applicationSubCategory: 'Donor research and prospect screening software',
			operatingSystem: 'macOS, Windows, Linux',
			description,
			offers: {
				'@type': 'Offer',
				price: '0',
				priceCurrency: 'USD',
				availability: 'https://schema.org/InStock'
			},
			publisher: { '@id': organizationId() },
			audience: { '@type': 'Audience', audienceType: 'Small nonprofit fundraising teams' },
			keywords:
				'donor research software, AI prospect research, wealth screening, major gift prospecting, DonorSearch alternative, iWave alternative, WealthEngine alternative',
			featureList: [
				'AI-powered donor prospect research',
				'Wealth indicator screening',
				'Giving history analysis',
				'Affinity signal detection',
				'Actionable donor profiles',
				'No enterprise contracts required'
			]
		}
	];

	const globalJsonLd = [
		{
			'@context': 'https://schema.org',
			'@type': 'Organization',
			'@id': organizationId(),
			name: 'GetRomy LLC',
			alternateName: 'Rōmy',
			url: SITE,
			logo: `${SITE}/icon-logo.png`,
			description: 'Donor intelligence platform for small nonprofits',
			contactPoint: {
				'@type': 'ContactPoint',
				email: 'solomon@getromy.app',
				contactType: 'sales'
			},
			sameAs: ['https://x.com/RomyFindsMoney', 'https://github.com/GetRomy-App']
		},
		{
			'@context': 'https://schema.org',
			'@type': 'WebSite',
			'@id': websiteId(),
			name: 'Rōmy',
			url: SITE,
			publisher: { '@id': organizationId() },
			inLanguage: 'en-US'
		}
	];
</script>

<svelte:head>
	<meta name="author" content="GetRomy LLC" />
	<meta name="theme-color" content="#0d0d0e" media="(prefers-color-scheme: dark)" />
	<meta name="theme-color" content="#fcfcfc" media="(prefers-color-scheme: light)" />
	<meta name="application-name" content="Rōmy" />
	<meta name="apple-mobile-web-app-title" content="Rōmy" />

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
	<link rel="sitemap" type="application/xml" href="/sitemap.xml" />
	<link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-readable site summary" />

	{#each globalJsonLd as block}
		{@html `<script type="application/ld+json">${JSON.stringify(block)}</script>`}
	{/each}
</svelte:head>

{#if isHome}
	<Seo
		{title}
		{description}
		path="/"
		keywords={[
			'fundraising software',
			'prospect research tool',
			'donor discovery platform',
			'wealth screening',
			'giving history',
			'AI donor research',
			'donor wealth indicators',
			'philanthropy intelligence'
		]}
		jsonLd={homeJsonLd}
	/>
{/if}

{@render children()}

<ContactModal />
