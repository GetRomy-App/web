<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import Lenis from 'lenis';
	import { gsap, ScrollTrigger, registerGsap } from '$lib/gsap';

	let { children } = $props();

	registerGsap();

	onMount(() => {
		const lenis = new Lenis();

		lenis.on('scroll', ScrollTrigger.update);

		gsap.ticker.add((time: number) => {
			lenis.raf(time * 1000);
		});

		gsap.ticker.lagSmoothing(0);

		return () => {
			lenis.destroy();
		};
	});

	const title = 'Rōmy — Donor Intelligence for Small Nonprofits';
	const description =
		'Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing solutions.';
	const url = 'https://getromy.app/';
	const image = 'https://getromy.app/og-image.jpg';
</script>

<svelte:head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />

	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={description} />
	<meta
		name="keywords"
		content="nonprofit, donor intelligence, fundraising, prospect research, donor discovery, wealth indicators, giving history, AI-powered"
	/>
	<meta name="author" content="Rōmy" />
	<meta name="theme-color" content="#131315" />

	<meta property="og:type" content="website" />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />
	<meta property="og:site_name" content="Rōmy" />

	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={url} />
	<meta property="twitter:title" content={title} />
	<meta property="twitter:description" content={description} />
	<meta property="twitter:image" content={image} />

	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
	<link rel="shortcut icon" href="/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<link rel="manifest" href="/site.webmanifest" />

	<link rel="canonical" href={url} />
</svelte:head>

{@render children()}
