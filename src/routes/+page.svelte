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
	import { APP_ID, ORG_ID, WEBSITE_ID, SITE_URL, CORE_KEYWORDS, LOGO_URL } from '$lib/seo';

	const title = 'Rōmy — AI Donor Intelligence & Prospect Research for Small Nonprofits';
	const description =
		'Rōmy helps small nonprofits find new major donors at a fraction of the cost. AI prospect research, wealth indicators and giving history, priced for small teams.';

	const schema = [
		{
			'@type': 'WebPage',
			'@id': `${SITE_URL}/#webpage`,
			url: `${SITE_URL}/`,
			name: title,
			description,
			inLanguage: 'en-US',
			isPartOf: { '@id': WEBSITE_ID },
			about: { '@id': APP_ID },
			publisher: { '@id': ORG_ID },
			primaryImageOfPage: { '@type': 'ImageObject', url: `${SITE_URL}/og-image.jpg` }
		},
		{
			'@type': 'SoftwareApplication',
			'@id': APP_ID,
			name: 'Rōmy',
			url: SITE_URL,
			sameAs: ['https://intel.getromy.app'],
			image: `${SITE_URL}/screenshot.png`,
			screenshot: `${SITE_URL}/screenshot.png`,
			logo: LOGO_URL,
			applicationCategory: 'BusinessApplication',
			applicationSubCategory: 'Donor intelligence and prospect research',
			operatingSystem: 'Web browser',
			browserRequirements: 'Requires a modern web browser',
			audience: {
				'@type': 'Audience',
				audienceType: 'Small nonprofits, development directors, major gift officers, prospect researchers'
			},
			description:
				'Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions. AI-powered prospect research with wealth indicators, giving history, and affinity signals, distilled into actionable donor profiles.',
			keywords: CORE_KEYWORDS.join(', '),
			publisher: { '@id': ORG_ID },
			featureList: [
				'AI-powered donor prospect research',
				'Wealth indicator screening',
				'Giving history analysis',
				'Affinity signal detection',
				'Actionable donor profiles with connection points, giving capacity and outreach angles',
				'No enterprise contracts or per-seat licensing'
			]
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

<Seo {title} {description} path="/" ogTitle="Rōmy — Donor Intelligence for Small Nonprofits" keywords={CORE_KEYWORDS.join(', ')} {schema} />

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
