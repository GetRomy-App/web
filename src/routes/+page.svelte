<svelte:head>
	<title>Rōmy — AI Donor Intelligence for Small Nonprofits</title>
	<meta name="description" content="Rōmy gives small nonprofits the donor intelligence that used to cost $15K–$50K/year. AI prospect research, wealth screening, giving history, and RōmyScore capacity estimates — starting at $29/month." />
	<meta name="keywords" content="nonprofit donor intelligence, AI prospect research, major donor prospecting, wealth screening nonprofits, affordable fundraising software, DonorSearch alternative, iWave alternative, small nonprofit tools, donor discovery, giving capacity estimates, RōmyScore, major gift fundraising AI" />
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
					"text": "Rōmy is an AI-powered donor intelligence platform for small nonprofits. It researches wealth indicators, giving history, real estate assets, philanthropic interests, and affinity signals for potential major donors — then delivers a comprehensive 16-section prospect report with RōmyScore capacity estimates and a recommended ask strategy. Every fact is hyperlinked to its source."
				}
			},
			{
				"@type": "Question",
				"name": "How much does Rōmy cost?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Rōmy offers three plans: Growth at $29/month (500 credits/month), Pro at $89/month (1,000 credits/month), and Scale at $199/month (5,000 credits/month). Annual billing saves roughly 17%. A full 16-section deep research report costs 2 credits — meaning the Growth plan covers up to 250 deep donor reports per month. Enterprise platforms like DonorSearch, iWave, and WealthEngine cost $12,000–$50,000/year for comparable research."
				}
			},
			{
				"@type": "Question",
				"name": "Who is Rōmy designed for?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Rōmy is designed for small and mid-sized nonprofits — typically those with annual budgets under $5 million — that cannot justify a $15,000–$50,000/year enterprise donor intelligence platform. It is especially useful for one- or two-person development teams that need to research major gift prospects without a dedicated prospect researcher on staff."
				}
			},
			{
				"@type": "Question",
				"name": "How accurate is Rōmy's AI donor research?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "In independent PIF-Bench testing (Prospect Intelligence Fidelity Benchmark), Rōmy scored 94.6 out of 100 across five well-documented major donor prospects — outperforming Claude Opus (92.2), ChatGPT (79.9), and Gemini (76.0). The benchmark measures factual precision, discovery recall, hallucination rate, capacity estimation accuracy, source attribution, structural completeness, and actionability."
				}
			},
			{
				"@type": "Question",
				"name": "How does Rōmy compare to DonorSearch, iWave, and WealthEngine?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Rōmy delivers comparable donor intelligence to enterprise platforms at 52x–172x lower cost. Enterprise tools like DonorSearch ($15,000–$25,000/year), iWave ($12,000–$20,000/year), and WealthEngine ($20,000–$50,000/year) charge flat annual fees regardless of usage. Rōmy's credit-based model means you only pay for the research you actually run. On PIF-Bench accuracy testing, Rōmy outscored all general-purpose AI alternatives."
				}
			},
			{
				"@type": "Question",
				"name": "What does a Rōmy donor research report include?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Each full Rōmy report includes 16 sections: personal and professional background, wealth indicators, real estate assets, philanthropic giving history (with amounts and recipient organizations), cause areas and giving philosophy, RōmyScore capacity estimation, recommended ask amount, engagement strategy, connection points, solicitation guardrails, and a methodology section with confidence levels for each data category. Every factual claim includes a hyperlinked source citation."
				}
			},
			{
				"@type": "Question",
				"name": "Does Rōmy work for finding new major donor prospects I haven't heard of?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Yes. Rōmy's Discovery Search lets you type a natural language objective — for example, 'find education donors in Atlanta who have given $50,000 or more to HBCU programs' — and returns matched prospects with full intelligence reports. You can also use Rōmy to re-screen existing CRM contacts to identify mid-level donors who may be ready for a major gift ask."
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
