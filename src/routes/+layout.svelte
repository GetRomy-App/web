<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import Lenis from 'lenis';
	import { gsap, ScrollTrigger, registerGsap } from '$lib/gsap';
	import { page } from '$app/state';

	let { children } = $props();

	registerGsap();

	onMount(() => {
		const lenis = new Lenis();

		lenis.on('scroll', ScrollTrigger.update);

		gsap.ticker.add((time: number) => {
			lenis.raf(time * 1000);
		});

		gsap.ticker.lagSmoothing(0);

		return () => {
			lenis.destroy();
		};
	});

	const siteUrl = 'https://getromy.app';
	const title = 'Rōmy — Donor Intelligence for Small Nonprofits';
	const description =
		'Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions. AI-powered prospect research, wealth indicators, and giving history — at a price built for small teams.';
	const ogImage = `${siteUrl}/og-image.jpg`;
</script>

<svelte:head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />

	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={description} />
	<meta
		name="keywords"
		content="nonprofit donor intelligence, fundraising software, prospect research tool, donor discovery platform, wealth screening, giving history, AI donor research, nonprofit fundraising, major donor prospecting, small nonprofit tools, donor management, philanthropy intelligence, fundraising CRM, nonprofit technology, donor wealth indicators, nonprofit prospect research, donor capacity screening, DonorSearch alternative, iWave alternative, WealthEngine alternative, affordable donor research, RōmyScore, major gift fundraising, planned giving prospects, fundraising automation, nonprofit development software"
	/>
	<meta name="author" content="GetRomy LLC" />
	<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
	<meta name="theme-color" content="#0d0d0e" media="(prefers-color-scheme: dark)" />
	<meta name="theme-color" content="#fcfcfc" media="(prefers-color-scheme: light)" />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="{siteUrl}{page.url.pathname}" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:site_name" content="Rōmy" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="Rōmy — Donor Intelligence for Small Nonprofits" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@RomyFindsMoney" />
	<meta name="twitter:creator" content="@RomyFindsMoney" />
	<meta name="twitter:url" content="{siteUrl}{page.url.pathname}" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />
	<meta name="twitter:image:alt" content="Rōmy — Donor Intelligence for Small Nonprofits" />

	<!-- Performance -->
	<link rel="preload" href="/fonts/Archivo-VariableFont_wdth,wght.woff2" as="font" type="font/woff2" crossorigin />
	<link rel="dns-prefetch" href="//api.github.com" />
	<link rel="preconnect" href="//api.github.com" crossorigin />

	<!-- Favicons -->
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
	<link rel="shortcut icon" href="/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<link rel="manifest" href="/site.webmanifest" />

	<link rel="canonical" href="{siteUrl}{page.url.pathname}" />

	<!-- Structured Data (JSON-LD) -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		"name": "Rōmy",
		"alternateName": "GetRomy",
		"url": "https://getromy.app",
		"applicationCategory": "BusinessApplication",
		"applicationSubCategory": "Nonprofit Fundraising Software",
		"operatingSystem": "macOS, Windows, Linux, Web",
		"description": "Rōmy is an AI-powered donor intelligence platform for small nonprofits. Find new major donors, screen wealth indicators, and research giving history at a fraction of enterprise costs — starting at $0.10 per prospect.",
		"offers": [
			{
				"@type": "Offer",
				"name": "Growth",
				"price": "29",
				"priceCurrency": "USD",
				"priceSpecification": {
					"@type": "UnitPriceSpecification",
					"price": "29",
					"priceCurrency": "USD",
					"unitText": "MONTH"
				},
				"availability": "https://schema.org/InStock"
			},
			{
				"@type": "Offer",
				"name": "Pro",
				"price": "89",
				"priceCurrency": "USD",
				"priceSpecification": {
					"@type": "UnitPriceSpecification",
					"price": "89",
					"priceCurrency": "USD",
					"unitText": "MONTH"
				},
				"availability": "https://schema.org/InStock"
			},
			{
				"@type": "Offer",
				"name": "Scale",
				"price": "199",
				"priceCurrency": "USD",
				"priceSpecification": {
					"@type": "UnitPriceSpecification",
					"price": "199",
					"priceCurrency": "USD",
					"unitText": "MONTH"
				},
				"availability": "https://schema.org/InStock"
			}
		],
		"publisher": {
			"@type": "Organization",
			"name": "GetRomy LLC",
			"url": "https://getromy.app"
		},
		"featureList": [
			"AI-powered donor prospect research",
			"Wealth indicator screening",
			"Giving history analysis from public records",
			"Affinity signal detection",
			"RōmyScore — normalized 0-100 donor readiness score",
			"Estimated donor capacity in USD",
			"Sourced web research with citations",
			"Batch prospect enrichment",
			"No enterprise contracts required",
			"Starting at $0.10 per prospect"
		],
		"aggregateRating": {
			"@type": "AggregateRating",
			"ratingValue": "94.6",
			"bestRating": "100",
			"ratingCount": "1",
			"reviewAspect": "PIF-Bench Prospect Intelligence Fidelity Score"
		}
	})}</script>`}

	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "Organization",
		"name": "GetRomy LLC",
		"alternateName": "Rōmy",
		"url": "https://getromy.app",
		"logo": {
			"@type": "ImageObject",
			"url": "https://getromy.app/icon-logo.png",
			"width": 512,
			"height": 512
		},
		"description": "GetRomy LLC builds donor intelligence software for small nonprofits. Our flagship product, Rōmy, uses AI-powered prospect research to surface wealth indicators, giving history, and affinity signals — at a price built for small teams.",
		"foundingDate": "2024",
		"contactPoint": [
			{
				"@type": "ContactPoint",
				"email": "solomon@getromy.app",
				"contactType": "sales",
				"availableLanguage": "English"
			},
			{
				"@type": "ContactPoint",
				"email": "howard@getromy.app",
				"contactType": "customer support",
				"availableLanguage": "English"
			}
		],
		"sameAs": [
			"https://x.com/RomyFindsMoney",
			"https://github.com/GetRomy-App"
		],
		"knowsAbout": [
			"nonprofit fundraising",
			"donor prospect research",
			"wealth screening",
			"major gift fundraising",
			"philanthropic intelligence",
			"AI-powered donor research",
			"nonprofit technology"
		]
	})}</script>`}

	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "WebSite",
		"name": "Rōmy",
		"url": "https://getromy.app",
		"description": "Donor intelligence platform for small nonprofits — AI-powered prospect research starting at $0.10 per prospect.",
		"publisher": {
			"@type": "Organization",
			"name": "GetRomy LLC"
		},
		"potentialAction": {
			"@type": "ReadAction",
			"target": "https://getromy.app/blog"
		}
	})}</script>`}
</svelte:head>

{@render children()}
