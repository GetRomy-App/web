<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap, SplitText } from '$lib/gsap';
	import Button from '$lib/components/ui/Button.svelte';
	import Grid from '../ui/Grid.svelte';
	import OrganicBackground from '../ui/OrganicBackground.svelte';
	import { productUrl } from '$lib/release';
	import { isDark } from '$lib/theme';

	let heroTitle: HTMLElement;
	let heroDesc: HTMLElement;
	let heroButtons: HTMLElement;
	let previewImg: HTMLImageElement;

	$effect(() => {
		if (!previewImg) return;
		const dark = $isDark;
		const nextSrc = dark ? '/screenshot.webp' : '/screenshot-light.webp';

		gsap.to(previewImg, {
			filter: 'blur(16px) saturate(0.6)',
			scale: 1.03,
			duration: 0.4,
			ease: 'power2.in',
			onComplete: () => {
				previewImg.src = nextSrc;
				gsap.to(previewImg, {
					filter: 'blur(0px) saturate(1)',
					scale: 1,
					duration: 0.5,
					ease: 'power2.out'
				});
			}
		});
	});

	onMount(() => {
		let tl: gsap.core.Timeline;
		let titleSplit: SplitText;
		let descSplit: SplitText;
		let mounted = true;

		const init = async () => {
			await document.fonts.ready;
			if (!mounted) return;

			tl = gsap.timeline();
			const isMobile = window.innerWidth < 768;
			titleSplit = new SplitText(heroTitle, { type: 'lines', mask: 'lines', linesClass: isMobile ? 'pb-1' : 'pb-4' });
			descSplit = new SplitText(heroDesc, { type: 'lines', mask: 'lines' });

			tl.fromTo(
				titleSplit.lines,
				{ yPercent: 100 },
				{ yPercent: 0, duration: 1.2, stagger: 0.1, ease: 'custom-ease' }
			)
				.fromTo(
					descSplit.lines,
					{ yPercent: 100 },
					{ yPercent: 0, duration: 1.2, stagger: 0.1, ease: 'custom-ease' },
					'-=1.0'
				)
				.fromTo(
					heroButtons.children,
					{ opacity: 0, y: 10 },
					{ opacity: 1, y: 0, duration: 1.2, ease: 'custom-ease' },
					'-=1.0'
				)
				.fromTo(
					previewImg,
					{
						opacity: 0,
						scale: 0.95,
						y: 40,
						filter: 'blur(10px)'
					},
					{
						opacity: 1,
						scale: 1,
						y: 0,
						filter: 'blur(0px)',
						duration: 1.6,
						ease: 'custom-ease'
					},
					'-=0.6'
				);

			gsap.set([heroTitle, heroDesc, heroButtons], { opacity: 1 });
		};

		init();

		return () => {
			mounted = false;
			if (titleSplit) titleSplit.revert();
			if (descSplit) descSplit.revert();
			if (tl) tl.kill();
		};
	});
</script>

<section
	class="px-4 md:px-8 pt-48 md:pt-48 pb-24 md:pb-24 relative z-10 flex w-full flex-col items-center justify-center text-center"
>
	<Grid />

	<h1
		bind:this={heroTitle}
		class="text-foreground text-4xl font-medium tracking-tight md:text-5xl opacity-0"
	>
		Donor intelligence, <span class="text-blue-700">reimagined.</span>
	</h1>

	<p
		bind:this={heroDesc}
		class="text-gray-alpha-600 mb-8 max-w-xl text-lg leading-relaxed md:text-xl text-pretty opacity-0"
	>
		Rōmy helps small nonprofits find new major donors at a fraction of the cost of existing
		solutions.
	</p>

	<div bind:this={heroButtons} class="gap-4 sm:flex-row flex flex-col items-center opacity-0">
		<Button class="group" size="lg" href={productUrl} target="_blank" rel="noreferrer">
			Get Started
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" class="size-4" aria-hidden="true">
				<path d="M9 6C9 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
			</svg>
		</Button>
	</div>
</section>

<section class="px-4 md:px-8 py-8 relative w-full overflow-hidden">
	<div class="relative rounded-xl overflow-hidden">
		<OrganicBackground />
		<div class="relative z-10 p-5 sm:p-8">
			<img
				bind:this={previewImg}
				src="/screenshot.webp"
				alt="Preview of Rōmy"
				decoding="async"
				class="screenshot-img h-auto w-full rounded-md opacity-0"
			/>
		</div>
	</div>
</section>
