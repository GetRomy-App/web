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
	import { softwareSchema } from '$lib/seo';

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
	title="Rōmy — AI Prospect Research & Donor Intelligence for Small Nonprofits"
	socialTitle="Rōmy — Donor Intelligence for Small Nonprofits"
	description="Rōmy helps small nonprofits find new major donors at a fraction of the cost. AI-powered prospect research, wealth indicators, and giving history."
	path="/"
	keywords={[
		'donor intelligence',
		'AI prospect research',
		'prospect research software',
		'donor prospect research tool',
		'wealth screening for nonprofits',
		'wealth screening alternative',
		'find major donors',
		'major donor prospecting',
		'donor research software',
		'small nonprofit fundraising software',
		'affordable prospect research',
		'giving history',
		'wealth indicators',
		'AI for nonprofit fundraising',
		'Rōmy'
	]}
	jsonLd={[softwareSchema()]}
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
