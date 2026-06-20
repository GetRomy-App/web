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
	const ogImage = 'https://getromy.app/og-image.jpg';
</script>

<svelte:head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />

	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={description} />
	<meta
		name="keywords"
		content="nonprofit donor intelligence, fundraising software, prospect research tool, donor discovery platform, wealth screening nonprofit, giving history analysis, AI donor research, nonprofit fundraising software, major donor prospecting, small nonprofit fundraising tools, donor management software, philanthropy intelligence platform, fundraising CRM alternative, nonprofit technology, donor wealth indicators, prospect research software, affordable wealth screening, donor affinity signals, major gift fundraising, nonprofit AI tools, donor intelligence platform, fundraising prospect research, charitable giving data, nonprofit major gifts, donor cultivation software, wealth screening tools, nonprofit prospect management, donor research automation, giving capacity estimates, fundraising intelligence"
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
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="Rōmy — AI-powered donor intelligence for small nonprofits" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@RomyFindsMoney" />
	<meta name="twitter:creator" content="@RomyFindsMoney" />
	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />
	<meta name="twitter:image:alt" content="Rōmy — AI-powered donor intelligence for small nonprofits" />

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
		"@type": "WebSite",
		"name": "Rōmy",
		"url": "https://getromy.app",
		"description": "AI-powered donor intelligence platform for small nonprofits. Find major donors at a fraction of the cost of enterprise wealth screening tools.",
		"potentialAction": {
			"@type": "SearchAction",
			"target": {
				"@type": "EntryPoint",
				"urlTemplate": "https://intel.getromy.app?q={search_term_string}"
			},
			"query-input": "required name=search_term_string"
		}
	})}</script>`}

	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		"name": "Rōmy",
		"alternateName": "Romy Donor Intelligence",
		"url": "https://getromy.app",
		"applicationCategory": "BusinessApplication",
		"applicationSubCategory": "Nonprofit Fundraising Software",
		"operatingSystem": "Web",
		"description": "Rōmy is an AI-powered donor intelligence platform that helps small nonprofits find and research major donor prospects. Replaces expensive enterprise wealth screening tools with purpose-built AI at $0.50–$5 per report.",
		"offers": [
			{
				"@type": "Offer",
				"name": "Starter",
				"price": "0",
				"priceCurrency": "USD",
				"availability": "https://schema.org/InStock",
				"description": "Free plan to get started with AI donor research"
			},
			{
				"@type": "Offer",
				"name": "Growth",
				"price": "290",
				"priceCurrency": "USD",
				"billingIncrement": "P1Y",
				"availability": "https://schema.org/InStock",
				"description": "Annual plan for growing nonprofits researching up to 200 prospects per month"
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
			"DAF and Fidelity Charitable tracking",
			"Board and trustee network mapping",
			"No enterprise contracts required",
			"Cost per report: $0.50–$5",
			"Reports generated in 2–10 minutes"
		],
		"screenshot": "https://getromy.app/og-image.jpg",
		"aggregateRating": {
			"@type": "AggregateRating",
			"ratingValue": "94.1",
			"bestRating": "100",
			"ratingCount": "5",
			"description": "PIF-Bench accuracy score — Prospect Intelligence Fidelity benchmark across 5 major donor profiles"
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
		"image": "https://getromy.app/og-image.jpg",
		"description": "GetRomy LLC builds Rōmy, an AI-powered donor intelligence platform that makes professional prospect research affordable for small nonprofits. Founded to close the fundraising technology gap between large and small organizations.",
		"foundingDate": "2025",
		"areaServed": "US",
		"knowsAbout": [
			"Donor prospect research",
			"Nonprofit fundraising",
			"Wealth screening",
			"Major gift fundraising",
			"Philanthropy intelligence",
			"AI-powered fundraising tools"
		],
		"contactPoint": {
			"@type": "ContactPoint",
			"email": "solomon@getromy.app",
			"contactType": "customer support",
			"availableLanguage": "English"
		},
		"sameAs": [
			"https://x.com/RomyFindsMoney",
			"https://github.com/GetRomy-App"
		]
	})}</script>`}
</svelte:head>

{@render children()}
