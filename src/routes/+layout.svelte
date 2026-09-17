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

	interface PostSeo {
		slug: string;
		title: string;
		excerpt: string;
		date: string;
		tag: string;
		has_benchmarks?: boolean;
	}

	// A per-route <svelte:head> declared directly in a +page.svelte loses the title/OG fight
	// against this layout's <svelte:head> — Svelte's SSR head rendering doesn't reliably let a
	// nested <svelte:head> win, so every non-homepage route ended up shipping this file's title
	// in production. Centralizing per-route metadata here, keyed off $app/state's `page`, means
	// there's only ever one <svelte:head> writing the title, and it's always right.
	const STATIC_SEO: Record<string, { title: string; description: string; keywords?: string }> = {
		'/blog': {
			title: 'Rōmy Blog — Insights on AI Donor Research & Nonprofit Fundraising',
			description:
				'Technical deep-dives, research findings, and perspectives on nonprofit fundraising, prospect research, and purpose-built AI.',
			keywords:
				'nonprofit fundraising blog, donor intelligence, prospect research, AI for nonprofits, fundraising insights'
		},
		'/labs': {
			title: 'Rōmy Labs — AI Donor Research Benchmarks, PIF-Bench Results & Blog',
			description:
				'Rōmy scored 94.6 on PIF-Bench vs. ChatGPT (79.9), Claude (92.2), and Gemini (76.0). See how purpose-built AI donor intelligence compares on accuracy, cost, and speed.',
			keywords:
				'donor research benchmark, AI prospect research comparison, nonprofit fundraising AI, wealth screening accuracy, PIF-Bench, donor intelligence cost comparison, ChatGPT vs Rōmy, prospect research tool'
		},
		'/status': {
			title: 'Status — Rōmy',
			description:
				'Live operational status and uptime history for Rōmy — the donor-intelligence app at intel.getromy.app and getromy.app.'
		},
		'/legal': {
			title: 'Legal — Rōmy',
			description:
				'Privacy policy, terms, sub-processors, and other legal documents for Rōmy by GetRomy LLC.'
		},
		'/privacy/request': {
			title: 'Privacy rights request — Rōmy',
			description:
				'Submit a request to access, erase, correct, or object to processing of your personal data held by Rōmy (GetRomy LLC).'
		}
	};

	function postJsonLd(post: PostSeo, path: string, sectionLabel: string, sectionPath: string) {
		return [
			{
				'@context': 'https://schema.org',
				'@type': post.has_benchmarks ? 'Article' : 'BlogPosting',
				headline: post.title,
				description: post.excerpt,
				datePublished: post.date,
				dateModified: post.date,
				articleSection: post.tag,
				keywords: `donor intelligence, nonprofit fundraising, prospect research, AI donor research, wealth screening, ${post.tag.toLowerCase()}`,
				image: `${SITE}/og-image.jpg`,
				mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}${path}` },
				author: { '@type': 'Organization', name: 'Rōmy', url: SITE },
				publisher: {
					'@type': 'Organization',
					name: 'GetRomy LLC',
					logo: { '@type': 'ImageObject', url: `${SITE}/icon-logo.png` }
				}
			},
			{
				'@context': 'https://schema.org',
				'@type': 'BreadcrumbList',
				itemListElement: [
					{ '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
					{ '@type': 'ListItem', position: 2, name: sectionLabel, item: `${SITE}${sectionPath}` },
					{ '@type': 'ListItem', position: 3, name: post.title, item: `${SITE}${path}` }
				]
			}
		];
	}

	let post = $derived(page.data?.post as PostSeo | undefined);

	let seo = $derived.by(() => {
		if (post) {
			const isLabs = post.has_benchmarks;
			const path = isLabs ? `/labs/blog/${post.slug}` : `/blog/${post.slug}`;
			return {
				title: `${post.title} — Rōmy ${isLabs ? 'Labs' : 'Blog'}`,
				description: post.excerpt,
				keywords: `donor intelligence, nonprofit fundraising, prospect research, AI donor research, wealth screening, ${post.tag.toLowerCase()}`,
				path,
				ogType: 'article' as const,
				articlePublishedTime: post.date,
				articleSection: post.tag,
				jsonLd: postJsonLd(post, path, isLabs ? 'Labs' : 'Blog', isLabs ? '/labs' : '/blog')
			};
		}

		const staticEntry = STATIC_SEO[page.route.id ?? ''];
		return {
			title: staticEntry?.title ?? DEFAULT_TITLE,
			description: staticEntry?.description ?? DEFAULT_DESCRIPTION,
			keywords: staticEntry?.keywords ?? DEFAULT_KEYWORDS,
			path: staticEntry ? page.url.pathname : '/',
			ogType: 'website' as const,
			articlePublishedTime: '',
			articleSection: '',
			jsonLd: [] as Record<string, unknown>[]
		};
	});

	let url = $derived(`${SITE}${seo.path}`);
</script>

<svelte:head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />

	<title>{seo.title}</title>
	<meta name="title" content={seo.title} />
	<meta name="description" content={seo.description} />
	<meta name="keywords" content={seo.keywords} />
	<meta name="author" content="GetRomy LLC" />
	<meta
		name="robots"
		content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
	/>
	<meta name="theme-color" content="#0d0d0e" media="(prefers-color-scheme: dark)" />
	<meta name="theme-color" content="#fcfcfc" media="(prefers-color-scheme: light)" />

	<!-- Open Graph -->
	<meta property="og:type" content={seo.ogType} />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={seo.title} />
	<meta property="og:description" content={seo.description} />
	<meta property="og:site_name" content="Rōmy" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:image" content="https://getromy.app/og-image.jpg" />
	<meta property="og:image:width" content="1920" />
	<meta property="og:image:height" content="1080" />
	<meta property="og:image:alt" content="Rōmy — donor intelligence for small nonprofits" />
	{#if seo.articlePublishedTime}
		<meta property="article:published_time" content={seo.articlePublishedTime} />
	{/if}
	{#if seo.articleSection}
		<meta property="article:section" content={seo.articleSection} />
	{/if}

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@RomyFindsMoney" />
	<meta name="twitter:creator" content="@RomyFindsMoney" />
	<meta name="twitter:url" content={url} />
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

	<link rel="canonical" href={url} />

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

	{#each seo.jsonLd as schema}
		{@html `<script type="application/ld+json">${JSON.stringify(schema)}</script>`}
	{/each}
</svelte:head>

{@render children()}

<ContactModal />
