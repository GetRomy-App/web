<script lang="ts">
	import Seo from '$lib/components/seo/Seo.svelte';
	import { SITE_URL, ORG_ID, APP_ID } from '$lib/seo';
	import '../app.css';
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
	description="Rōmy is AI donor intelligence software that helps small nonprofits find new major donors fast: wealth indicators, giving history, and affinity signals in one profile, at a fraction of the cost of enterprise wealth screening."
	path="/"
	keywords="donor intelligence software, nonprofit prospect research, major donor prospecting, AI donor research, wealth screening for nonprofits, affordable wealth screening, donor discovery platform, fundraising software for small nonprofits, donor wealth indicators, philanthropy intelligence, DonorSearch alternative, iWave alternative, WealthEngine alternative"
	imageAlt="Rōmy donor intelligence app showing a prospect profile"
	jsonLd={[
		{
			'@type': 'SoftwareApplication',
			'@id': APP_ID,
			name: 'Rōmy',
			alternateName: 'Romy',
			url: SITE_URL,
			applicationCategory: 'BusinessApplication',
			applicationSubCategory: 'Donor intelligence and nonprofit prospect research',
			operatingSystem: 'macOS, Windows, Linux',
			audience: { '@type': 'Audience', audienceType: 'Small nonprofits and fundraising teams' },
			description:
				'Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions. AI-powered prospect research with wealth indicators, giving history, and affinity signals.',
			image: `${SITE_URL}/og-image.jpg`,
			screenshot: `${SITE_URL}/screenshot.png`,
			offers: {
				'@type': 'Offer',
				price: '0',
				priceCurrency: 'USD',
				availability: 'https://schema.org/InStock'
			},
			publisher: { '@id': ORG_ID },
			featureList: [
				'AI-powered donor prospect research',
				'Wealth indicator screening',
				'Giving history analysis',
				'Affinity signal detection',
				'Actionable donor profiles',
				'No enterprise contracts required'
			]
		},
		{
			'@type': 'WebPage',
			'@id': `${SITE_URL}/#webpage`,
			url: SITE_URL,
			name: 'Rōmy — AI Donor Intelligence & Prospect Research for Small Nonprofits',
			isPartOf: { '@id': `${SITE_URL}/#website` },
			about: { '@id': APP_ID }
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
