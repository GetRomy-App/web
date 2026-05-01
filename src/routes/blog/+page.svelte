<script lang="ts">
	import '../../app.css';
	import { onMount } from 'svelte';
	import { gsap, ScrollTrigger, SplitText } from '$lib/gsap';

	import Navbar from '$lib/components/landing/Navbar.svelte';
	import Footer from '$lib/components/landing/Footer.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Grid from '$lib/components/ui/Grid.svelte';

	let { data } = $props();

	let mainContent: HTMLElement;
	let footerText: HTMLElement;
	let heroTitle: HTMLElement;
	let heroDesc: HTMLElement;
	let heroBadge: HTMLElement;
	let blogSection: HTMLElement;

	function formatDate(dateStr: string): string {
		if (!dateStr) return '';
		const d = new Date(dateStr);
		return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
	}

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
	<title>Romy Blog — Insights on AI Donor Research & Nonprofit Fundraising</title>
	<meta
		name="description"
		content="Technical deep-dives, research findings, and perspectives on nonprofit fundraising, prospect research, and purpose-built AI."
	/>
	<meta
		name="keywords"
		content="nonprofit fundraising blog, donor intelligence, prospect research, AI for nonprofits, fundraising insights"
	/>
	<meta property="og:title" content="Romy Blog — Insights on AI Donor Research & Nonprofit Fundraising" />
	<meta property="og:description" content="Technical deep-dives, research findings, and perspectives on nonprofit fundraising." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://getromy.app/blog" />
	<link rel="canonical" href="https://getromy.app/blog" />
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
					Blog
				</span>
			</div>

			<h1
				bind:this={heroTitle}
				class="text-foreground text-4xl font-medium tracking-tight md:text-5xl opacity-0"
			>
				Writing & <span class="text-blue-700">research.</span>
			</h1>

			<p
				bind:this={heroDesc}
				class="text-gray-alpha-600 max-w-xl text-lg leading-relaxed md:text-xl text-pretty opacity-0"
			>
				Technical deep-dives, research findings, and perspectives on
				nonprofit fundraising and AI donor intelligence.
			</p>
		</section>

		<!-- Posts -->
		<section bind:this={blogSection} class="w-full">
			<div class="divide-gray-alpha-100 divide-y">
				{#each data.posts as post}
					<a
						href="/blog/{post.slug}"
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
					Ready to find your next major donor?
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
