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
					"text": "Rōmy is an AI-powered donor intelligence platform built for small nonprofits. It surfaces wealth indicators, giving histories, and affinity signals for prospective major donors — then distills them into actionable 16-section donor profiles."
				}
			},
			{
				"@type": "Question",
				"name": "How much does Rōmy cost?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Rōmy starts free, with paid plans at $290/year (Growth) and $1,990/year (Scale). That's a fraction of enterprise wealth screening tools, which typically cost $15,000–$50,000 per year."
				}
			},
			{
				"@type": "Question",
				"name": "How is Rōmy different from enterprise wealth screening platforms?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Rōmy is purpose-built for small nonprofits — no per-seat licensing, no enterprise contracts. On PIF-Bench (the Prospect Intelligence Fidelity benchmark), Rōmy scored 94.6 vs. ChatGPT (79.9), Claude (92.2), and Gemini (76.0). It produces 16-section donor reports in minutes at $0.50–$5 each."
				}
			},
			{
				"@type": "Question",
				"name": "What data does Rōmy include in donor profiles?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Each Rōmy donor profile includes wealth indicators, giving history, affinity signals, connection points, giving capacity estimates, and personalized outreach angles — all sourced through AI-powered prospect research."
				}
			},
			{
				"@type": "Question",
				"name": "Who is Rōmy for?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Rōmy is built for small and mid-sized nonprofits — development directors, major gift officers, and executive directors who need research-grade donor intelligence without the cost or complexity of enterprise fundraising software."
				}
			}
		]
	})}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "WebPage",
		"name": "Rōmy — Donor Intelligence for Small Nonprofits",
		"url": "https://getromy.app/",
		"description": "Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions. AI-powered prospect research, wealth indicators, and giving history.",
		"isPartOf": {
			"@type": "WebSite",
			"name": "Rōmy",
			"url": "https://getromy.app"
		},
		"about": {
			"@type": "SoftwareApplication",
			"name": "Rōmy",
			"applicationCategory": "BusinessApplication"
		},
		"breadcrumb": {
			"@type": "BreadcrumbList",
			"itemListElement": [
				{
					"@type": "ListItem",
					"position": 1,
					"name": "Home",
					"item": "https://getromy.app/"
				}
			]
		}
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
