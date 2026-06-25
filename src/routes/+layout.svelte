<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import Lenis from 'lenis';
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
		'Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions. AI-powered prospect research, wealth indicators, and giving history — at a price built for small teams.';
	const url = 'https://getromy.app/';
</script>

<svelte:head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />

	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={description} />
	<meta
		name="keywords"
		content="nonprofit donor intelligence, AI fundraising software, prospect research tool, donor discovery platform, wealth screening nonprofits, giving history analysis, AI donor research, major donor prospecting, small nonprofit tools, donor management software, philanthropy intelligence, DonorSearch alternative, iWave alternative, WealthEngine alternative, nonprofit prospect research, fundraising technology, donor capacity screening, planned giving prospects, major gifts fundraising, nonprofit CRM alternative, donor wealth indicators, prospect research software, charitable giving intelligence, nonprofit development tools"
	/>
	<meta name="author" content="GetRomy LLC" />
	<meta
		name="robots"
		content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
	/>
	<meta name="theme-color" content="#0d0d0e" media="(prefers-color-scheme: dark)" />
	<meta name="theme-color" content="#fcfcfc" media="(prefers-color-scheme: light)" />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:site_name" content="Rōmy" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:image" content="https://getromy.app/og-image.jpg" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="Rōmy — Donor Intelligence for Small Nonprofits" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@RomyFindsMoney" />
	<meta name="twitter:creator" content="@RomyFindsMoney" />
	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content="https://getromy.app/og-image.jpg" />
	<meta name="twitter:image:alt" content="Rōmy — Donor Intelligence for Small Nonprofits" />

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

	<link rel="canonical" href={url} />

	<!-- Structured Data (JSON-LD) -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: 'Rōmy',
		url: 'https://getromy.app',
		description: 'AI-powered donor intelligence platform for small nonprofits',
		potentialAction: {
			'@type': 'SearchAction',
			target: {
				'@type': 'EntryPoint',
				urlTemplate: 'https://getromy.app/blog?q={search_term_string}'
			},
			'query-input': 'required name=search_term_string'
		}
	})}</script>`}

	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: 'Rōmy',
		alternateName: ['Romy', 'GetRomy', 'Rōmy Donor Intelligence'],
		url: 'https://getromy.app',
		applicationCategory: 'BusinessApplication',
		applicationSubCategory: 'Fundraising Software',
		operatingSystem: 'macOS, Windows, Linux, Web Browser',
		description:
			'Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions. AI-powered prospect research with wealth indicators, giving history, and affinity signals. Scored 94.6 on PIF-Bench vs. ChatGPT (79.9), Claude (92.2), and Gemini (76.0).',
		offers: [
			{
				'@type': 'Offer',
				name: 'Starter',
				price: '0',
				priceCurrency: 'USD',
				availability: 'https://schema.org/InStock'
			},
			{
				'@type': 'Offer',
				name: 'Growth',
				price: '290',
				priceCurrency: 'USD',
				billingIncrement: 'P1Y',
				availability: 'https://schema.org/InStock'
			},
			{
				'@type': 'Offer',
				name: 'Scale',
				price: '1990',
				priceCurrency: 'USD',
				billingIncrement: 'P1Y',
				availability: 'https://schema.org/InStock'
			}
		],
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
			'Actionable 16-section donor profiles',
			'No enterprise contracts required',
			'$0.50–$5 per report',
			'2–10 minute turnaround per prospect',
			'Purpose-built for small nonprofits under $2M budget'
		],
		screenshot: 'https://getromy.app/og-image.jpg',
		aggregateRating: {
			'@type': 'AggregateRating',
			ratingValue: '94.6',
			bestRating: '100',
			ratingCount: '1',
			reviewAspect: 'PIF-Bench Prospect Intelligence Fidelity Score'
		}
	})}</script>`}

	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: 'GetRomy LLC',
		legalName: 'GetRomy LLC',
		url: 'https://getromy.app',
		logo: {
			'@type': 'ImageObject',
			url: 'https://getromy.app/icon-logo.png'
		},
		image: 'https://getromy.app/og-image.jpg',
		description: 'GetRomy LLC builds Rōmy, an AI-powered donor intelligence platform for small nonprofits. Rōmy provides affordable prospect research, wealth screening, and major donor discovery — replacing $15K–$50K/year enterprise tools at a fraction of the cost.',
		foundingDate: '2024',
		knowsAbout: [
			'Nonprofit fundraising',
			'Donor prospect research',
			'Wealth screening',
			'Major gift fundraising',
			'AI-powered research',
			'Planned giving',
			'Nonprofit technology'
		],
		contactPoint: {
			'@type': 'ContactPoint',
			email: 'solomon@getromy.app',
			contactType: 'customer support'
		},
		sameAs: [
			'https://x.com/RomyFindsMoney',
			'https://github.com/GetRomy-App',
			'https://intel.getromy.app'
		]
	})}</script>`}
</svelte:head>

{@render children()}

<ContactModal />
