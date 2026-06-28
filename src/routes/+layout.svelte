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

	const title = 'Rōmy — AI Donor Research & Prospect Intelligence for Small Nonprofits';
	const description =
		'Rōmy is the AI-powered donor intelligence platform built for small nonprofits. Find major gift prospects, screen wealth indicators, and surface giving history — without enterprise pricing or per-seat contracts.';
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
		content="donor intelligence platform, AI prospect research nonprofits, small nonprofit fundraising software, major donor prospecting tool, wealth screening nonprofits, giving history analysis, nonprofit prospect research, donor discovery AI, fundraising intelligence software, nonprofit major gifts, donor wealth indicators, philanthropy data platform, affordable prospect research, nonprofit donor database, AI nonprofit tools, major gift fundraising, donor cultivation software, nonprofit development software, fundraising CRM alternative, prospect research automation"
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

	<!-- Structured Data (JSON-LD) -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: 'Rōmy',
		url: 'https://getromy.app',
		description: 'AI-powered donor intelligence platform for small nonprofits',
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
		alternateName: ['Romy', 'GetRomy', 'Rōmy Donor Intelligence'],
		url: 'https://getromy.app',
		applicationCategory: 'BusinessApplication',
		applicationSubCategory: 'Fundraising Software',
		operatingSystem: 'macOS, Windows, Linux, Web',
		description:
			'Rōmy is an AI-powered donor intelligence platform for small nonprofits. It surfaces major gift prospects using wealth indicators, giving history, and affinity signals — at a price built for small teams, not enterprise budgets.',
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD',
			availability: 'https://schema.org/InStock',
			description: 'Free to get started — no enterprise contracts or per-seat fees'
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
			'Actionable donor profiles',
			'No enterprise contracts required',
			'No per-seat licensing',
			'Purpose-built for small nonprofits',
			'Major gift prospecting',
			'Donor capacity scoring'
		],
		screenshot: 'https://getromy.app/screenshot.webp',
		image: 'https://getromy.app/og-image.jpg'
	})}</script>`}

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
		image: 'https://getromy.app/og-image.jpg',
		description: 'GetRomy LLC builds Rōmy, an AI-powered donor intelligence platform purpose-built for small nonprofits to find, qualify, and cultivate major gift prospects.',
		foundingDate: '2024',
		contactPoint: [
			{
				'@type': 'ContactPoint',
				email: 'solomon@getromy.app',
				contactType: 'customer support'
			},
			{
				'@type': 'ContactPoint',
				email: 'solomon@getromy.app',
				contactType: 'sales'
			}
		],
		sameAs: [
			'https://x.com/RomyFindsMoney',
			'https://github.com/GetRomy-App'
		]
	})}</script>`}

	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: [
			{
				'@type': 'Question',
				name: 'What is Rōmy?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Rōmy is an AI-powered donor intelligence platform built for small nonprofits. It uses prospect research, wealth indicators, and giving history to help fundraisers find and qualify major gift donors — at a fraction of the cost of enterprise tools.'
				}
			},
			{
				'@type': 'Question',
				name: 'How does Rōmy help small nonprofits find major donors?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Rōmy surfaces wealth indicators, philanthropic giving history, and affinity signals for each prospect, then delivers an actionable donor profile with connection points, estimated giving capacity, and suggested outreach angles. It automates what would otherwise take 45 minutes of manual research per prospect.'
				}
			},
			{
				'@type': 'Question',
				name: 'What makes Rōmy different from enterprise prospect research tools?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Enterprise prospect research tools like DonorSearch and iWave are priced for large institutions with dedicated research staff. Rōmy is purpose-built for small nonprofit teams — no enterprise contracts, no per-seat licensing, and no research analyst required. Every report is designed to be immediately actionable by a frontline fundraiser.'
				}
			},
			{
				'@type': 'Question',
				name: 'What is prospect research for nonprofits?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Prospect research is the process of evaluating potential donors to estimate their capacity to give and their likelihood to support your mission. It typically involves researching wealth indicators (real estate, stock holdings, business interests), philanthropic history (prior charitable gifts), and affinity signals (board memberships, alumni connections, community ties). Rōmy automates this process using AI.'
				}
			},
			{
				'@type': 'Question',
				name: 'How much does Rōmy cost?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Rōmy is free to get started. Unlike enterprise donor intelligence platforms that charge thousands per year in licensing fees, Rōmy is built around a pricing model that works for small nonprofit budgets. Visit getromy.app to get started.'
				}
			},
			{
				'@type': 'Question',
				name: 'What are wealth indicators in fundraising?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Wealth indicators are data signals that suggest a person has the financial capacity to make a major gift to a nonprofit. Common indicators include real estate ownership, business ownership or executive roles, stock holdings, prior major gifts to other organizations, and board service at peer institutions. Rōmy screens for these automatically as part of each donor profile.'
				}
			}
		]
	})}</script>`}
</svelte:head>

{@render children()}

<ContactModal />
