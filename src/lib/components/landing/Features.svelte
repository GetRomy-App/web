<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap, SplitText } from '$lib/gsap';

	let container: HTMLElement;

	onMount(() => {
		let splits: SplitText[] = [];
		let mounted = true;

		const init = async () => {
			await document.fonts.ready;
			if (!mounted) return;

			const gridItems = container.querySelectorAll('.grid-feature');

			gridItems.forEach((item, i) => {
				const icon = item.querySelector('svg');
				const textSplit = new SplitText(item.querySelectorAll('h3, p'), {
					type: 'lines',
					mask: 'lines'
				});
				splits.push(textSplit);

				if (icon) {
					gsap.fromTo(
						icon,
						{
							scale: 0,
							rotate: -10
						},
						{
							scrollTrigger: {
								trigger: item,
								start: 'top 85%'
							},
							scale: 1,
							rotate: 0,
							duration: 0.8,
							ease: 'back.out(1.7)',
							delay: i * 0.5
						}
					);
				}

				gsap.fromTo(
					textSplit.lines,
					{ yPercent: 100 },
					{
						scrollTrigger: {
							trigger: item,
							start: 'top 85%'
						},
						yPercent: 0,
						stagger: 0.1,
						duration: 1.2,
						ease: 'custom-ease',
						delay: i * 0.5
					}
				);
			});
		};

		init();

		return () => {
			mounted = false;
			splits.forEach((s) => s.revert());
		};
	});
</script>

<section
	id="features"
	bind:this={container}
	class="lg:grid-cols-3 lg:divide-y-0 md:divide-x divide-gray-alpha-100 grid w-full grid-cols-1 divide-y"
>
	<div
		class="px-4 md:px-8 py-8 gap-4 grid-feature hover:bg-amber-500/10 hover:ring-amber-500 flex flex-col ring-0 ring-transparent transition-all hover:ring-1"
	>
		<div class="gap-2 flex items-center">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="size-6 md:size-8 text-amber-500">
				<path d="M17 17L21 21"/>
				<path d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z"/>
			</svg>
			<h3 class="text-foreground font-medium text-xl md:text-2xl tracking-tight leading-none">
				Donor Discovery
			</h3>
		</div>
		<p class="text-gray-alpha-600 leading-relaxed text-lg text-pretty">
			Surface high-potential donors with AI-powered prospect research. Wealth indicators, giving
			history, and affinity signals — unified in a single search.
		</p>
	</div>

	<div
		class="px-4 md:px-8 py-8 gap-4 grid-feature hover:bg-emerald-500/10 hover:ring-emerald-500 flex flex-col ring-0 ring-transparent transition-all hover:ring-1"
	>
		<div class="gap-2 flex items-center">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="size-6 md:size-8 text-emerald-500">
				<path d="M17.9583 8.38889C17.9583 6.24111 15.2907 4.5 12 4.5C8.7093 4.5 6.04167 6.24111 6.04167 8.38889C6.04167 10.5367 7.66667 11.7222 12 11.7222C16.3333 11.7222 18.5 12.8333 18.5 15.6111C18.5 18.3889 15.5899 19.5 12 19.5C8.41015 19.5 5.5 17.7589 5.5 15.6111"/>
				<path d="M12.5 2.5V4.21M12.5 21.5V19.79"/>
			</svg>
			<h3 class="text-foreground font-medium text-xl md:text-2xl tracking-tight leading-none">
				Fraction of the Cost
			</h3>
		</div>
		<p class="text-gray-alpha-600 leading-relaxed text-lg text-pretty">
			No enterprise contracts or per-seat licensing. Rōmy delivers the donor intelligence that
			used to cost tens of thousands — at a price built for small nonprofits.
		</p>
	</div>

	<div
		class="px-4 md:px-8 py-8 gap-4 grid-feature hover:bg-violet-500/10 hover:ring-violet-500 flex flex-col ring-0 ring-transparent transition-all hover:ring-1"
	>
		<div class="gap-2 flex items-center">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" class="size-6 md:size-8 text-violet-500">
				<path d="M8.62814 12.6736H8.16918C6.68545 12.6736 5.94358 12.6736 5.62736 12.1844C5.31114 11.6953 5.61244 11.0138 6.21504 9.65083L8.02668 5.55323C8.57457 4.314 8.84852 3.69438 9.37997 3.34719C9.91142 3 10.5859 3 11.935 3H14.0244C15.6632 3 16.4826 3 16.7916 3.53535C17.1007 4.0707 16.6942 4.78588 15.8811 6.21623L14.8092 8.10188C14.405 8.81295 14.2029 9.16849 14.2057 9.45952C14.2094 9.83775 14.4105 10.1862 14.7354 10.377C14.9854 10.5239 15.3927 10.5239 16.2074 10.5239C17.2373 10.5239 17.7523 10.5239 18.0205 10.7022C18.3689 10.9338 18.5513 11.3482 18.4874 11.7632C18.4382 12.0826 18.0918 12.4656 17.399 13.2317L11.8639 19.3523C10.7767 20.5545 10.2331 21.1556 9.86807 20.9654C9.50303 20.7751 9.67833 19.9822 10.0289 18.3962L10.7157 15.2896C10.9826 14.082 11.1161 13.4782 10.7951 13.0759C10.4741 12.6736 9.85877 12.6736 8.62814 12.6736Z"/>
			</svg>
			<h3 class="text-foreground font-medium text-xl md:text-2xl tracking-tight leading-none">
				Ready to Act On
			</h3>
		</div>
		<p class="text-gray-alpha-600 leading-relaxed text-lg text-pretty">
			Every prospect comes with context you can use today. Connection points, giving capacity, and
			outreach angles — not just raw data dumps.
		</p>
	</div>
</section>
