<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { gsap, ScrollTrigger } from '$lib/gsap';
	import { jsonLd, SITE_URL, OG_IMAGE, OG_IMAGE_ALT } from '$lib/seo';

	import Navbar from '$lib/components/landing/Navbar.svelte';
	import Hero from '$lib/components/landing/Hero.svelte';
	import Story from '$lib/components/landing/Story.svelte';
	import Features from '$lib/components/landing/Features.svelte';
	import CTA from '$lib/components/landing/CTA.svelte';
	import Footer from '$lib/components/landing/Footer.svelte';

	const title = 'Rōmy — Donor Intelligence & Prospect Research for Small Nonprofits';
	const description =
		'Rōmy is donor intelligence software that helps small nonprofits find major donors. AI prospect research, wealth indicators and giving history at a small-team price.';

	let mainContent: HTMLElement;
	let footerText: HTMLElement;

	onMount(() => {
		gsap.to(mainContent, {
			scale: 0.95,
			borderRadius: '24px',
			scrollTrigger: {
				trigger: mainContent,
				start: 'bottom bottom',
				end: 'bottom 70%',
				scrub: true
			}
		});

		gsap.fromTo(
			footerText,
			{ opacity: 0, y: 20 },
			{
				opacity: 1,
				y: 0,
				scrollTrigger: {
					trigger: mainContent,
					start: 'bottom 90%',
					end: 'bottom 70%',
					scrub: true
				}
			}
		);
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={description} />
	<meta
		name="keywords"
		content="donor intelligence, nonprofit prospect research, major donor prospecting, donor wealth screening, wealth screening for nonprofits, AI donor research, affordable donor research tool, fundraising software for small nonprofits, donor discovery, giving history, nonprofit fundraising"
	/>
	<link rel="canonical" href="{SITE_URL}/" />

	<meta property="og:type" content="website" />
	<meta property="og:url" content="{SITE_URL}/" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={OG_IMAGE} />
	<meta property="og:image:width" content="1920" />
	<meta property="og:image:height" content="1080" />
	<meta property="og:image:alt" content={OG_IMAGE_ALT} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content="{SITE_URL}/" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={OG_IMAGE} />
	<meta name="twitter:image:alt" content={OG_IMAGE_ALT} />

	{@html jsonLd({
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		'@id': `${SITE_URL}/#software`,
		name: 'Rōmy',
		url: SITE_URL,
		image: OG_IMAGE,
		applicationCategory: 'BusinessApplication',
		applicationSubCategory: 'Nonprofit donor intelligence and prospect research',
		operatingSystem: 'macOS, Windows, Linux',
		description:
			'Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions. AI-powered prospect research with wealth indicators, giving history, and affinity signals.',
		audience: { '@type': 'Audience', audienceType: 'Small nonprofit fundraising teams' },
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD',
			availability: 'https://schema.org/InStock'
		},
		publisher: { '@id': `${SITE_URL}/#organization` },
		featureList: [
			'AI-powered donor prospect research',
			'Wealth indicator screening',
			'Giving history analysis',
			'Affinity signal detection',
			'Actionable donor profiles',
			'No enterprise contracts required'
		]
	})}
</svelte:head>

<Footer bind:footerText />

<Navbar />

<div bind:this={mainContent} class="main-content px-4 md:px-8 overflow-hidden">
	<div
		class="border-gray-alpha-100 divide-gray-alpha-100 flex min-h-screen flex-col items-center divide-y border-x"
	>
		<Hero />
		<Features />
		<Story />
		<CTA />
	</div>
</div>

<style>
	.main-content {
		position: relative;
		z-index: 1;
		background: var(--background);
		margin-bottom: 280px;
		transform-origin: center bottom;
	}
</style>
