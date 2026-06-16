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
		'Rōmy helps small nonprofits find major donors at a fraction of the cost. AI-powered prospect research with wealth indicators, giving history, and affinity signals — starting at $290/year with no enterprise contracts.';
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
		content="nonprofit donor intelligence, fundraising software for nonprofits, prospect research tool, donor discovery platform, wealth screening nonprofits, philanthropic giving history, AI donor research, small nonprofit fundraising, major donor prospecting, affordable prospect research, donor intelligence platform, philanthropy intelligence, nonprofit development tools, donor wealth indicators, prospect scoring, capital campaign prospects, annual fund strategy, mid-level donor identification, new donor acquisition, donor affinity signals, donor capacity estimation, nonprofit CRM alternative, fundraising ROI, DonorSearch alternative, iWave alternative, WealthEngine alternative"
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
	<meta property="og:image:alt" content="Rōmy — Donor Intelligence for Small Nonprofits" />
	<meta property="og:image:type" content="image/jpeg" />

	<!-- Twitter / X -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@RomyFindsMoney" />
	<meta name="twitter:creator" content="@RomyFindsMoney" />
	<meta name="twitter:url" content={url} />
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

	<!-- Structured Data (JSON-LD) -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "WebSite",
		"name": "Rōmy",
		"alternateName": ["GetRomy", "Romy Donor Intelligence"],
		"url": "https://getromy.app",
		"description": "AI-powered donor intelligence platform for small nonprofits. Find major donors with wealth indicators, giving history, and affinity signals.",
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

	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		"name": "Rōmy",
		"alternateName": "GetRomy Donor Intelligence",
		"url": "https://getromy.app",
		"applicationCategory": "BusinessApplication",
		"applicationSubCategory": "Fundraising Software",
		"operatingSystem": "macOS, Windows, Linux, Web",
		"description": "AI-powered donor intelligence platform for small nonprofits. Surface wealth indicators, giving histories, and affinity signals for any prospect in seconds — at a price built for small teams.",
		"screenshot": "https://getromy.app/screenshot-light.webp",
		"image": "https://getromy.app/og-image.jpg",
		"offers": [
			{
				"@type": "Offer",
				"name": "Free Trial",
				"price": "0",
				"priceCurrency": "USD",
				"availability": "https://schema.org/InStock",
				"description": "Free trial — no credit card required"
			},
			{
				"@type": "Offer",
				"name": "Growth",
				"price": "290",
				"priceCurrency": "USD",
				"priceSpecification": {
					"@type": "UnitPriceSpecification",
					"price": "290",
					"priceCurrency": "USD",
					"unitText": "YEAR"
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
			"Philanthropic giving history analysis",
			"Affinity signal detection",
			"16-section actionable donor profiles",
			"No enterprise contracts required",
			"Prospect scoring and ranking",
			"Capital campaign prospect identification",
			"Major donor identification for small nonprofits"
		],
		"audience": {
			"@type": "Audience",
			"audienceType": "Small nonprofit organizations and development officers"
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
			"contentUrl": "https://getromy.app/icon-logo.png"
		},
		"image": "https://getromy.app/og-image.jpg",
		"description": "Rōmy is an AI-powered donor intelligence platform that helps small nonprofits find major donors. Purpose-built prospect research with wealth indicators, giving history, and affinity signals — at a fraction of the cost of enterprise tools.",
		"areaServed": {
			"@type": "Country",
			"name": "United States"
		},
		"knowsAbout": [
			"Nonprofit fundraising",
			"Donor intelligence",
			"Prospect research",
			"Wealth screening",
			"Major gift fundraising",
			"AI-powered prospect research",
			"Donor affinity analysis",
			"Philanthropic giving history"
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
