<script lang="ts">
	import '../../app.css';
	import { onMount } from 'svelte';
	import { gsap } from '$lib/gsap';

	import Navbar from '$lib/components/landing/Navbar.svelte';
	import Footer from '$lib/components/landing/Footer.svelte';

	let { data } = $props();

	let mainContent: HTMLElement;
	let footerText: HTMLElement;

	// Order pages in a sensible reading order rather than alphabetical
	const ORDER = [
		'privacy',
		'prospect-privacy',
		'terms',
		'aup',
		'cookies',
		'subprocessors',
		'dpa',
		'security'
	];

	const URL_OVERRIDE: Record<string, string> = {
		'prospect-privacy': '/privacy/prospects'
	};

	const orderedPages = $derived(
		[...data.pages].sort((a, b) => {
			const ai = ORDER.indexOf(a.slug);
			const bi = ORDER.indexOf(b.slug);
			return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
		})
	);

	function urlFor(slug: string): string {
		return URL_OVERRIDE[slug] ?? `/${slug}`;
	}

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

<svelte:head>
	<title>Legal — Rōmy</title>
	<meta name="title" content="Legal — Rōmy" />
	<meta
		name="description"
		content="Privacy policy, terms, sub-processors, and other legal documents for Rōmy by GetRomy LLC."
	/>
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href="https://getromy.app/legal" />
	<meta property="og:title" content="Legal — Rōmy" />
	<meta property="og:url" content="https://getromy.app/legal" />
</svelte:head>

<Footer bind:footerText />

<Navbar />

<div bind:this={mainContent} class="main-content px-4 md:px-8 overflow-hidden">
	<div class="border-gray-alpha-100 flex min-h-screen flex-col items-center border-x">
		<div class="w-full max-w-3xl mx-auto pt-40 md:pt-44 pb-16 px-4 md:px-8">
			<header class="mb-10 border-gray-alpha-100 border-b pb-8">
				<h1 class="text-foreground text-3xl font-medium tracking-tight md:text-4xl">Legal</h1>
				<p class="text-gray-alpha-600 text-base mt-3 max-w-2xl">
					Policies and agreements for Rōmy. If you can't find what you need, email
					<a href="mailto:howard@getromy.app" class="underline underline-offset-2">howard@getromy.app</a>.
				</p>
			</header>

			<ul class="flex flex-col divide-y divide-gray-alpha-100">
				{#each orderedPages as page (page.slug)}
					<li>
						<a
							href={urlFor(page.slug)}
							class="group flex items-center justify-between gap-4 py-5 no-underline"
						>
							<div class="min-w-0">
								<h2
									class="text-foreground group-hover:text-ds-blue-700 text-base font-medium tracking-tight transition-colors"
								>
									{page.title}
								</h2>
								{#if page.description}
									<p class="text-gray-alpha-600 text-sm mt-1">{page.description}</p>
								{/if}
							</div>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								class="text-gray-alpha-400 size-4 shrink-0"
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
						</a>
					</li>
				{/each}
				<li>
					<a
						href="/privacy/request"
						class="group flex items-center justify-between gap-4 py-5 no-underline"
					>
						<div class="min-w-0">
							<h2
								class="text-foreground group-hover:text-ds-blue-700 text-base font-medium tracking-tight transition-colors"
							>
								Privacy rights request
							</h2>
							<p class="text-gray-alpha-600 text-sm mt-1">
								Access, erase, correct, or object to processing of your personal data — for customers and Prospects alike.
							</p>
						</div>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							class="text-gray-alpha-400 size-4 shrink-0"
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
					</a>
				</li>
			</ul>

			<div class="mt-12 text-gray-alpha-400 text-xs">
				GetRomy LLC · Contact:
				<a href="mailto:howard@getromy.app" class="underline underline-offset-2">howard@getromy.app</a>
				(general / privacy) ·
				<a href="mailto:solomon@getromy.app" class="underline underline-offset-2"
					>solomon@getromy.app</a
				>
				(technical / security)
			</div>
		</div>
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
