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
	import Seo from '$lib/components/Seo.svelte';
	import { CORE_KEYWORDS, softwareSchema, SITE_URL, WEBSITE_ID, ORG_ID, SOFTWARE_ID } from '$lib/seo';

	const homeSchema = [
		softwareSchema(),
		{
			'@context': 'https://schema.org',
			'@type': 'WebPage',
			'@id': `${SITE_URL}/#webpage`,
			url: `${SITE_URL}/`,
			name: 'Rōmy — AI Donor Prospect Research for Small Nonprofits',
			description:
				'Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions.',
			isPartOf: { '@id': WEBSITE_ID },
			about: { '@id': SOFTWARE_ID },
			publisher: { '@id': ORG_ID },
			primaryImageOfPage: `${SITE_URL}/og-romy.jpg`,
			inLanguage: 'en-US'
		}
	];

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
	ogTitle="Rōmy — Donor Intelligence for Small Nonprofits"
	description="Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions. AI-powered prospect research, wealth screening, and giving history, at a price built for small teams."
	path="/"
	keywords={CORE_KEYWORDS}
	schema={homeSchema}
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
