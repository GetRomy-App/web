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
		content="nonprofit donor intelligence, prospect research software, donor discovery platform, AI donor research, wealth screening software, major gift fundraising, small nonprofit fundraising, giving history analysis, donor prospect research, nonprofit fundraising tools, major donor prospecting, philanthropy intelligence, fundraising CRM alternative, nonprofit technology, donor wealth indicators, free prospect research, affordable donor research, fundraising software for nonprofits"
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

	<link rel="canonical" href={url} />

	<!-- Structured Data (JSON-LD) -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "WebSite",
		"name": "Rōmy",
		"url": "https://getromy.app",
		"description": "Donor intelligence platform for small nonprofits. AI-powered prospect research, wealth screening, and giving history at a fraction of the cost of enterprise tools.",
		"publisher": {
			"@type": "Organization",
			"name": "GetRomy LLC",
			"url": "https://getromy.app",
			"logo": {
				"@type": "ImageObject",
				"url": "https://getromy.app/icon-logo.png"
			}
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
		"alternateName": "Romy Donor Intelligence",
		"url": "https://getromy.app",
		"applicationCategory": "BusinessApplication",
		"applicationSubCategory": "Nonprofit Fundraising Software",
		"operatingSystem": "Web, macOS, Windows, Linux",
		"description": "Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions. AI-powered prospect research with wealth indicators, giving history, and affinity signals — purpose-built for small development teams.",
		"offers": {
			"@type": "AggregateOffer",
			"lowPrice": "0",
			"highPrice": "1990",
			"priceCurrency": "USD",
			"availability": "https://schema.org/InStock",
			"offerCount": "3"
		},
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
			"No enterprise contracts required",
			"Fraction of the cost of DonorSearch, iWave, or WealthEngine"
		],
		"screenshot": "https://getromy.app/preview.png",
		"aggregateRating": {
			"@type": "AggregateRating",
			"ratingValue": "4.9",
			"ratingCount": "47",
			"bestRating": "5",
			"worstRating": "1"
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
		"description": "Donor intelligence platform for small nonprofits. Purpose-built AI that surfaces major gift prospects, wealth indicators, and giving history at a price small teams can afford.",
		"foundingDate": "2024",
		"contactPoint": {
			"@type": "ContactPoint",
			"email": "solomon@getromy.app",
			"contactType": "customer support",
			"availableLanguage": "English"
		},
		"sameAs": [
			"https://x.com/RomyFindsMoney",
			"https://github.com/GetRomy-App"
		],
		"knowsAbout": [
			"Nonprofit Fundraising",
			"Donor Prospect Research",
			"Wealth Screening",
			"Major Gift Fundraising",
			"Artificial Intelligence",
			"Philanthropic Intelligence"
		]
	})}</script>`}

	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "FAQPage",
		"mainEntity": [
			{
				"@type": "Question",
				"name": "What is Rōmy?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Rōmy is an AI-powered donor intelligence platform built for small nonprofits. It surfaces major gift prospects, wealth indicators, giving history, and affinity signals — distilled into actionable donor profiles at a fraction of the cost of enterprise tools like DonorSearch or iWave."
				}
			},
			{
				"@type": "Question",
				"name": "How much does Rōmy cost?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Rōmy offers plans starting free, with paid tiers at $290/year (Growth) and $1,990/year (Scale) — compared to $15,000–$50,000/year for enterprise wealth screening platforms. No per-seat licensing or enterprise contracts required."
				}
			},
			{
				"@type": "Question",
				"name": "How accurate is Rōmy's prospect research?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Rōmy scored 94.6 on PIF-Bench (Prospect Intelligence Fidelity Benchmark), outperforming ChatGPT (79.9), Gemini (76.0), and matching Claude (92.2). PIF-Bench evaluates prospect research accuracy across wealth indicators, giving history, affinity signals, and actionability."
				}
			},
			{
				"@type": "Question",
				"name": "Who is Rōmy for?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Rōmy is purpose-built for small nonprofit development teams — typically organizations with 1–5 staff who do fundraising and can't afford enterprise prospect research software. It's ideal for organizations raising $500K–$5M annually who want to find and qualify major gift donors."
				}
			},
			{
				"@type": "Question",
				"name": "What does a Rōmy donor profile include?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Each Rōmy donor profile includes 16 sections: wealth indicators, real estate holdings, business affiliations, philanthropic giving history, affinity signals, capacity estimate, connection points to your organization, suggested ask amount, and outreach angles — everything needed to walk into a major gift meeting prepared."
				}
			}
		]
	})}</script>`}
</svelte:head>

{@render children()}
