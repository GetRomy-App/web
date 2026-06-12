<svelte:head>
	<title>Rōmy — Donor Intelligence for Small Nonprofits</title>
	<meta name="description" content="Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions. AI-powered prospect research, wealth indicators, and giving history — starting at $0.10 per prospect. No enterprise contract required." />
	<meta name="keywords" content="nonprofit donor intelligence, donor prospect research software, AI wealth screening, major donor discovery, small nonprofit fundraising tools, affordable prospect research, DonorSearch alternative, iWave alternative, WealthEngine alternative, nonprofit fundraising CRM, donor capacity screening, giving history database, RōmyScore, nonprofit major gifts, philanthropic prospect research, fundraising automation nonprofit" />
	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "FAQPage",
		"mainEntity": [
			{
				"@type": "Question",
				"name": "What is Rōmy?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Rōmy is an AI-powered donor intelligence platform built for small nonprofits. It surfaces wealth indicators, giving histories, cause affinities, and actionable donor profiles — at a fraction of the cost of enterprise tools like DonorSearch, iWave, or WealthEngine."
				}
			},
			{
				"@type": "Question",
				"name": "How much does Rōmy cost?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Rōmy starts at $29/month for the Growth plan (500 credits), $89/month for Pro (1,000 credits), and $199/month for Scale (5,000 credits). Base prospect enrichment costs 2.5 credits — as low as $0.10 per prospect on the Scale plan."
				}
			},
			{
				"@type": "Question",
				"name": "How does Rōmy compare to DonorSearch or iWave?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Enterprise tools like DonorSearch and iWave cost $15,000–$50,000/year with minimum contracts. Rōmy delivers comparable or superior AI-powered prospect research starting at $29/month — up to 150x cheaper. In head-to-head benchmarking (PIF-Bench), Rōmy scored 94.6 vs. ChatGPT at 79.9 and Gemini at 76.0."
				}
			},
			{
				"@type": "Question",
				"name": "What is a RōmyScore?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "RōmyScore is a normalized 0-100 donor readiness score calculated from wealth indicators, giving history, cause alignment, professional background, and nonprofit board affiliations. It helps fundraisers prioritize prospects for outreach."
				}
			},
			{
				"@type": "Question",
				"name": "Is Rōmy only for small nonprofits?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Rōmy is purpose-built for small nonprofit teams who lack the budget for enterprise prospect research platforms. It works for any nonprofit conducting major gift fundraising, capital campaigns, or annual fund upgrades."
				}
			},
			{
				"@type": "Question",
				"name": "What data does Rōmy use for donor research?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Rōmy sources data from public records including real estate filings, SEC disclosures, philanthropic databases, IRS Form 990s, and open web research. Every fact in a Rōmy report includes a source citation."
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
