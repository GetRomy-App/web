<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
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
	const siteUrl = 'https://getromy.app';
	const ogImage = 'https://getromy.app/og-image.jpg';

	const canonicalUrl = $derived(`${siteUrl}${page.url.pathname}`);
</script>

<svelte:head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />

	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={description} />
	<meta
		name="keywords"
		content="donor intelligence, nonprofit fundraising software, prospect research tool, AI donor research, donor discovery platform, wealth screening nonprofits, giving history, major donor prospecting, small nonprofit tools, nonprofit donor database, DonorSearch alternative, iWave alternative, WealthEngine alternative, affordable prospect research, fundraising CRM, nonprofit technology, donor wealth indicators, major gift fundraising, philanthropic data"
	/>
	<meta name="author" content="GetRomy LLC" />
	<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
	<meta name="theme-color" content="#0d0d0e" media="(prefers-color-scheme: dark)" />
	<meta name="theme-color" content="#fcfcfc" media="(prefers-color-scheme: light)" />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={canonicalUrl} />
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
	<meta name="twitter:url" content={canonicalUrl} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />
	<meta name="twitter:image:alt" content="Rōmy — Donor Intelligence for Small Nonprofits" />

	<!-- Performance -->
	<link rel="preload" href="/fonts/Archivo-VariableFont_wdth,wght.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
	<link rel="dns-prefetch" href="//api.github.com" />
	<link rel="preconnect" href="//api.github.com" crossorigin="anonymous" />

	<!-- Favicons -->
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
	<link rel="shortcut icon" href="/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<link rel="manifest" href="/site.webmanifest" />

	<link rel="canonical" href={canonicalUrl} />

	<!-- Structured Data (JSON-LD) -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "WebSite",
		"name": "Rōmy",
		"url": "https://getromy.app",
		"description": "AI-powered donor intelligence platform for small nonprofits — prospect research, wealth screening, and giving history at a fraction of enterprise cost.",
		"publisher": {
			"@type": "Organization",
			"name": "GetRomy LLC"
		}
	})}</script>`}

	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		"name": "Rōmy",
		"alternateName": ["Romy", "GetRomy", "Romy Donor Intelligence"],
		"url": "https://getromy.app",
		"applicationCategory": "BusinessApplication",
		"applicationSubCategory": "Nonprofit Fundraising Software",
		"operatingSystem": "Web, macOS, Windows, Linux",
		"description": "Rōmy is an AI-powered donor intelligence platform for small nonprofits. It surfaces wealth indicators, giving histories, and affinity signals — delivering actionable prospect research at a fraction of enterprise tool costs.",
		"screenshot": "https://getromy.app/screenshot.webp",
		"offers": [
			{
				"@type": "Offer",
				"name": "Growth Plan",
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
				"name": "Pro Plan",
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
				"name": "Scale Plan",
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
			"Giving history analysis",
			"Affinity signal detection",
			"RōmyScore donor scoring",
			"Batch prospect enrichment",
			"16-section donor intelligence reports",
			"Discovery search from natural language objectives",
			"No enterprise contracts required",
			"Credit-based pricing aligned with usage"
		],
		"aggregateRating": {
			"@type": "AggregateRating",
			"ratingValue": "94.6",
			"bestRating": "100",
			"ratingCount": "5",
			"reviewAspect": "PIF-Bench prospect intelligence fidelity score"
		}
	})}</script>`}

	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "Organization",
		"name": "GetRomy LLC",
		"legalName": "GetRomy LLC",
		"url": "https://getromy.app",
		"logo": {
			"@type": "ImageObject",
			"url": "https://getromy.app/favicon-96x96.png",
			"width": 96,
			"height": 96
		},
		"image": "https://getromy.app/og-image.jpg",
		"description": "GetRomy LLC builds AI-powered donor intelligence tools for small nonprofits — making major donor prospect research accessible at a fraction of enterprise pricing.",
		"foundingDate": "2025",
		"areaServed": "US",
		"knowsAbout": [
			"donor intelligence",
			"nonprofit fundraising",
			"prospect research",
			"wealth screening",
			"major gift fundraising",
			"philanthropic data analysis",
			"AI donor research"
		],
		"contactPoint": {
			"@type": "ContactPoint",
			"email": "solomon@getromy.app",
			"contactType": "sales",
			"availableLanguage": "English"
		},
		"sameAs": [
			"https://x.com/RomyFindsMoney",
			"https://github.com/GetRomy-App"
		]
	})}</script>`}
</svelte:head>

{@render children()}
