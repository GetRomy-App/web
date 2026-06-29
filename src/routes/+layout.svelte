<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import Lenis from 'lenis';
	import { gsap, ScrollTrigger, registerGsap } from '$lib/gsap';
	import ContactModal from '$lib/components/ui/ContactModal.svelte';
	import { contactModal } from '$lib/stores/contact.svelte';

	let { children } = $props();

	registerGsap();

	let lenis = $state<Lenis>();

	onMount(() => {
		const instance = new Lenis();
		lenis = instance;

		instance.on('scroll', ScrollTrigger.update);

		gsap.ticker.add((time: number) => {
			instance.raf(time * 1000);
		});

		gsap.ticker.lagSmoothing(0);

		return () => {
			instance.destroy();
			lenis = undefined;
		};
	});

	// Freeze background scrolling while the contact dialog is open.
	$effect(() => {
		if (!lenis) return;
		if (contactModal.open) lenis.stop();
		else lenis.start();
	});

	const title = 'Rōmy — AI Donor Intelligence for Small Nonprofits';
	const description =
		'Rōmy is the AI-powered donor intelligence platform built for small nonprofits. Find qualified major donor prospects in minutes — not hours. Wealth screening, giving history, and affinity signals at $290/yr, a fraction of enterprise alternatives.';
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
		content="AI donor intelligence, nonprofit prospect research software, wealth screening for nonprofits, major donor prospecting tool, affordable prospect research, small nonprofit fundraising software, donor discovery platform, giving history analysis, affinity signal detection, nonprofit fundraising AI, prospect research automation, donor wealth screening, major gift fundraising tool, nonprofit technology, PIF-Bench, donor intelligence platform, fundraising prospect research, AI philanthropic research"
	/>
	<meta name="author" content="GetRomy LLC" />
	<meta
		name="robots"
		content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
	/>
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
	<link
		rel="preload"
		href="/fonts/Archivo-VariableFont_wdth,wght.woff2"
		as="font"
		type="font/woff2"
		crossorigin
	/>
	<link rel="dns-prefetch" href="//api.github.com" />
	<link rel="preconnect" href="//api.github.com" crossorigin />

	<!-- Favicons -->
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
	<link rel="shortcut icon" href="/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<link rel="manifest" href="/site.webmanifest" />
	<link rel="sitemap" type="application/xml" href="/sitemap.xml" />

	<link rel="canonical" href={url} />

	<!-- Structured Data (JSON-LD) -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: 'Rōmy',
		url: 'https://getromy.app',
		description: 'AI-powered donor intelligence platform for small nonprofits',
		publisher: {
			'@type': 'Organization',
			name: 'GetRomy LLC'
		},
		potentialAction: {
			'@type': 'SearchAction',
			target: {
				'@type': 'EntryPoint',
				urlTemplate: 'https://getromy.app/blog?q={search_term_string}'
			},
			'query-input': 'required name=search_term_string'
		}
	})}</script>`}

	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: 'Rōmy',
		alternateName: ['Romy', 'GetRomy'],
		url: 'https://getromy.app',
		applicationCategory: 'BusinessApplication',
		applicationSubCategory: 'Nonprofit Fundraising Software',
		operatingSystem: 'Web browser (macOS, Windows, Linux, iOS, Android)',
		description:
			'Rōmy is the only AI-powered donor intelligence platform built specifically for small nonprofits. It delivers wealth screening, giving history analysis, and affinity signal detection in minutes per prospect — at $290/yr, versus $15,000–$50,000/yr for enterprise alternatives. Scored 94.6 on PIF-Bench, outperforming ChatGPT (79.9), Claude (92.2), and Gemini (76.0).',
		offers: [
			{
				'@type': 'Offer',
				name: 'Growth',
				price: '290',
				priceCurrency: 'USD',
				priceValidUntil: '2027-12-31',
				availability: 'https://schema.org/InStock',
				billingIncrement: 'P1Y'
			},
			{
				'@type': 'Offer',
				name: 'Scale',
				price: '1990',
				priceCurrency: 'USD',
				priceValidUntil: '2027-12-31',
				availability: 'https://schema.org/InStock',
				billingIncrement: 'P1Y'
			}
		],
		publisher: {
			'@type': 'Organization',
			name: 'GetRomy LLC',
			url: 'https://getromy.app'
		},
		featureList: [
			'AI-powered donor prospect research',
			'Wealth indicator and capacity screening',
			'Giving history and philanthropy analysis',
			'Affinity signal and interest detection',
			'16-section actionable donor profiles',
			'No enterprise contracts or long-term commitments',
			'2–10 minute turnaround per prospect report',
			'PIF-Bench score: 94.6 (highest among tested systems)'
		],
		screenshot: 'https://getromy.app/og-image.jpg',
		aggregateRating: {
			'@type': 'AggregateRating',
			ratingValue: '94.6',
			bestRating: '100',
			worstRating: '0',
			ratingCount: '1',
			reviewCount: '1',
			description: 'PIF-Bench composite accuracy score'
		}
	})}</script>`}

	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Organization',
		'@id': 'https://getromy.app/#organization',
		name: 'GetRomy LLC',
		alternateName: 'Rōmy',
		url: 'https://getromy.app',
		logo: {
			'@type': 'ImageObject',
			url: 'https://getromy.app/icon-logo.png',
			width: 512,
			height: 512
		},
		image: 'https://getromy.app/og-image.jpg',
		description:
			'GetRomy LLC builds AI-powered donor intelligence software for small nonprofits. Rōmy helps fundraisers identify, research, and prioritize major gift prospects using AI, wealth screening, and philanthropic data — at a price accessible to organizations of all sizes.',
		foundingDate: '2024',
		knowsAbout: [
			'Nonprofit fundraising',
			'Major donor prospecting',
			'Wealth screening',
			'Philanthropic research',
			'AI for nonprofits',
			'Donor intelligence',
			'Prospect research'
		],
		contactPoint: {
			'@type': 'ContactPoint',
			email: 'solomon@getromy.app',
			contactType: 'customer support',
			availableLanguage: 'English'
		},
		sameAs: [
			'https://x.com/RomyFindsMoney',
			'https://github.com/GetRomy-App'
		]
	})}</script>`}
</svelte:head>

{@render children()}

<ContactModal />
