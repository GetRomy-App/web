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
	import Seo from '$lib/components/seo/Seo.svelte';
	import { SITE_URL, ORGANIZATION_ID, WEBSITE_ID } from '$lib/seo';

	const software = {
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		'@id': `${SITE_URL}/#software`,
		name: 'Rōmy',
		url: `${SITE_URL}/`,
		applicationCategory: 'BusinessApplication',
		applicationSubCategory: 'Donor prospect research software',
		operatingSystem: 'macOS, Windows, Linux',
		description:
			'Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions. AI-powered prospect research with wealth indicators, giving history, and affinity signals.',
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD',
			availability: 'https://schema.org/InStock'
		},
		audience: { '@type': 'Audience', audienceType: 'Small nonprofit fundraising teams' },
		publisher: { '@id': ORGANIZATION_ID },
		featureList: [
			'AI-powered donor prospect research',
			'Wealth indicator screening',
			'Giving history analysis',
			'Affinity signal detection',
			'Actionable donor profiles',
			'No enterprise contracts required'
		]
	};

	const webpage = {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		'@id': `${SITE_URL}/#webpage`,
		url: `${SITE_URL}/`,
		name: 'Rōmy — AI Donor Research & Prospecting for Small Nonprofits',
		isPartOf: { '@id': WEBSITE_ID },
		about: { '@id': `${SITE_URL}/#software` },
		inLanguage: 'en-US'
	};

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
	title="Rōmy — AI Donor Research & Prospecting for Small Nonprofits"
	description="AI donor research for small nonprofits. Rōmy surfaces major donor prospects with wealth indicators and giving history, at a fraction of enterprise prices."
	path="/"
	keywords="donor research software, nonprofit donor intelligence, prospect research tool, AI donor research, wealth screening for nonprofits, major donor prospecting, fundraising software for small nonprofits, affordable wealth screening, donor discovery platform, DonorSearch alternative, iWave alternative"
	jsonLd={[software, webpage]}
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
