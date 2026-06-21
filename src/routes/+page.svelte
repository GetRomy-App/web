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
	<title>Rōmy — AI Donor Intelligence for Small Nonprofits | Start Free</title>
	<meta name="description" content="Rōmy gives small nonprofits affordable AI-powered donor prospect research. Find major donors, screen wealth, analyze giving history — starting free. Scored 94.6 on PIF-Bench, beating ChatGPT (79.9) and Gemini (76.0). $0.50–$5 per report vs. $15K+/yr for enterprise tools." />
	<meta name="keywords" content="nonprofit donor research software, AI prospect research, affordable wealth screening, major donor prospecting tool, DonorSearch alternative, iWave alternative, small nonprofit fundraising software, donor intelligence platform, free nonprofit software, AI fundraising, prospect research automation, donor capacity screening, nonprofit technology, fundraising automation" />
	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "FAQPage",
		"mainEntity": [
			{
				"@type": "Question",
				"name": "What is Rōmy?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Rōmy is an AI-powered donor intelligence platform for small nonprofits. It generates comprehensive major donor prospect research reports with wealth indicators, charitable giving history, affinity signals, and outreach guidance — at $0.50–$5 per report, starting free."
				}
			},
			{
				"@type": "Question",
				"name": "How much does nonprofit prospect research software cost?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Enterprise wealth screening tools like DonorSearch, iWave, and WealthEngine cost $15,000–$50,000 per year. Rōmy offers the same quality of donor intelligence starting free, with paid plans at $290/year (Growth) and $1,990/year (Scale). Cost per report: $0.50–$5 with Rōmy vs. $8–$15 with enterprise tools."
				}
			},
			{
				"@type": "Question",
				"name": "How accurate is Rōmy's AI donor research compared to ChatGPT or other AI tools?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Rōmy scored 94.6 on PIF-Bench (Prospect Intelligence Fidelity), a ground-truth benchmark for AI donor research. This compares to Claude (92.2), ChatGPT (79.9), and Gemini (76.0). Rōmy outperforms general-purpose AI because it is purpose-built for nonprofit donor intelligence workflows."
				}
			},
			{
				"@type": "Question",
				"name": "What does a Rōmy donor intelligence report include?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Each Rōmy report includes 16 sections: wealth indicators (real estate, stocks, business ownership), charitable giving history and philanthropic interests, affinity and connection signals, capacity assessment and ask-amount guidance, outreach angles, planned giving signals, DAF (Donor Advised Fund) activity, and more."
				}
			},
			{
				"@type": "Question",
				"name": "Is Rōmy free for small nonprofits?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Yes — Rōmy's Starter plan is free forever, with 3 full donor research reports per month. Paid plans start at $290/year for 50 reports/month (Growth) and $1,990/year for 200+ reports/month (Scale)."
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
