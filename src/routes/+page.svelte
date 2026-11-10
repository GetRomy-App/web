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
		CORE_KEYWORDS,
		ORG_ID,
		SITE_URL,
		SOFTWARE_ID,
		WEBSITE_ID,
		DEFAULT_OG_IMAGE,
		graph
	} from '$lib/seo';

	const seoTitle = 'Rōmy: AI Prospect Research & Wealth Screening for Nonprofits';
	const seoDescription =
		'Rōmy is affordable AI prospect research and wealth screening for small nonprofits. Find major donors with wealth indicators, giving history and affinity signals.';

	const homeSchema = graph(
		{
			'@type': 'WebPage',
			'@id': `${SITE_URL}/#webpage`,
			url: `${SITE_URL}/`,
			name: seoTitle,
			description: seoDescription,
			inLanguage: 'en-US',
			isPartOf: { '@id': WEBSITE_ID },
			about: { '@id': SOFTWARE_ID },
			primaryImageOfPage: { '@type': 'ImageObject', url: DEFAULT_OG_IMAGE }
		},
		{
			'@type': ['SoftwareApplication', 'WebApplication'],
			'@id': SOFTWARE_ID,
			name: 'Rōmy',
			alternateName: 'Rōmy Donor Intelligence',
			url: SITE_URL,
			installUrl: 'https://intel.getromy.app',
			applicationCategory: 'BusinessApplication',
			applicationSubCategory: 'Nonprofit prospect research and donor intelligence',
			operatingSystem: 'Web browser',
			image: DEFAULT_OG_IMAGE,
			screenshot: `${SITE_URL}/screenshot.png`,
			description:
				'Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions. AI-powered prospect research with wealth indicators, giving history, and affinity signals.',
			audience: {
				'@type': 'BusinessAudience',
				audienceType:
					'Small nonprofits, development directors, major gift officers and prospect researchers'
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
			keywords: CORE_KEYWORDS.join(', ')
		}
	);

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
	title={seoTitle}
	description={seoDescription}
	path="/"
	keywords={[
		...CORE_KEYWORDS,
		'donor discovery platform',
		'giving history research',
		'donor wealth indicators',
		'iWave alternative',
		'DonorSearch alternative',
		'WealthEngine alternative',
		'nonprofit technology'
	]}
	schema={homeSchema}
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
