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
		'Rōmy helps small nonprofits find new major donors at a fraction of the cost of DonorSearch, iWave, or WealthEngine. AI-powered prospect research with 16-section donor profiles, wealth indicators, giving history, and RōmyScore capacity scoring — starting at $290/yr.';
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
		content="nonprofit donor intelligence, AI donor research, prospect research software, wealth screening tool, donor discovery platform, major donor prospecting, small nonprofit fundraising, DonorSearch alternative, iWave alternative, WealthEngine alternative, giving history analysis, affinity signal detection, RōmyScore, donor capacity scoring, nonprofit fundraising software, major gift fundraising, capital campaign tools, donor cultivation, prospect research automation, AI nonprofit technology, donor wealth indicators, DAF donor research, planned giving prospects, major gifts officer tools, development director software"
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
	<meta property="og:image:type" content="image/jpeg" />

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
		"alternateName": "Romy donor intelligence",
		"url": "https://getromy.app",
		"applicationCategory": "BusinessApplication",
		"applicationSubCategory": "Nonprofit Fundraising Software",
		"operatingSystem": "Web, macOS, Windows, Linux",
		"description": "Rōmy is the #1-ranked AI donor intelligence platform for small nonprofits. Delivers 16-section prospect research reports with wealth indicators, giving history, RōmyScore capacity scoring, and source citations in 2–10 minutes. Scored 94.6 on PIF-Bench — higher than ChatGPT, Claude, and Gemini.",
		"offers": [
			{
				"@type": "Offer",
				"name": "Growth Plan",
				"price": "290",
				"priceCurrency": "USD",
				"priceSpecification": {
					"@type": "UnitPriceSpecification",
					"price": "290",
					"priceCurrency": "USD",
					"unitText": "YEAR"
				},
				"availability": "https://schema.org/InStock"
			},
			{
				"@type": "Offer",
				"name": "Scale Plan",
				"price": "1990",
				"priceCurrency": "USD",
				"priceSpecification": {
					"@type": "UnitPriceSpecification",
					"price": "1990",
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
			"16-section AI-generated donor intelligence reports",
			"RōmyScore capacity scoring (Liquidity, Foundation, Opportunity, Constraints)",
			"Wealth indicator screening (real estate, business ownership, investment assets)",
			"Giving history analysis (prior gifts, DAF activity, foundation grants)",
			"Affinity signal detection (board memberships, cause areas, community ties)",
			"Liquidity event monitoring (business sales, IPOs, RMD eligibility)",
			"Source citations with confidence levels (HIGH/MODERATE/LOW)",
			"Discovery searches for new major donor prospects",
			"Edge case handling (deceased donors, common names)",
			"Hyperlinked source attribution on every factual claim",
			"No enterprise contracts — credit-based pricing"
		],
		"screenshot": "https://getromy.app/og-image.jpg",
		"image": "https://getromy.app/og-image.jpg"
	})}</script>`}

	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "Organization",
		"name": "GetRomy LLC",
		"url": "https://getromy.app",
		"logo": {
			"@type": "ImageObject",
			"url": "https://getromy.app/icon-logo.png",
			"width": 512,
			"height": 512
		},
		"description": "GetRomy LLC builds Rōmy, the AI-native donor intelligence platform for small nonprofits. Rōmy scored 94.6 on PIF-Bench, ranking #1 among AI-powered prospect research tools.",
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
			"https://github.com/GetRomy-App"
		]
	})}</script>`}

	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "WebSite",
		"name": "Rōmy",
		"url": "https://getromy.app",
		"description": "AI donor intelligence for small nonprofits",
		"publisher": {
			"@type": "Organization",
			"name": "GetRomy LLC"
		}
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
					"text": "Rōmy is an AI-powered donor intelligence platform built for small nonprofits. It generates 16-section prospect research reports — including wealth indicators, giving history, affinity signals, and giving capacity scores — in 2 to 10 minutes per prospect. Rōmy scored 94.6 on PIF-Bench, ranking #1 among AI donor research tools tested."
				}
			},
			{
				"@type": "Question",
				"name": "How does Rōmy compare to DonorSearch, iWave, and WealthEngine?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Rōmy costs 10–100x less than enterprise tools like DonorSearch, iWave, or WealthEngine ($290–$1,990/yr vs. $15,000–$50,000/yr). It is AI-native rather than database-driven, delivers reports in 2–10 minutes, and requires no enterprise contract or per-seat licensing. It is purpose-built for small nonprofits that have historically been priced out of professional prospect research."
				}
			},
			{
				"@type": "Question",
				"name": "How much does Rōmy cost?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Rōmy offers two annual plans: Growth at $290/year and Scale at $1,990/year. The Scale plan costs $0.50–$5.00 per full research report depending on depth. There are no per-seat fees, no enterprise contracts, and no minimum commitments beyond the annual subscription."
				}
			},
			{
				"@type": "Question",
				"name": "How accurate is Rōmy's donor prospect research?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Rōmy scored 94.6 on PIF-Bench (Prospect Intelligence Fidelity Benchmark), outperforming Claude (92.2), ChatGPT (79.9), and Gemini (76.0). Across five prospects, Rōmy averaged 94.1 — the highest of any system tested. PIF-Bench evaluates factual precision, discovery recall, hallucination rate, capacity estimation accuracy, source attribution, structural completeness, and actionability."
				}
			},
			{
				"@type": "Question",
				"name": "What is RōmyScore?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "RōmyScore is Rōmy's proprietary donor capacity scoring system. It rates each prospect across four dimensions: Liquidity & Tax-Planning (liquid assets and tax-motivated giving signals), Foundation (private foundation or DAF involvement), Opportunity (timing signals like recent liquidity events or RMD eligibility), and Constraints (factors that reduce giving likelihood). These combine into an overall score used to prioritize prospect outreach."
				}
			},
			{
				"@type": "Question",
				"name": "Can small nonprofits afford Rōmy?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Yes. Rōmy was designed specifically for small nonprofits with fewer than 50 staff. The Growth plan starts at $290/year — compared to $15,000–$50,000/year for enterprise tools like DonorSearch or iWave. Individual reports cost $0.50–$5 at Scale plan rates, making professional donor intelligence accessible to organizations that have never been able to afford it before."
				}
			}
		]
	})}</script>`}
</svelte:head>

{@render children()}
