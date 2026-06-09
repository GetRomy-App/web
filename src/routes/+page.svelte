<svelte:head>
	<link rel="canonical" href="https://getromy.app/" />
	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "FAQPage",
		"mainEntity": [
			{
				"@type": "Question",
				"name": "What is Rōmy?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Rōmy is an AI-powered donor intelligence platform built for small nonprofits. It researches prospects and produces 16-section donor reports — covering wealth indicators, giving history, affinity signals, and outreach angles — at a fraction of the cost of enterprise solutions like DonorSearch or WealthEngine."
				}
			},
			{
				"@type": "Question",
				"name": "How much does Rōmy cost?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Rōmy starts free. Paid plans begin at $290/year (Growth) and $1,990/year (Scale). Each report costs $0.50–$5 — compared to $8–$15 per report for enterprise tools and $50+ for manual research."
				}
			},
			{
				"@type": "Question",
				"name": "How accurate is Rōmy compared to ChatGPT, Claude, or Gemini for donor research?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "On PIF-Bench (Prospect Intelligence Fidelity benchmark), Rōmy scored 94.6 — higher than Claude (92.2), ChatGPT (79.9), and Gemini (76.0). PIF-Bench measures accuracy, depth, and actionability of AI-generated donor intelligence reports."
				}
			},
			{
				"@type": "Question",
				"name": "What makes Rōmy different from DonorSearch or WealthEngine?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Rōmy is purpose-built for small nonprofit teams and costs 90% less than enterprise wealth screening platforms. Unlike DonorSearch or WealthEngine — which require annual contracts starting at $15,000–$50,000 — Rōmy has no enterprise contracts, no per-seat licensing, and delivers reports in 2–10 minutes."
				}
			},
			{
				"@type": "Question",
				"name": "What does a Rōmy donor intelligence report include?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Each Rōmy report includes 16 sections: wealth indicators, real estate holdings, giving history, philanthropic affiliations, board memberships, business background, social connections, affinity signals, estimated giving capacity, suggested ask amount, connection points to your mission, and actionable outreach angles."
				}
			},
			{
				"@type": "Question",
				"name": "Who is Rōmy built for?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Rōmy is built for small nonprofit fundraising teams — typically organizations with 1–10 staff in development — who need enterprise-quality prospect research without enterprise pricing or complexity."
				}
			}
		]
	})}</script>`}
</svelte:head>

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
