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

	const title = 'Rōmy — AI Donor Intelligence for Small Nonprofits | Prospect Research Software';
	const description =
		'Rōmy gives small nonprofits affordable AI-powered donor prospect research. Find major donors, screen wealth indicators, analyze giving history, and get actionable profiles — starting free. 94.6 PIF-Bench score beats ChatGPT, Claude, and Gemini.';
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
		content="nonprofit donor intelligence, AI prospect research tool, donor discovery software, wealth screening alternative, major donor prospecting, small nonprofit fundraising software, giving history analysis, AI fundraising tool, donor intelligence platform, affordable prospect research, DonorSearch alternative, iWave alternative, nonprofit CRM alternative, philanthropic screening, donor capacity assessment, nonprofit technology, fundraising AI, major gift fundraising, wealth indicators, affinity signals, planned giving research, DAF donor detection"
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
	<meta property="og:image:alt" content="Rōmy — AI Donor Intelligence for Small Nonprofits" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@RomyFindsMoney" />
	<meta name="twitter:creator" content="@RomyFindsMoney" />
	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content="https://getromy.app/og-image.jpg" />
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
		"@type": "SoftwareApplication",
		"name": "Rōmy",
		"alternateName": ["Romy", "GetRomy", "Romy Donor Intelligence"],
		"url": "https://getromy.app",
		"applicationCategory": "BusinessApplication",
		"applicationSubCategory": "Nonprofit Fundraising Software",
		"operatingSystem": "macOS, Windows, Linux, Web",
		"description": "Rōmy is an AI-powered donor intelligence platform for small nonprofits. Generate comprehensive prospect research reports with wealth indicators, charitable giving history, affinity signals, and actionable outreach guidance — starting free, from $0.50 per report.",
		"screenshot": "https://getromy.app/og-image.jpg",
		"image": "https://getromy.app/og-image.jpg",
		"offers": [
			{
				"@type": "Offer",
				"name": "Starter",
				"price": "0",
				"priceCurrency": "USD",
				"availability": "https://schema.org/InStock",
				"description": "3 donor research reports per month, free forever"
			},
			{
				"@type": "Offer",
				"name": "Growth",
				"price": "290",
				"priceCurrency": "USD",
				"availability": "https://schema.org/InStock",
				"description": "50 reports per month — $290/year"
			},
			{
				"@type": "Offer",
				"name": "Scale",
				"price": "1990",
				"priceCurrency": "USD",
				"availability": "https://schema.org/InStock",
				"description": "200+ reports per month — $1,990/year"
			}
		],
		"publisher": {
			"@type": "Organization",
			"name": "GetRomy LLC",
			"url": "https://getromy.app"
		},
		"featureList": [
			"AI-powered major donor prospect research",
			"Wealth indicator screening (real estate, stocks, business ownership)",
			"Charitable giving history and philanthropic interest analysis",
			"Affinity and connection signal detection",
			"Ask-amount guidance and capacity assessment",
			"Outreach angle identification",
			"Planned giving and estate indicator signals",
			"Donor Advised Fund (DAF) activity detection",
			"16-section comprehensive donor profiles",
			"No enterprise contracts or per-seat licensing"
		],
		"aggregateRating": {
			"@type": "AggregateRating",
			"ratingValue": "94.6",
			"bestRating": "100",
			"worstRating": "0",
			"ratingCount": "1",
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
			"url": "https://getromy.app/icon-logo.png",
			"width": 512,
			"height": 512
		},
		"image": "https://getromy.app/og-image.jpg",
		"description": "GetRomy LLC builds affordable AI donor intelligence software for small nonprofits — closing the information asymmetry between large and small fundraising organizations.",
		"contactPoint": [
			{
				"@type": "ContactPoint",
				"email": "solomon@getromy.app",
				"contactType": "sales",
				"areaServed": "US"
			},
			{
				"@type": "ContactPoint",
				"email": "howard@getromy.app",
				"contactType": "technical support",
				"areaServed": "US"
			}
		],
		"sameAs": [
			"https://x.com/RomyFindsMoney",
			"https://github.com/GetRomy-App"
		],
		"knowsAbout": [
			"nonprofit donor intelligence",
			"prospect research software",
			"AI fundraising tools",
			"major gift fundraising",
			"wealth screening",
			"philanthropic data analysis"
		]
	})}</script>`}

	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "WebSite",
		"name": "Rōmy",
		"url": "https://getromy.app",
		"description": "AI donor intelligence platform for small nonprofits — affordable prospect research, wealth screening, and major gift fundraising tools.",
		"publisher": {
			"@type": "Organization",
			"name": "GetRomy LLC"
		},
		"inLanguage": "en-US"
	})}</script>`}
</svelte:head>

{@render children()}
