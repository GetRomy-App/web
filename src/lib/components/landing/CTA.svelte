<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap, SplitText } from '$lib/gsap';
	import Button from '$lib/components/ui/Button.svelte';
	import Grid from '../ui/Grid.svelte';
	import { productUrl } from '$lib/release';

	let ctaSection: HTMLElement;

	onMount(() => {
		let ctaTitleSplit: SplitText;
		let ctaDescSplit: SplitText;
		let ctaTl: gsap.core.Timeline;
		let mounted = true;

		const init = async () => {
			await document.fonts.ready;
			if (!mounted) return;

			ctaTitleSplit = new SplitText(ctaSection.querySelector('h2'), {
				type: 'lines',
				mask: 'lines'
			});
			ctaDescSplit = new SplitText(ctaSection.querySelector('p'), {
				type: 'lines',
				mask: 'lines'
			});

			ctaTl = gsap.timeline({
				scrollTrigger: {
					trigger: ctaSection,
					start: 'top 85%'
				}
			});

			ctaTl
				.fromTo(
					ctaTitleSplit.lines,
					{ yPercent: 100 },
					{ yPercent: 0, duration: 1.2, ease: 'custom-ease' }
				)
				.fromTo(
					ctaDescSplit.lines,
					{ yPercent: 100 },
					{ yPercent: 0, stagger: 0.1, duration: 1.2, ease: 'custom-ease' },
					'-=0.8'
				)
				.fromTo(
					ctaSection.querySelectorAll('a'),
					{ opacity: 0, y: 10 },
					{ opacity: 1, y: 0, stagger: 0.1, duration: 1.0, ease: 'custom-ease' },
					'-=0.8'
				);
		};

		init();

		return () => {
			mounted = false;
			if (ctaTitleSplit) ctaTitleSplit.revert();
			if (ctaDescSplit) ctaDescSplit.revert();
			if (ctaTl) ctaTl.kill();
		};
	});
</script>

<section id="cta" bind:this={ctaSection} class="px-4 md:px-8 py-8 relative flex w-full flex-col">
	<Grid></Grid>
	<div class="flex flex-col items-start justify-center">
		<h2 class="mb-4 text-2xl font-medium tracking-tight md:text-4xl text-left">
			Ready to find your next major donor?
		</h2>
		<p
			class="text-gray-alpha-600 mb-8 max-w-xl text-lg leading-relaxed md:text-xl text-left text-pretty"
		>
			Join the nonprofits that have switched to a faster, more affordable way to discover donors.
			Fundraising intelligence built for small teams.
		</p>
	</div>

	<div class="flex flex-wrap items-center gap-3">
		<Button href={productUrl} target="_blank" rel="noreferrer" class="w-fit">
			Get Started
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" class="size-4" aria-hidden="true">
				<path d="M9 6C9 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
			</svg>
		</Button>
		<Button variant="secondary" href="/labs" class="w-fit">
			See Benchmarks
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" class="size-4" aria-hidden="true">
				<path d="M9 6C9 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
			</svg>
		</Button>
		<Button variant="secondary" href="mailto:howard@getromy.app,solomon@getromy.app" class="w-fit">
			Enterprise Access
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" class="size-4" aria-hidden="true">
				<path d="M9 6C9 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
			</svg>
		</Button>
	</div>
</section>
