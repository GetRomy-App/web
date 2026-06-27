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
	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: [
			{
				'@type': 'Question',
				name: 'What is Rōmy?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Rōmy is an AI-powered donor intelligence platform for small nonprofits. It researches individual prospects and produces 16-section donor intelligence reports covering wealth indicators, giving history, board and organizational connections, and recommended outreach strategy — in 2–10 minutes per report.'
				}
			},
			{
				'@type': 'Question',
				name: 'How does Rōmy compare to DonorSearch, iWave, or WealthEngine?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Rōmy costs $290–$1,990/year versus $15,000–$50,000/year for enterprise platforms like DonorSearch, iWave, and WealthEngine. On PIF-Bench (our open accuracy benchmark), Rōmy scored 94.6 — outperforming ChatGPT (79.9) and Gemini (76.0) and matching Claude (92.2). Each report costs $0.50–$5 versus $8–$15 with enterprise tools.'
				}
			},
			{
				'@type': 'Question',
				name: 'Who is Rōmy built for?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Rōmy is built for small nonprofit development offices — typically organizations with annual budgets under $2 million — that need professional-grade prospect research but cannot afford enterprise wealth screening contracts. If you have a one- or two-person development team and need to find major donors, Rōmy is for you.'
				}
			},
			{
				'@type': 'Question',
				name: 'How much does Rōmy cost?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Rōmy starts at $290/year (Growth plan) and $1,990/year (Scale plan). Each donor research report costs $0.50–$5, compared to $8–$50 with enterprise tools or manual research. There are no enterprise contracts, per-seat fees, or long-term commitments required.'
				}
			},
			{
				'@type': 'Question',
				name: 'What does a Rōmy donor research report include?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'A Rōmy donor intelligence report includes 16 sections: wealth indicators, giving history, philanthropic interests, organizational connections, board memberships, business background, real estate holdings, political giving, affinity signals, capacity estimate, inclination score, connection points to your organization, suggested ask amount, outreach timing, conversation angles, and an executive summary. Enterprise tools typically cover 5–8 sections.'
				}
			},
			{
				'@type': 'Question',
				name: 'How long does Rōmy take to research a donor?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'A full 16-section Rōmy donor intelligence report takes 2–10 minutes, versus 5–15 minutes for enterprise tools and approximately 45 minutes for manual research. The time saved per prospect lets small teams research far more donors without adding staff.'
				}
			}
		]
	})}</script>`}
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
