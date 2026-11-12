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
	import {
		APP_ID,
		APP_URL,
		ORG_ID,
		WEBSITE_ID,
		SITE_DESCRIPTION,
		SITE_URL,
		DEFAULT_OG_IMAGE,
		graph,
		organizationSchema,
		websiteSchema
	} from '$lib/seo';

	const title = 'Rōmy — AI Prospect Research & Donor Intelligence for Small Nonprofits';

	const jsonLd = graph(
		organizationSchema,
		websiteSchema,
		{
			'@type': 'WebPage',
			'@id': `${SITE_URL}/#webpage`,
			url: `${SITE_URL}/`,
			name: title,
			description: SITE_DESCRIPTION,
			inLanguage: 'en-US',
			isPartOf: { '@id': WEBSITE_ID },
			about: { '@id': APP_ID },
			primaryImageOfPage: DEFAULT_OG_IMAGE
		},
		{
			'@type': 'SoftwareApplication',
			'@id': APP_ID,
			name: 'Rōmy',
			alternateName: 'Romy',
			url: `${SITE_URL}/`,
			sameAs: APP_URL,
			applicationCategory: 'BusinessApplication',
			applicationSubCategory: 'Prospect research and donor intelligence software',
			operatingSystem: 'Web',
			description:
				'Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions. AI-powered prospect research with wealth indicators, giving history, and affinity signals.',
			audience: {
				'@type': 'BusinessAudience',
				audienceType: 'Small nonprofit fundraising and development teams'
			},
			featureList: [
				'AI-powered donor prospect research',
				'Wealth indicator screening',
				'Giving history analysis',
				'Affinity signal detection',
				'Actionable donor profiles with connection points, giving capacity and outreach angles',
				'No enterprise contracts or per-seat licensing'
			],
			screenshot: `${SITE_URL}/screenshot.png`,
			publisher: { '@id': ORG_ID }
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
	{title}
	description={SITE_DESCRIPTION}
	path="/"
	socialTitle="Rōmy — Donor Intelligence for Small Nonprofits"
	keywords={[
		'prospect research software',
		'AI prospect research',
		'donor intelligence',
		'donor research tool',
		'wealth screening for small nonprofits',
		'wealth screening alternative',
		'major donor prospecting',
		'find major donors',
		'donor prospecting software',
		'nonprofit fundraising software',
		'AI for nonprofit fundraising',
		'giving history research',
		'donor wealth indicators',
		'affordable prospect research'
	]}
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
