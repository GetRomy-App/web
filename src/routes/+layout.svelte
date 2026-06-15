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

	const title = 'Rōmy — AI Donor Intelligence for Small Nonprofits';
	const description =
		'Rōmy helps small nonprofits find new major donors at a fraction of the cost of enterprise tools. AI prospect research with wealth indicators, giving history, and RōmyScore capacity estimates — starting at $29/month.';
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
		content="nonprofit donor intelligence, AI prospect research, fundraising software for nonprofits, donor wealth screening, major gift fundraising, small nonprofit fundraising, affordable prospect research, donor discovery, wealth indicators, giving history analysis, major donor prospecting, AI fundraising tools, nonprofit technology, donor intelligence platform, prospect research tool, DonorSearch alternative, iWave alternative, WealthEngine alternative, donor capacity estimation, nonprofit AI tools, philanthropy intelligence, development officer tools, major gifts strategy, donor cultivation, RōmyScore, PIF-Bench"
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
	<meta property="og:image:alt" content="Rōmy — AI Donor Intelligence for Small Nonprofits" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@RomyFindsMoney" />
	<meta name="twitter:creator" content="@RomyFindsMoney" />
	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />
	<meta name="twitter:image:alt" content="Rōmy — AI Donor Intelligence for Small Nonprofits" />

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
		"description": "AI-powered donor intelligence platform for small nonprofits — prospect research, wealth screening, and major donor discovery at a fraction of enterprise cost.",
		"publisher": {
			"@type": "Organization",
			"name": "GetRomy LLC"
		}
	})}</script>`}

	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		"name": "Rōmy",
		"alternateName": ["Romy", "GetRomy", "Rōmy Donor Intelligence"],
		"url": "https://getromy.app",
		"applicationCategory": "BusinessApplication",
		"applicationSubCategory": "Nonprofit Fundraising Software",
		"operatingSystem": "Web, macOS, Windows, Linux",
		"description": "Rōmy is an AI-powered donor intelligence platform for small nonprofits. It delivers 16-section prospect research reports with wealth indicators, giving history, RōmyScore capacity estimates, and actionable engagement strategies — at 52x–172x lower cost than enterprise tools like DonorSearch, iWave, and WealthEngine.",
		"screenshot": "https://getromy.app/screenshot.webp",
		"audience": {
			"@type": "Audience",
			"audienceType": "Small and mid-sized nonprofits, development officers, major gift fundraisers"
		},
		"offers": [
			{
				"@type": "Offer",
				"name": "Growth Plan",
				"price": "29",
				"priceCurrency": "USD",
				"billingIncrement": "P1M",
				"description": "500 credits/month — AI prospect research, RōmyScore 2.0, batch enrichment, 10 knowledge sources",
				"availability": "https://schema.org/InStock"
			},
			{
				"@type": "Offer",
				"name": "Pro Plan",
				"price": "89",
				"priceCurrency": "USD",
				"billingIncrement": "P1M",
				"description": "1,000 credits/month — priority support, advanced analytics, 50 knowledge sources",
				"availability": "https://schema.org/InStock"
			},
			{
				"@type": "Offer",
				"name": "Scale Plan",
				"price": "199",
				"priceCurrency": "USD",
				"billingIncrement": "P1M",
				"description": "5,000 credits/month — dedicated support, full analytics, unlimited knowledge sources",
				"availability": "https://schema.org/InStock"
			}
		],
		"publisher": {
			"@type": "Organization",
			"name": "GetRomy LLC",
			"url": "https://getromy.app"
		},
		"featureList": [
			"AI-powered major donor prospect research",
			"16-section donor intelligence reports",
			"RōmyScore wealth capacity estimation",
			"Wealth indicator screening",
			"Philanthropic giving history analysis",
			"Affinity signal and cause-area detection",
			"Batch prospect enrichment",
			"Donor discovery search by natural language",
			"Hyperlinked source citations with confidence levels",
			"No enterprise contracts or per-seat licensing",
			"Credit-based pricing — pay only for what you use",
			"Comparable accuracy to $15K–$50K/year enterprise tools"
		],
		"aggregateRating": {
			"@type": "AggregateRating",
			"ratingValue": "94.6",
			"bestRating": "100",
			"ratingCount": "5",
			"reviewAspect": "PIF-Bench Prospect Intelligence Fidelity Score"
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
			"url": "https://getromy.app/icon-logo.png"
		},
		"image": "https://getromy.app/og-image.jpg",
		"description": "GetRomy LLC builds AI-powered donor intelligence tools for small nonprofits. Our flagship product, Rōmy, delivers enterprise-grade prospect research at a price built for small development teams.",
		"foundingDate": "2025",
		"areaServed": "US",
		"knowsAbout": [
			"Nonprofit fundraising",
			"Major gift development",
			"Donor prospect research",
			"Wealth screening",
			"AI-powered prospect intelligence",
			"Philanthropic data analysis"
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
</svelte:head>

{@render children()}
