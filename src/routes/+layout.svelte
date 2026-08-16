<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import Lenis from 'lenis';
	import { page } from '$app/state';
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

	const SITE = 'https://getromy.app';
	const DEFAULT_TITLE = 'Rōmy — Donor Intelligence for Small Nonprofits';
	const DEFAULT_DESCRIPTION =
		'Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions. AI-powered prospect research, wealth indicators, and giving history — at a price built for small teams.';
	const DEFAULT_KEYWORDS =
		'nonprofit donor intelligence, fundraising software, prospect research tool, donor discovery platform, wealth screening, giving history, AI donor research, nonprofit fundraising, major donor prospecting, small nonprofit tools, donor management, philanthropy intelligence, fundraising CRM, nonprofit technology, donor wealth indicators';
	const DEFAULT_ROBOTS =
		'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

	// Legal-document routes all render through LegalPage.svelte, which loads { page } from $lib/legal.
	const LEGAL_DOC_ROUTES = new Set([
		'/aup',
		'/cookies',
		'/dpa',
		'/security',
		'/subprocessors',
		'/terms',
		'/privacy',
		'/privacy/prospects'
	]);

	interface Seo {
		title: string;
		description: string;
		keywords: string;
		url: string;
		type: 'website' | 'article';
		robots: string;
	}

	// Svelte's SSR head renderer only honors the first <svelte:head><title> it encounters in the
	// component tree — a nested page-level <title> is silently dropped. So this layout is the single
	// source of truth for title/description/canonical/OG/Twitter tags, derived per-route from
	// whatever each route's load function already returns (no per-page <svelte:head> duplicates them).
	let seo = $derived.by((): Seo => {
		const routeId = page.route.id;
		const data = page.data as Record<string, unknown>;
		const path = page.url.pathname;

		const post = data.post as
			{ title: string; excerpt: string; slug: string; keywords: string } | undefined;
		if (routeId === '/blog/[slug]' && post) {
			return {
				title: `${post.title} — Rōmy Blog`,
				description: post.excerpt,
				keywords: post.keywords,
				url: `${SITE}/blog/${post.slug}`,
				type: 'article',
				robots: DEFAULT_ROBOTS
			};
		}
		if (routeId === '/labs/blog/[slug]' && post) {
			return {
				title: `${post.title} — Rōmy Labs`,
				description: post.excerpt,
				keywords: post.keywords,
				url: `${SITE}/labs/blog/${post.slug}`,
				type: 'article',
				robots: DEFAULT_ROBOTS
			};
		}
		if (routeId === '/blog') {
			return {
				title: 'Rōmy Blog — Insights on AI Donor Research & Nonprofit Fundraising',
				description:
					'Technical deep-dives, research findings, and perspectives on nonprofit fundraising, prospect research, and purpose-built AI.',
				keywords:
					'nonprofit fundraising blog, donor intelligence, prospect research, AI for nonprofits, fundraising insights, major donor prospecting, wealth screening, donor relationships, Rōmy',
				url: `${SITE}/blog`,
				type: 'website',
				robots: DEFAULT_ROBOTS
			};
		}
		if (routeId === '/labs') {
			return {
				title: 'Rōmy Labs — AI Donor Research Benchmarks, PIF-Bench Results & Blog',
				description:
					'Rōmy scored 94.1 on PIF-Bench vs. ChatGPT (76.9), Claude (92.3), and Gemini (79.1). See how purpose-built AI donor intelligence compares on accuracy, cost, and speed.',
				keywords:
					'donor research benchmark, AI prospect research comparison, nonprofit fundraising AI, wealth screening accuracy, PIF-Bench, donor intelligence cost comparison, ChatGPT vs Rōmy, prospect research tool, Rōmy',
				url: `${SITE}/labs`,
				type: 'website',
				robots: DEFAULT_ROBOTS
			};
		}
		if (routeId === '/legal') {
			return {
				title: 'Legal — Rōmy',
				description:
					'Privacy policy, terms, sub-processors, and other legal documents for Rōmy by GetRomy LLC.',
				keywords: DEFAULT_KEYWORDS,
				url: `${SITE}/legal`,
				type: 'website',
				robots: 'index, follow'
			};
		}
		if (routeId === '/status') {
			return {
				title: 'Status — Rōmy',
				description:
					'Live operational status and uptime history for Rōmy — the donor-intelligence app at intel.getromy.app and getromy.app.',
				keywords: DEFAULT_KEYWORDS,
				url: `${SITE}/status`,
				type: 'website',
				robots: 'index, follow'
			};
		}
		if (routeId === '/privacy/request') {
			return {
				title: 'Privacy rights request — Rōmy',
				description:
					'Submit a request to access, erase, correct, or object to processing of your personal data held by Rōmy (GetRomy LLC).',
				keywords: DEFAULT_KEYWORDS,
				url: `${SITE}/privacy/request`,
				type: 'website',
				robots: 'index, follow'
			};
		}
		const legalPage = data.page as { title: string; description?: string } | undefined;
		if (routeId && LEGAL_DOC_ROUTES.has(routeId) && legalPage) {
			return {
				title: `${legalPage.title} — Rōmy`,
				description: legalPage.description || DEFAULT_DESCRIPTION,
				keywords: DEFAULT_KEYWORDS,
				url: `${SITE}${path}`,
				type: 'website',
				robots: 'index, follow'
			};
		}

		return {
			title: DEFAULT_TITLE,
			description: DEFAULT_DESCRIPTION,
			keywords: DEFAULT_KEYWORDS,
			url: path === '/' ? `${SITE}/` : `${SITE}${path}`,
			type: 'website',
			robots: DEFAULT_ROBOTS
		};
	});
</script>

<svelte:head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />

	<title>{seo.title}</title>
	<meta name="title" content={seo.title} />
	<meta name="description" content={seo.description} />
	<meta name="keywords" content={seo.keywords} />
	<meta name="author" content="GetRomy LLC" />
	<meta name="robots" content={seo.robots} />
	<meta name="theme-color" content="#0d0d0e" media="(prefers-color-scheme: dark)" />
	<meta name="theme-color" content="#fcfcfc" media="(prefers-color-scheme: light)" />

	<!-- Open Graph -->
	<meta property="og:type" content={seo.type} />
	<meta property="og:url" content={seo.url} />
	<meta property="og:title" content={seo.title} />
	<meta property="og:description" content={seo.description} />
	<meta property="og:site_name" content="Rōmy" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:image" content="https://getromy.app/og-image.jpg" />
	<meta property="og:image:width" content="1920" />
	<meta property="og:image:height" content="1080" />
	<meta property="og:image:alt" content="Rōmy — Donor Intelligence for Small Nonprofits" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@RomyFindsMoney" />
	<meta name="twitter:creator" content="@RomyFindsMoney" />
	<meta name="twitter:url" content={seo.url} />
	<meta name="twitter:title" content={seo.title} />
	<meta name="twitter:description" content={seo.description} />
	<meta name="twitter:image" content="https://getromy.app/og-image.jpg" />

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

	<link rel="canonical" href={seo.url} />

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
