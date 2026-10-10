<script lang="ts">
	import '../app.css';
	import Seo from '$lib/components/Seo.svelte';
	import { onMount } from 'svelte';
	import { gsap, ScrollTrigger } from '$lib/gsap';

	import Navbar from '$lib/components/landing/Navbar.svelte';
	import Hero from '$lib/components/landing/Hero.svelte';
	import Story from '$lib/components/landing/Story.svelte';
	import Features from '$lib/components/landing/Features.svelte';
	import CTA from '$lib/components/landing/CTA.svelte';
	import Footer from '$lib/components/landing/Footer.svelte';

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
	title="Rōmy — AI Donor Intelligence & Prospect Research for Small Nonprofits"
	description="Rōmy is donor intelligence software that helps small nonprofits find new major donors. AI-powered prospect research, wealth indicators, and giving history at a fraction of the cost of existing solutions."
	path="/"
	keywords="donor intelligence, nonprofit prospect research, major donor prospecting, wealth screening alternative, DonorSearch alternative, iWave alternative, AI donor research, fundraising software for small nonprofits, affordable prospect research, donor discovery, giving history, wealth indicators, nonprofit fundraising tools"
	jsonLd={[
		{
			'@context': 'https://schema.org',
			'@type': 'SoftwareApplication',
			'@id': 'https://getromy.app/#software',
			name: 'Rōmy',
			alternateName: 'Rōmy Donor Intelligence',
			url: 'https://getromy.app/',
			image: 'https://getromy.app/og-image.jpg',
			applicationCategory: 'BusinessApplication',
			applicationSubCategory: 'Donor prospect research software',
			operatingSystem: 'macOS, Windows, Linux',
			audience: { '@type': 'Audience', audienceType: 'Small nonprofit fundraising teams' },
			description:
				'Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions. AI-powered prospect research with wealth indicators, giving history, and affinity signals.',
			offers: {
				'@type': 'Offer',
				price: '0',
				priceCurrency: 'USD',
				availability: 'https://schema.org/InStock'
			},
			publisher: { '@id': 'https://getromy.app/#organization' },
			featureList: [
				'AI-powered donor prospect research',
				'Wealth indicator screening',
				'Giving history analysis',
				'Affinity signal detection',
				'Actionable donor profiles',
				'No enterprise contracts required'
			]
		}
	]}
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
