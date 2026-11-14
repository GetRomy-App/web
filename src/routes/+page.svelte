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
	import { graph, softwareSchema, keywordsFor, SITE_URL, ORG_ID, WEBSITE_ID, SOFTWARE_ID } from '$lib/seo';

	const homeSchema = graph(softwareSchema, {
		'@type': 'WebPage',
		'@id': `${SITE_URL}/#webpage`,
		url: `${SITE_URL}/`,
		name: 'Rōmy — AI Donor Intelligence & Prospect Research for Small Nonprofits',
		isPartOf: { '@id': WEBSITE_ID },
		about: { '@id': SOFTWARE_ID },
		publisher: { '@id': ORG_ID },
		primaryImageOfPage: { '@type': 'ImageObject', url: `${SITE_URL}/screenshot.png` },
		inLanguage: 'en-US'
	});

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
	title="Rōmy — AI Donor Intelligence & Prospect Research for Small Nonprofits"
	description="AI prospect research for small nonprofits. Rōmy finds new major donors with wealth screening and giving history at a fraction of the cost of existing solutions."
	path="/"
	keywords={keywordsFor(undefined, ['donor intelligence software', 'prospect research software', 'wealth screening alternative', 'affordable prospect research', 'donor discovery platform'])}
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
