<script lang="ts">
	import '../../app.css';
	import { onMount } from 'svelte';
	import { gsap, ScrollTrigger, SplitText } from '$lib/gsap';

	import Navbar from '$lib/components/landing/Navbar.svelte';
	import Footer from '$lib/components/landing/Footer.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Grid from '$lib/components/ui/Grid.svelte';
	import { PIF_OVERALL } from '$lib/benchmarks';

	let { data } = $props();

	let mainContent: HTMLElement;
	let footerText: HTMLElement;
	let heroTitle: HTMLElement;
	let heroDesc: HTMLElement;
	let heroBadge: HTMLElement;
	let benchmarksSection: HTMLElement;
	let blogSection: HTMLElement;

	function formatDate(dateStr: string): string {
		if (!dateStr) return '';
		const d = new Date(dateStr);
		return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
	}

	const comparisons = [
		{
			label: 'PIF-Bench Score',
			subtitle: 'Prospect Intelligence Fidelity — composite accuracy benchmark (0-100)',
			bars: PIF_OVERALL.bars.map(b => ({
				name: b.name,
				value: b.score,
				max: 100,
				display: String(b.score),
				color: b.highlight ? 'var(--ds-blue-700)' : 'var(--ds-gray-alpha-200)',
				pct: b.score
			}))
		},
		{
			label: 'Time per Prospect',
			subtitle: 'From first search to actionable report',
			bars: [
				{ name: 'Romy', value: 300, max: 2700, display: '30s – 10 min', color: 'var(--ds-blue-700)', pct: 12 },
				{ name: 'Enterprise Tools', value: 300, max: 2700, display: '~5 minutes', color: 'var(--ds-gray-alpha-200)', pct: 20 },
				{ name: 'Manual Research', value: 2700, max: 2700, display: '~45 minutes', color: 'var(--ds-gray-alpha-100)', pct: 100 }
			]
		},
		{
			label: 'Cost per Prospect',
			subtitle: 'Fully loaded cost including infrastructure',
			bars: [
				{ name: 'Romy', value: 0.10, max: 15, display: '$0.10', color: 'var(--ds-blue-700)', pct: 4 },
				{ name: 'Enterprise Tools', value: 10, max: 15, display: '$8 – $15', color: 'var(--ds-gray-alpha-200)', pct: 75 },
				{ name: 'Manual Research', value: 15, max: 15, display: '$50+', color: 'var(--ds-gray-alpha-100)', pct: 100 }
			]
		},
		{
			label: 'Annual Cost',
			subtitle: 'For a team researching ~200 prospects / month',
			bars: [
				{ name: 'Romy (Growth)', value: 290, max: 50000, display: '$290 / yr', color: 'var(--ds-blue-700)', pct: 4 },
				{ name: 'Romy (Scale)', value: 1990, max: 50000, display: '$1,990 / yr', color: '#4d7cff', pct: 8 },
				{ name: 'Enterprise Avg.', value: 30000, max: 50000, display: '$15K – $50K / yr', color: 'var(--ds-gray-alpha-200)', pct: 80 }
			]
		},
		{
			label: 'Report Depth',
			subtitle: 'Sections in a full donor intelligence report',
			bars: [
				{ name: 'Romy', value: 16, max: 16, display: '16 sections', color: 'var(--ds-blue-700)', pct: 100 },
				{ name: 'Enterprise Tools', value: 8, max: 16, display: '5 – 8 sections', color: 'var(--ds-gray-alpha-200)', pct: 50 },
				{ name: 'Generic AI', value: 4, max: 16, display: '3 – 5 sections', color: 'var(--ds-gray-alpha-100)', pct: 28 }
			]
		}
	];

	onMount(() => {
		let splits: SplitText[] = [];
		let mounted = true;

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

		const init = async () => {
			await document.fonts.ready;
			if (!mounted) return;

			// Hero
			const isMobile = window.innerWidth < 768;
			const titleSplit = new SplitText(heroTitle, {
				type: 'lines',
				mask: 'lines',
				linesClass: isMobile ? 'pb-1' : 'pb-4'
			});
			const descSplit = new SplitText(heroDesc, { type: 'lines', mask: 'lines' });
			splits.push(titleSplit, descSplit);

			const heroTl = gsap.timeline();
			heroTl
				.fromTo(heroBadge, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8, ease: 'custom-ease' })
				.fromTo(titleSplit.lines, { yPercent: 100 }, { yPercent: 0, duration: 1.2, stagger: 0.1, ease: 'custom-ease' }, '-=0.4')
				.fromTo(descSplit.lines, { yPercent: 100 }, { yPercent: 0, duration: 1.2, stagger: 0.1, ease: 'custom-ease' }, '-=1.0');
			gsap.set([heroTitle, heroDesc], { opacity: 1 });

			// Benchmark chart rows — animate bars on scroll
			const chartRows = benchmarksSection.querySelectorAll('.chart-row');
			chartRows.forEach((row, i) => {
				const labels = row.querySelectorAll('.chart-label, .chart-subtitle');
				if (labels.length) {
					const labelSplit = new SplitText(labels, { type: 'lines', mask: 'lines' });
					splits.push(labelSplit);
					gsap.fromTo(
						labelSplit.lines,
						{ yPercent: 100 },
						{
							scrollTrigger: { trigger: row, start: 'top 88%' },
							yPercent: 0,
							stagger: 0.08,
							duration: 1.0,
							ease: 'custom-ease'
						}
					);
				}

				const bars = row.querySelectorAll('.bar-fill');
				bars.forEach((bar, j) => {
					gsap.fromTo(
						bar,
						{ scaleX: 0 },
						{
							scrollTrigger: { trigger: row, start: 'top 85%' },
							scaleX: 1,
							duration: 1.2,
							ease: 'custom-ease',
							delay: j * 0.12
						}
					);
				});

				const barLabels = row.querySelectorAll('.bar-label');
				barLabels.forEach((label, j) => {
					gsap.fromTo(
						label,
						{ opacity: 0 },
						{
							scrollTrigger: { trigger: row, start: 'top 85%' },
							opacity: 1,
							duration: 0.6,
							ease: 'power2.out',
							delay: 0.6 + j * 0.12
						}
					);
				});
			});

			// Blog heading
			const blogHeading = blogSection.querySelector('h2');
			if (blogHeading) {
				const blogHeadSplit = new SplitText(blogHeading, { type: 'lines', mask: 'lines' });
				splits.push(blogHeadSplit);
				gsap.fromTo(
					blogHeadSplit.lines,
					{ yPercent: 100 },
					{
						scrollTrigger: { trigger: blogHeading, start: 'top 85%' },
						yPercent: 0,
						duration: 1.2,
						ease: 'custom-ease'
					}
				);
			}

			// Blog cards
			const blogCards = blogSection.querySelectorAll('.blog-card');
			blogCards.forEach((card, i) => {
				gsap.fromTo(
					card,
					{ opacity: 0, y: 30 },
					{
						scrollTrigger: { trigger: card, start: 'top 88%' },
						opacity: 1,
						y: 0,
						duration: 1.0,
						ease: 'custom-ease',
						delay: i * 0.1
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

<svelte:head>
	<title>Romy Labs — AI Donor Research Benchmarks, PIF-Bench Results & Blog</title>
	<meta
		name="description"
		content="Romy scored 94.6 on PIF-Bench vs. ChatGPT (79.9), Claude (92.2), and Gemini (76.0). See how purpose-built AI donor intelligence compares on accuracy, cost, and speed."
	/>
	<meta
		name="keywords"
		content="donor research benchmark, AI prospect research comparison, nonprofit fundraising AI, wealth screening accuracy, PIF-Bench, donor intelligence cost comparison, ChatGPT vs Romy, prospect research tool"
	/>
	<meta property="og:title" content="Romy Labs — AI Donor Research Benchmarks" />
	<meta property="og:description" content="PIF-Bench results: Romy 94.6, Claude 92.2, ChatGPT 79.9, Gemini 76.0. Open benchmarks for AI-powered prospect research." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://getromy.app/labs" />
	<link rel="canonical" href="https://getromy.app/labs" />
</svelte:head>

<Footer bind:footerText />

<Navbar />

<div bind:this={mainContent} class="main-content px-4 md:px-8 overflow-hidden">
	<div
		class="border-gray-alpha-100 divide-gray-alpha-100 flex min-h-screen flex-col items-center divide-y border-x"
	>
		<!-- Hero -->
		<section
			class="px-4 md:px-8 pt-48 md:pt-48 pb-16 md:pb-20 relative z-10 flex w-full flex-col items-center justify-center text-center"
		>
			<Grid />

			<div bind:this={heroBadge} class="mb-6 opacity-0">
				<span
					class="text-gray-alpha-600 border-gray-alpha-200 rounded-full border px-3 py-1 text-xs font-medium tracking-wide uppercase"
				>
					Labs
				</span>
			</div>

			<h1
				bind:this={heroTitle}
				class="text-foreground text-4xl font-medium tracking-tight md:text-5xl opacity-0"
			>
				Benchmarks & <span class="text-blue-700">insights.</span>
			</h1>

			<p
				bind:this={heroDesc}
				class="text-gray-alpha-600 max-w-xl text-lg leading-relaxed md:text-xl text-pretty opacity-0"
			>
				How purpose-built AI compares to enterprise tools and manual research.
				Open benchmarks, technical deep-dives, and lessons from the field.
			</p>
		</section>

		<!-- Benchmarks -->
		<section bind:this={benchmarksSection} class="w-full">
			<div class="px-4 md:px-8 py-8">
				<h2 class="text-foreground text-2xl font-medium tracking-tight md:text-3xl">
					Benchmarks
				</h2>
				<p class="text-gray-alpha-600 mt-2 text-lg leading-relaxed text-pretty">
					Romy vs. enterprise wealth screening platforms and manual prospect research.
				</p>
			</div>

			<div class="divide-gray-alpha-100 border-gray-alpha-100 divide-y border-t">
				{#each comparisons as comparison}
					<div class="chart-row px-4 md:px-8 py-8 flex flex-col gap-5">
						<div>
							<h3 class="chart-label text-foreground text-lg font-medium tracking-tight md:text-xl">
								{comparison.label}
							</h3>
							<p class="chart-subtitle text-gray-alpha-400 text-sm mt-0.5">
								{comparison.subtitle}
							</p>
						</div>

						<div class="flex flex-col gap-3">
							{#each comparison.bars as bar}
								<div class="flex items-center gap-3">
									<span class="text-gray-alpha-600 text-xs font-medium w-28 md:w-36 shrink-0 text-right">
										{bar.name}
									</span>
									<div class="relative flex-1 h-8 rounded-md overflow-hidden bg-gray-alpha-50">
										<div
											class="bar-fill absolute inset-y-0 left-0 rounded-md"
											style="width: {bar.pct}%; background: {bar.color}; transform-origin: left center;"
										></div>
										<span
											class="bar-label absolute inset-y-0 flex items-center text-xs font-medium tabular-nums opacity-0"
											style="left: calc({Math.min(bar.pct, 92)}% + 8px); color: {bar.pct > 50 ? 'transparent' : 'var(--foreground)'};"
										>
											{bar.display}
										</span>
										{#if bar.pct > 20}
											<span
												class="bar-label absolute inset-y-0 flex items-center text-xs font-medium tabular-nums opacity-0 px-3"
												style="left: 0; color: {bar.color === 'var(--ds-blue-700)' || bar.color === '#4d7cff' ? 'white' : 'var(--foreground)'};"
											>
												{bar.display}
											</span>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</section>

		<!-- Blog -->
		<section bind:this={blogSection} class="w-full">
			<div class="px-4 md:px-8 py-8">
				<h2 class="text-foreground text-2xl font-medium tracking-tight md:text-3xl">
					Blog
				</h2>
				<p class="text-gray-alpha-600 mt-2 text-lg leading-relaxed text-pretty">
					Technical deep-dives, research findings, and perspectives on nonprofit fundraising.
				</p>
			</div>

			<div class="divide-gray-alpha-100 border-gray-alpha-100 divide-y border-t">
				{#each data.posts as post}
					<a
						href="/labs/blog/{post.slug}"
						class="blog-card group px-4 md:px-8 py-8 flex flex-col gap-3 opacity-0 transition-colors hover:bg-gray-alpha-50 cursor-pointer block no-underline"
					>
						<div class="flex items-center gap-3">
							<span
								class="text-gray-alpha-600 border-gray-alpha-200 rounded-full border px-2.5 py-0.5 text-xs font-medium"
							>
								{post.tag}
							</span>
							<span class="text-gray-alpha-400 text-xs">
								{formatDate(post.date)}
							</span>
						</div>
						<h3
							class="text-foreground text-xl font-medium tracking-tight md:text-2xl group-hover:text-blue-700 transition-colors"
						>
							{post.title}
						</h3>
						<p class="text-gray-alpha-600 max-w-2xl text-base leading-relaxed text-pretty">
							{post.excerpt}
						</p>
						<div class="mt-1">
							<span
								class="text-gray-alpha-600 group-hover:text-foreground inline-flex items-center gap-1 text-sm font-medium transition-colors"
							>
								Read more
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									class="size-3.5 transition-transform group-hover:translate-x-0.5"
									aria-hidden="true"
								>
									<path
										d="M9 6C9 6 15 10.4189 15 12C15 13.5812 9 18 9 18"
										stroke="currentColor"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									></path>
								</svg>
							</span>
						</div>
					</a>
				{/each}
			</div>
		</section>

		<!-- CTA -->
		<section class="px-4 md:px-8 py-8 relative flex w-full flex-col">
			<Grid />
			<div class="flex flex-col items-start justify-center">
				<h2 class="mb-4 text-2xl font-medium tracking-tight md:text-4xl text-left">
					Want to run your own benchmarks?
				</h2>
				<p
					class="text-gray-alpha-600 mb-8 max-w-xl text-lg leading-relaxed md:text-xl text-left text-pretty"
				>
					Try Romy on your own prospect list. See how purpose-built donor intelligence
					compares to your current workflow.
				</p>
			</div>

			<div class="flex flex-wrap items-center gap-3">
				<Button href="https://intel.getromy.app" target="_blank" rel="noreferrer" class="w-fit">
					Get Started
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						class="size-4"
						aria-hidden="true"
					>
						<path
							d="M9 6C9 6 15 10.4189 15 12C15 13.5812 9 18 9 18"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						></path>
					</svg>
				</Button>
				<Button variant="secondary" href="/" class="w-fit">
					Back to Home
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						class="size-4"
						aria-hidden="true"
					>
						<path
							d="M9 6C9 6 15 10.4189 15 12C15 13.5812 9 18 9 18"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						></path>
					</svg>
				</Button>
			</div>
		</section>
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
