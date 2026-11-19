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
	import {
		SITE_URL,
		SITE_KEYWORDS,
		ORG_ID,
		WEBSITE_ID,
		SOFTWARE_ID,
		DEFAULT_OG_IMAGE
	} from '$lib/seo';

	const title = 'Rōmy — AI Donor Prospect Research for Small Nonprofits';
	const description =
		'Rōmy is AI prospect research for small nonprofits: find major donors with wealth indicators, giving history and affinity signals, minus enterprise contracts.';

	const softwareLd = {
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		'@id': SOFTWARE_ID,
		name: 'Rōmy',
		alternateName: ['Romy', 'Rōmy Donor Intelligence'],
		url: SITE_URL,
		installUrl: 'https://intel.getromy.app',
		image: DEFAULT_OG_IMAGE.url,
		screenshot: `${SITE_URL}/screenshot.png`,
		applicationCategory: 'BusinessApplication',
		applicationSubCategory: 'Nonprofit prospect research and donor intelligence',
		operatingSystem: 'Web browser',
		description:
			'Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions. AI-powered prospect research with wealth indicators, giving history, and affinity signals.',
		audience: {
			'@type': 'Audience',
			audienceType: 'Small nonprofits, development directors, major gift officers and prospect researchers'
		},
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD',
			availability: 'https://schema.org/InStock'
		},
		publisher: { '@id': ORG_ID },
		featureList: [
			'AI-powered donor prospect research',
			'Wealth indicator screening',
			'Giving history analysis',
			'Affinity signal detection',
			'Actionable donor profiles with connection points, giving capacity and outreach angles',
			'No enterprise contracts or per-seat licensing'
		],
		keywords: SITE_KEYWORDS.join(', ')
	};

	const webPageLd = {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		'@id': `${SITE_URL}/#webpage`,
		url: `${SITE_URL}/`,
		name: title,
		description,
		isPartOf: { '@id': WEBSITE_ID },
		about: { '@id': SOFTWARE_ID },
		primaryImageOfPage: DEFAULT_OG_IMAGE.url,
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
	{title}
	{description}
	path="/"
	ogTitle="Rōmy — Donor intelligence, reimagined"
	keywords={SITE_KEYWORDS}
	jsonLd={[softwareLd, webPageLd]}
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
