<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import Lenis from 'lenis';
	import { gsap, ScrollTrigger, registerGsap } from '$lib/gsap';

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
		content="nonprofit donor intelligence, fundraising software for nonprofits, AI prospect research tool, donor discovery platform, wealth screening nonprofits, major donor prospecting, giving history analysis, RōmyScore, donor intelligence platform, small nonprofit fundraising, nonprofit technology, donor wealth indicators, prospect research automation, DonorSearch alternative, iWave alternative, WealthEngine alternative, affordable donor research, nonprofit CRM, philanthropy intelligence, fundraising AI"
	/>
	<meta name="author" content="GetRomy LLC" />
	<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
	<meta name="theme-color" content="#0d0d0e" media="(prefers-color-scheme: dark)" />
	<meta name="theme-color" content="#fcfcfc" media="(prefers-color-scheme: light)" />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:site_name" content="Rōmy" />
	<meta property="og:locale" content="en_US" />

	<!-- Open Graph image -->
	<meta property="og:image" content="https://getromy.app/og-image.jpg" />
	<meta property="og:image:width" content="1920" />
	<meta property="og:image:height" content="1080" />
	<meta property="og:image:type" content="image/jpeg" />
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
	<link rel="preload" href="/fonts/Archivo-VariableFont_wdth,wght.woff2" as="font" type="font/woff2" crossorigin />
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
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		"name": "Rōmy",
		"alternateName": ["Romy", "GetRomy"],
		"url": "https://getromy.app",
		"applicationCategory": "BusinessApplication",
		"applicationSubCategory": "Fundraising Software",
		"operatingSystem": "Web, macOS, Windows, Linux",
		"description": "Rōmy is an AI-powered donor intelligence platform for small nonprofits. It replaces expensive enterprise wealth screening tools ($15K–$50K/year) with affordable, purpose-built prospect research that surfaces wealth indicators, giving histories, and affinity signals at $29/month.",
		"screenshot": [
			"https://getromy.app/screenshot.webp",
			"https://getromy.app/screenshot-light.webp"
		],
		"offers": [
			{
				"@type": "Offer",
				"name": "Growth",
				"price": "29",
				"priceCurrency": "USD",
				"billingIncrement": "P1M",
				"description": "500 credits/month — AI research, RōmyScore 2.0, batch enrichment"
			},
			{
				"@type": "Offer",
				"name": "Pro",
				"price": "89",
				"priceCurrency": "USD",
				"billingIncrement": "P1M",
				"description": "1,000 credits/month — priority support, advanced analytics"
			},
			{
				"@type": "Offer",
				"name": "Scale",
				"price": "199",
				"priceCurrency": "USD",
				"billingIncrement": "P1M",
				"description": "5,000 credits/month — dedicated support, full analytics"
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
			"Giving history analysis",
			"Affinity signal detection",
			"Actionable 16-section donor profiles",
			"RōmyScore 2.0 prospect scoring",
			"Batch prospect enrichment",
			"Major donor discovery",
			"No enterprise contracts required",
			"Credit-based flexible pricing"
		],
		"audience": {
			"@type": "Audience",
			"audienceType": "Small nonprofits, development officers, fundraising teams"
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
			"url": "https://getromy.app/icon-logo.png"
		},
		"description": "Donor intelligence platform for small nonprofits. AI-powered prospect research with wealth indicators, giving history, and affinity signals at a fraction of enterprise cost.",
		"foundingDate": "2024",
		"contactPoint": [
			{
				"@type": "ContactPoint",
				"email": "solomon@getromy.app",
				"contactType": "sales"
			},
			{
				"@type": "ContactPoint",
				"email": "howard@getromy.app",
				"contactType": "customer support"
			}
		],
		"sameAs": [
			"https://x.com/RomyFindsMoney",
			"https://github.com/GetRomy-App",
			"https://intel.getromy.app"
		]
	})}</script>`}

	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "WebSite",
		"name": "Rōmy",
		"url": "https://getromy.app",
		"description": "Donor intelligence for small nonprofits. AI-powered prospect research at a fraction of enterprise cost.",
		"publisher": {
			"@type": "Organization",
			"name": "GetRomy LLC"
		},
		"potentialAction": {
			"@type": "SearchAction",
			"target": {
				"@type": "EntryPoint",
				"urlTemplate": "https://getromy.app/blog?q={search_term_string}"
			},
			"query-input": "required name=search_term_string"
		}
	})}</script>`}
</svelte:head>

{@render children()}
