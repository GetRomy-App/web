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
					text: 'Rōmy is an AI-powered donor intelligence platform built specifically for small nonprofits. It researches and profiles major gift prospects using wealth indicators, philanthropic giving history, and affinity signals — producing a 16-section actionable donor report in 2–10 minutes per prospect.'
				}
			},
			{
				'@type': 'Question',
				name: 'How much does Rōmy cost?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Rōmy starts at $290/yr for the Growth plan. The Scale plan is $1,990/yr. Enterprise wealth screening tools typically cost $15,000–$50,000/yr. Rōmy delivers comparable or superior accuracy (94.6 on PIF-Bench) at a fraction of the price.'
				}
			},
			{
				'@type': 'Question',
				name: 'How accurate is Rōmy compared to other AI tools?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'On PIF-Bench (Prospect Intelligence Fidelity Benchmark), Rōmy scored 94.6 out of 100 — outperforming ChatGPT (79.9), Claude (92.2), and Gemini (76.0). PIF-Bench measures accuracy across wealth screening, giving history, affinity signals, and report quality for nonprofit donor research.'
				}
			},
			{
				'@type': 'Question',
				name: 'What is PIF-Bench?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'PIF-Bench (Prospect Intelligence Fidelity Benchmark) is an open benchmark created by GetRomy LLC to evaluate AI systems on nonprofit donor prospect research tasks. It scores AI tools across multiple dimensions: wealth capacity accuracy, philanthropic giving history, affinity signal detection, and actionable report quality. Results are published at getromy.app/labs.'
				}
			},
			{
				'@type': 'Question',
				name: 'Who is Rōmy built for?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Rōmy is built for small nonprofits — organizations with 1–50 staff who cannot afford enterprise prospect research tools costing $15K–$50K/yr. Development directors, major gift officers, and executive directors at community foundations, human services organizations, arts nonprofits, and educational institutions use Rōmy to find and prioritize major donor prospects.'
				}
			},
			{
				'@type': 'Question',
				name: 'How does Rōmy compare to enterprise wealth screening tools like iWave or DonorSearch?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Rōmy produces 16-section donor intelligence reports (vs. 5–8 sections for typical enterprise tools) in 2–10 minutes, at $0.50–$5 per report (vs. $8–$15 per report for enterprise alternatives). Rōmy scored 94.6 on PIF-Bench versus enterprise tools that typically score in the 70–85 range. No contracts, no minimums, and no need for dedicated prospect research staff.'
				}
			},
			{
				'@type': 'Question',
				name: 'Does Rōmy replace a prospect researcher?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Rōmy augments your fundraising team rather than replacing a researcher. It handles the time-consuming data gathering and synthesis that typically takes a prospect researcher 45 minutes per donor, compressing it to 2–10 minutes. Small nonprofits without dedicated research staff can conduct prospect research at scale for the first time.'
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
