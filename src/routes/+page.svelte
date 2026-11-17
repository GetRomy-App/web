<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { gsap, ScrollTrigger } from '$lib/gsap';

	import Navbar from '$lib/components/landing/Navbar.svelte';
	import Hero from '$lib/components/landing/Hero.svelte';
	import Story from '$lib/components/landing/Story.svelte';
	import Features from '$lib/components/landing/Features.svelte';
	import CTA from '$lib/components/landing/CTA.svelte';
	import Footer from '$lib/components/landing/Footer.svelte';
	import Seo from '$lib/components/seo/Seo.svelte';
	import { SITE_URL, ORG_ID, WEBSITE_ID } from '$lib/seo';

	const description =
		'Rōmy is AI donor prospect research for small nonprofits: wealth indicators, giving history and affinity signals to find new major donors, at a fraction of the cost.';

	const softwareLd = {
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		'@id': `${SITE_URL}/#software`,
		name: 'Rōmy',
		url: `${SITE_URL}/`,
		applicationCategory: 'BusinessApplication',
		applicationSubCategory: 'Donor prospect research software',
		operatingSystem: 'macOS, Windows, Linux',
		description:
			'Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions. AI-powered prospect research with wealth indicators, giving history, and affinity signals.',
		image: `${SITE_URL}/screenshot.png`,
		screenshot: `${SITE_URL}/screenshot.png`,
		audience: {
			'@type': 'Audience',
			audienceType: 'Small nonprofits, development directors, and fundraising teams'
		},
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD',
			availability: 'https://schema.org/InStock'
		},
		publisher: { '@id': ORG_ID },
		isPartOf: { '@id': WEBSITE_ID },
		featureList: [
			'AI-powered donor prospect research',
			'Wealth indicator screening',
			'Giving history analysis',
			'Affinity signal detection',
			'Actionable donor profiles',
			'No enterprise contracts required'
		]
	};

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

<Seo
	title="Rōmy — AI Donor Prospect Research for Small Nonprofits"
	socialTitle="Rōmy — Donor Intelligence for Small Nonprofits"
	{description}
	path="/"
	keywords={[
		'donor prospect research',
		'AI prospect research',
		'donor intelligence',
		'wealth screening',
		'wealth screening for small nonprofits',
		'major donor prospecting',
		'find major donors',
		'donor research software',
		'prospect research tool',
		'nonprofit fundraising software',
		'giving history',
		'donor wealth indicators',
		'AI for nonprofits'
	]}
	jsonLd={[softwareLd]}
/>

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
