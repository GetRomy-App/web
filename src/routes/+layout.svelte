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

	const title = 'Rōmy — Donor Intelligence for Small Nonprofits';
	const description =
		'Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions. AI-powered prospect research, wealth indicators, and giving history — built for small teams at a price they can actually afford.';
	const url = 'https://getromy.app/';
	const ogImage = 'https://getromy.app/og-image.png';
</script>

<svelte:head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />

	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={description} />
	<meta
		name="keywords"
		content="nonprofit donor intelligence, AI prospect research, major donor prospecting, fundraising software for nonprofits, wealth screening tool, giving history analysis, nonprofit fundraising AI, donor discovery platform, small nonprofit fundraising, prospect research software, donor wealth indicators, philanthropy intelligence, nonprofit CRM alternative, affordable fundraising tools, donor affinity signals, major gift fundraising, capital campaign donor research, annual fund prospecting, planned giving research, board member prospect research"
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
	<meta property="og:image:alt" content="Rōmy — Donor Intelligence for Small Nonprofits" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@RomyFindsMoney" />
	<meta name="twitter:creator" content="@RomyFindsMoney" />
	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />

	<!-- RSS Feed -->
	<link rel="alternate" type="application/rss+xml" title="Rōmy Blog" href="https://getromy.app/feed.xml" />

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

	<link rel="canonical" href={url} />

	<!-- Structured Data: SoftwareApplication -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: 'Rōmy',
		url: 'https://getromy.app',
		applicationCategory: 'BusinessApplication',
		applicationSubCategory: 'FundraisingApplication',
		operatingSystem: 'Web, macOS, Windows',
		description:
			'Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions. AI-powered prospect research with wealth indicators, giving history, and affinity signals.',
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD',
			availability: 'https://schema.org/InStock',
			description: 'Free trial available — no credit card required'
		},
		publisher: {
			'@type': 'Organization',
			name: 'GetRomy LLC',
			url: 'https://getromy.app'
		},
		featureList: [
			'AI-powered donor prospect research',
			'Wealth indicator screening',
			'Giving history analysis',
			'Affinity signal detection',
			'16-section actionable donor profiles',
			'No enterprise contracts required',
			'Major gift fundraising intelligence',
			'Capital campaign prospect research'
		],
		screenshot: 'https://getromy.app/og-image.png'
	})}</script>`}

	<!-- Structured Data: Organization -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Organization',
		'@id': 'https://getromy.app/#organization',
		name: 'GetRomy LLC',
		legalName: 'GetRomy LLC',
		url: 'https://getromy.app',
		logo: {
			'@type': 'ImageObject',
			url: 'https://getromy.app/icon-logo.png',
			width: 512,
			height: 512
		},
		description: 'Donor intelligence platform for small nonprofits. AI-powered prospect research at a fraction of enterprise cost.',
		address: {
			'@type': 'PostalAddress',
			addressLocality: 'Kerrville',
			addressRegion: 'TX',
			addressCountry: 'US'
		},
		contactPoint: {
			'@type': 'ContactPoint',
			email: 'solomon@getromy.app',
			contactType: 'sales',
			availableLanguage: 'English'
		},
		sameAs: ['https://x.com/RomyFindsMoney', 'https://github.com/GetRomy-App'],
		knowsAbout: [
			'Nonprofit fundraising',
			'Donor prospect research',
			'Wealth screening',
			'Major gift fundraising',
			'Artificial intelligence for nonprofits',
			'Philanthropy intelligence'
		]
	})}</script>`}

	<!-- Structured Data: WebSite (enables Sitelinks Search Box) -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'@id': 'https://getromy.app/#website',
		name: 'Rōmy',
		url: 'https://getromy.app',
		description: 'Donor intelligence for small nonprofits',
		publisher: {
			'@id': 'https://getromy.app/#organization'
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

	<!-- Structured Data: FAQ -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: [
			{
				'@type': 'Question',
				name: 'What is Rōmy?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Rōmy is an AI-powered donor intelligence platform built specifically for small nonprofits. It helps fundraisers find new major donors by analyzing wealth indicators, giving history, and affinity signals — producing 16-section actionable donor profiles at a fraction of the cost of enterprise wealth screening tools.'
				}
			},
			{
				'@type': 'Question',
				name: 'How does Rōmy find major donors?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Rōmy uses purpose-built AI to research prospects across public databases, giving records, board affiliations, and wealth signals. It synthesizes this into an actionable donor profile with connection points, giving capacity estimates, and outreach angles — in 2 to 10 minutes per prospect.'
				}
			},
			{
				'@type': 'Question',
				name: 'How much does Rōmy cost?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Rōmy starts at $290/year for the Growth plan, which covers teams researching dozens of prospects per month. The Scale plan is $1,990/year for teams researching ~200 prospects monthly. Both plans are a fraction of enterprise wealth screening tools that typically cost $15,000–$50,000 per year.'
				}
			},
			{
				'@type': 'Question',
				name: 'How does Rōmy compare to enterprise wealth screening tools?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'On PIF-Bench — an open benchmark for AI donor research — Rōmy scored 94.6 compared to ChatGPT (79.9), Claude (92.2), and Gemini (76.0). Rōmy also produces deeper reports (16 sections vs. 5–8 from enterprise tools), costs 90% less, and takes 2–10 minutes vs. 15+ minutes for manual research.'
				}
			},
			{
				'@type': 'Question',
				name: 'Is Rōmy suitable for small nonprofits?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Yes — Rōmy was purpose-built for small nonprofit teams. It requires no enterprise contracts, no per-seat licensing, and no IT team to set up. A development officer can start researching prospects the same day they sign up.'
				}
			}
		]
	})}</script>`}
</svelte:head>

{@render children()}

<ContactModal />
