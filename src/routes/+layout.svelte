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
</script>

<svelte:head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />

	<!--
		Site-wide defaults only. Title, description, canonical, and per-page
		Open Graph/Twitter tags (og:title, og:description, og:url, og:type,
		twitter:title, twitter:description, twitter:url) are intentionally
		NOT set here — each route defines its own in its <svelte:head>.
		A <title> element is unique per document, so an unconditional one
		here would win over every page's own title (browsers and crawlers
		use the first <title> in the document); the same duplication problem
		applies to rel="canonical", which Google ignores entirely when more
		than one appears on a page. Keeping only truly global, non-conflicting
		tags here — and letting the home page set its own copies of the rest
		— keeps every route's title/description/canonical accurate for SEO.
	-->
	<meta
		name="keywords"
		content="nonprofit donor intelligence, fundraising software, prospect research tool, donor discovery platform, wealth screening, giving history, AI donor research, nonprofit fundraising, major donor prospecting, small nonprofit tools, donor management, philanthropy intelligence, fundraising CRM, nonprofit technology, donor wealth indicators"
	/>
	<meta name="author" content="GetRomy LLC" />
	<meta
		name="robots"
		content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
	/>
	<meta name="theme-color" content="#0d0d0e" media="(prefers-color-scheme: dark)" />
	<meta name="theme-color" content="#fcfcfc" media="(prefers-color-scheme: light)" />

	<!-- Open Graph / Twitter: values constant across every route -->
	<meta property="og:site_name" content="Rōmy" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:image" content="https://getromy.app/og-image.jpg" />
	<meta property="og:image:width" content="1920" />
	<meta property="og:image:height" content="1080" />
	<meta property="og:image:alt" content="Rōmy — Donor Intelligence for Small Nonprofits" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content="https://getromy.app/og-image.jpg" />
	<meta name="twitter:site" content="@RomyFindsMoney" />
	<meta name="twitter:creator" content="@RomyFindsMoney" />

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

	<!-- Structured Data (JSON-LD) -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: 'Rōmy',
		url: 'https://getromy.app',
		applicationCategory: 'BusinessApplication',
		operatingSystem: 'macOS, Windows, Linux',
		description:
			'Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions. AI-powered prospect research with wealth indicators, giving history, and affinity signals.',
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD',
			availability: 'https://schema.org/InStock'
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
			'No enterprise contracts required'
		]
	})}</script>`}

	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: 'GetRomy LLC',
		url: 'https://getromy.app',
		logo: 'https://getromy.app/icon-logo.png',
		description: 'Donor intelligence platform for small nonprofits',
		contactPoint: {
			'@type': 'ContactPoint',
			email: 'solomon@getromy.app',
			contactType: 'sales'
		},
		sameAs: ['https://x.com/RomyFindsMoney', 'https://github.com/GetRomy-App']
	})}</script>`}
</svelte:head>

{@render children()}

<ContactModal />
