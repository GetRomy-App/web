<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import Lenis from 'lenis';
	import { gsap, ScrollTrigger, registerGsap } from '$lib/gsap';
	import ContactModal from '$lib/components/ui/ContactModal.svelte';
	import { contactModal } from '$lib/stores/contact.svelte';
	import { page } from '$app/state';
	import { jsonLd, OG_IMAGE, OG_IMAGE_ALT } from '$lib/seo';

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
		'Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions. AI-powered prospect research, wealth indicators, and giving history — at a price built for small teams.';
	const url = 'https://getromy.app/';

	// Child routes set their own title/description/canonical; the layout only supplies them for the homepage.
	const isHome = $derived(page.url.pathname === '/');
</script>

<svelte:head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />

	{#if isHome}
		<title>{title}</title>
		<meta name="title" content={title} />
		<meta name="description" content={description} />
		<meta
			name="keywords"
			content="donor intelligence software, nonprofit donor research, AI prospect research for nonprofits, major donor prospecting, affordable wealth screening, donor wealth indicators, giving history, small nonprofit fundraising software, donor discovery platform, fundraising CRM alternative, philanthropy intelligence, DonorSearch alternative, iWave alternative, WealthEngine alternative"
		/>
		<meta property="og:type" content="website" />
		<meta property="og:url" content={url} />
		<meta property="og:title" content={title} />
		<meta property="og:description" content={description} />
		<meta name="twitter:url" content={url} />
		<meta name="twitter:title" content={title} />
		<meta name="twitter:description" content={description} />
		<link rel="canonical" href={url} />
	{/if}
	<meta name="author" content="GetRomy LLC" />
	<meta
		name="robots"
		content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
	/>
	<meta name="theme-color" content="#0d0d0e" media="(prefers-color-scheme: dark)" />
	<meta name="theme-color" content="#fcfcfc" media="(prefers-color-scheme: light)" />

	<!-- Open Graph / Twitter (shared) -->
	<meta property="og:site_name" content="Rōmy" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:image" content={OG_IMAGE} />
	<meta property="og:image:width" content="1920" />
	<meta property="og:image:height" content="1080" />
	<meta property="og:image:alt" content={OG_IMAGE_ALT} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@RomyFindsMoney" />
	<meta name="twitter:creator" content="@RomyFindsMoney" />
	<meta name="twitter:image" content={OG_IMAGE} />
	<meta name="twitter:image:alt" content={OG_IMAGE_ALT} />
	<meta name="application-name" content="Rōmy" />
	<meta name="apple-mobile-web-app-title" content="Rōmy" />
	<meta name="geo.region" content="US" />
	<link rel="alternate" type="application/rss+xml" title="Rōmy Blog" href="/blog/rss.xml" />
	<link rel="alternate" type="text/markdown" title="llms.txt" href="/llms.txt" />

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

	<!-- Structured Data (JSON-LD) -->
	{@html jsonLd({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Organization',
				'@id': 'https://getromy.app/#organization',
				name: 'GetRomy LLC',
				alternateName: ['Rōmy', 'Romy', 'GetRomy'],
				url: 'https://getromy.app',
				logo: 'https://getromy.app/icon-logo.png',
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
				'@id': 'https://getromy.app/#website',
				url: 'https://getromy.app',
				name: 'Rōmy',
				alternateName: ['Romy', 'Rōmy Donor Intelligence'],
				inLanguage: 'en-US',
				publisher: { '@id': 'https://getromy.app/#organization' }
			}
		]
	})}
	{#if isHome}
		{@html jsonLd({
			'@context': 'https://schema.org',
			'@type': 'SoftwareApplication',
			'@id': 'https://getromy.app/#software',
			name: 'Rōmy',
			url: 'https://getromy.app',
			image: OG_IMAGE,
			applicationCategory: 'BusinessApplication',
			applicationSubCategory: 'Donor intelligence and prospect research software',
			operatingSystem: 'macOS, Windows, Linux',
			description,
			offeredBy: { '@id': 'https://getromy.app/#organization' },
			publisher: { '@id': 'https://getromy.app/#organization' },
			audience: { '@type': 'Audience', audienceType: 'Small nonprofit fundraising teams' },
			featureList: [
				'AI-powered donor prospect research',
				'Wealth indicator screening',
				'Giving history analysis',
				'Affinity signal detection',
				'Actionable donor profiles',
				'No enterprise contracts required'
			]
		})}
	{/if}
</svelte:head>

{@render children()}

<ContactModal />
