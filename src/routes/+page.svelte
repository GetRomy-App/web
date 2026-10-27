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
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import { SITE_URL } from '$lib/seo';

	const title = 'Rōmy — Donor Intelligence & AI Prospect Research for Small Nonprofits';
	const description =
		'Rōmy is donor intelligence software for small nonprofits: AI prospect research, wealth indicators, and giving history to find new major donors at a fraction of the cost of enterprise screening tools.';
	const jsonLd = [
		{
			'@context': 'https://schema.org',
			'@type': 'SoftwareApplication',
			'@id': `${SITE_URL}/#software`,
			name: 'Rōmy',
			alternateName: 'Rōmy donor intelligence',
			url: SITE_URL,
			applicationCategory: 'BusinessApplication',
			applicationSubCategory: 'Nonprofit fundraising and prospect research software',
			operatingSystem: 'macOS, Windows, Linux, Web',
			description,
			audience: { '@type': 'Audience', audienceType: 'Small nonprofits and development teams' },
			offers: {
				'@type': 'AggregateOffer',
				priceCurrency: 'USD',
				lowPrice: '29',
				highPrice: '199',
				offerCount: '3',
				availability: 'https://schema.org/InStock'
			},
			publisher: { '@id': `${SITE_URL}/#organization` },
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
			'@context': 'https://schema.org',
			'@type': 'WebPage',
			'@id': `${SITE_URL}/#webpage`,
			url: SITE_URL,
			name: title,
			description,
			isPartOf: { '@id': `${SITE_URL}/#website` },
			about: { '@id': `${SITE_URL}/#software` },
			inLanguage: 'en-US'
		}
	];

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

<SeoHead
	{title}
	{description}
	path="/"
	ogTitle="Rōmy — Donor Intelligence for Small Nonprofits"
	keywords="donor intelligence, nonprofit prospect research, AI prospect research, wealth screening for nonprofits, major donor prospecting, DonorSearch alternative, iWave alternative, WealthEngine alternative, affordable donor research, small nonprofit fundraising software"
	{jsonLd}
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
