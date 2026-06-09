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
		content="nonprofit donor intelligence, fundraising software, prospect research tool, donor discovery platform, wealth screening, giving history, AI donor research, nonprofit fundraising, major donor prospecting, small nonprofit tools, donor management, philanthropy intelligence, fundraising CRM, nonprofit technology, donor wealth indicators"
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

	<!-- Feeds & Discovery -->
	<link rel="alternate" type="application/rss+xml" title="Rōmy Blog" href="/feed.xml" />

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
		"alternateName": ["Romy", "GetRomy", "Rōmy Donor Intelligence"],
		"url": "https://getromy.app",
		"applicationCategory": "BusinessApplication",
		"applicationSubCategory": "Nonprofit Fundraising Software",
		"operatingSystem": "macOS, Windows, Linux, Web",
		"description": "Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions. AI-powered prospect research with wealth indicators, giving history, and affinity signals — purpose-built for small development teams.",
		"offers": [
			{
				"@type": "Offer",
				"name": "Starter",
				"price": "0",
				"priceCurrency": "USD",
				"availability": "https://schema.org/InStock",
				"description": "Free tier for small nonprofits getting started with donor intelligence"
			},
			{
				"@type": "Offer",
				"name": "Growth",
				"price": "290",
				"priceCurrency": "USD",
				"billingIncrement": "P1Y",
				"availability": "https://schema.org/InStock"
			},
			{
				"@type": "Offer",
				"name": "Scale",
				"price": "1990",
				"priceCurrency": "USD",
				"billingIncrement": "P1Y",
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
			"Actionable donor profiles",
			"No enterprise contracts required",
			"16-section donor intelligence report",
			"PIF-Bench score 94.6 — highest accuracy among tested AI platforms",
			"$0.50–$5 cost per prospect report",
			"Purpose-built for small nonprofits"
		],
		"aggregateRating": {
			"@type": "AggregateRating",
			"ratingValue": "94.6",
			"bestRating": "100",
			"worstRating": "0",
			"ratingCount": "1",
			"description": "PIF-Bench composite accuracy score for AI donor research"
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
			"url": "https://getromy.app/icon-logo.png",
			"width": 512,
			"height": 512
		},
		"description": "GetRomy LLC builds Rōmy, the donor intelligence platform for small nonprofits. AI-powered prospect research at a fraction of enterprise pricing.",
		"foundingYear": "2024",
		"areaServed": "US",
		"knowsAbout": [
			"Nonprofit fundraising",
			"Major donor prospecting",
			"Prospect research",
			"Wealth screening",
			"Philanthropic data analysis",
			"AI-powered donor intelligence"
		],
		"contactPoint": {
			"@type": "ContactPoint",
			"email": "solomon@getromy.app",
			"contactType": "customer support"
		},
		"sameAs": [
			"https://x.com/RomyFindsMoney",
			"https://github.com/GetRomy-App"
		]
	})}</script>`}

	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "WebSite",
		"name": "Rōmy",
		"url": "https://getromy.app",
		"description": "Donor intelligence platform for small nonprofits",
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
