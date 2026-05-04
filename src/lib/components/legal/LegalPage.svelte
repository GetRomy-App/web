<script lang="ts">
	import '../../../app.css';
	import { onMount } from 'svelte';
	import { gsap } from '$lib/gsap';

	import Navbar from '$lib/components/landing/Navbar.svelte';
	import Footer from '$lib/components/landing/Footer.svelte';

	interface Props {
		title: string;
		description?: string;
		effective?: string;
		content: string;
		canonicalPath: string;
	}

	let { title, description = '', effective = '', content, canonicalPath }: Props = $props();

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

	function formatDate(d: string): string {
		if (!d) return '';
		const dt = new Date(d);
		if (isNaN(dt.getTime())) return d;
		return dt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
	}
</script>

<svelte:head>
	<title>{title} — Rōmy</title>
	<meta name="title" content="{title} — Rōmy" />
	{#if description}
		<meta name="description" content={description} />
	{/if}
	<meta name="robots" content="index, follow" />
	<meta property="og:title" content="{title} — Rōmy" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://getromy.app{canonicalPath}" />
	{#if description}
		<meta property="og:description" content={description} />
	{/if}
	<link rel="canonical" href="https://getromy.app{canonicalPath}" />
</svelte:head>

<Footer bind:footerText />

<Navbar />

<div bind:this={mainContent} class="main-content px-4 md:px-8 overflow-hidden">
	<div class="border-gray-alpha-100 flex min-h-screen flex-col items-center border-x">
		<article class="w-full">
			<header class="pt-40 md:pt-44 pb-10 px-4 md:px-8 border-gray-alpha-100 border-b max-w-3xl mx-auto w-full">
				<div class="post-meta mb-6 flex items-center gap-3 flex-wrap">
					<a
						href="/legal"
						class="text-gray-alpha-600 hover:text-foreground inline-flex items-center gap-1 text-sm font-medium transition-colors no-underline"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" class="size-3.5" aria-hidden="true">
							<path d="M15 6C15 6 9 10.4189 9 12C9 13.5812 15 18 15 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
						</svg>
						Legal
					</a>
					{#if effective}
						<span class="text-gray-alpha-400 text-xs select-none">//</span>
						<span class="text-gray-alpha-400 text-xs">
							Effective {formatDate(effective)}
						</span>
					{/if}
				</div>

				<h1 class="text-foreground text-3xl font-medium tracking-tight md:text-4xl">
					{title}
				</h1>
				{#if description}
					<p class="text-gray-alpha-600 text-base mt-3 max-w-2xl">{description}</p>
				{/if}
			</header>

			<div class="legal-content px-4 md:px-8 py-10 max-w-3xl mx-auto w-full">
				{@html content}
			</div>
		</article>
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

	.legal-content :global(h1),
	.legal-content :global(h2),
	.legal-content :global(h3),
	.legal-content :global(h4) {
		color: var(--foreground);
		font-weight: 500;
		letter-spacing: -0.01em;
		margin-top: 2rem;
		margin-bottom: 0.75rem;
		scroll-margin-top: 7rem;
	}
	.legal-content :global(h1) { font-size: 1.875rem; }
	.legal-content :global(h2) { font-size: 1.5rem; }
	.legal-content :global(h3) { font-size: 1.125rem; }
	.legal-content :global(h4) { font-size: 1rem; }

	.legal-content :global(p),
	.legal-content :global(li) {
		color: var(--ds-gray-alpha-600);
		line-height: 1.65;
		margin-bottom: 1rem;
	}

	.legal-content :global(strong) {
		color: var(--foreground);
		font-weight: 500;
	}

	.legal-content :global(ul),
	.legal-content :global(ol) {
		padding-left: 1.5rem;
		margin-bottom: 1rem;
	}

	.legal-content :global(li) {
		margin-bottom: 0.5rem;
	}

	.legal-content :global(li > p) {
		margin-bottom: 0.5rem;
	}

	.legal-content :global(code) {
		font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace;
		font-size: 0.875em;
		background: var(--ds-gray-alpha-100);
		padding: 0.15em 0.4em;
		border-radius: 4px;
	}

	.legal-content :global(pre) {
		background: var(--ds-gray-alpha-100);
		padding: 1rem 1.25rem;
		border-radius: 8px;
		overflow-x: auto;
		margin-bottom: 1.25rem;
	}

	.legal-content :global(pre code) {
		background: none;
		padding: 0;
	}

	.legal-content :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: 1.5rem;
		font-size: 0.92rem;
		display: block;
		overflow-x: auto;
	}

	.legal-content :global(th) {
		text-align: left;
		font-weight: 500;
		color: var(--foreground);
		padding: 0.65rem 0.85rem;
		border-bottom: 1px solid var(--ds-gray-alpha-200);
		white-space: nowrap;
	}

	.legal-content :global(td) {
		padding: 0.65rem 0.85rem;
		color: var(--ds-gray-alpha-600);
		border-bottom: 1px solid var(--ds-gray-alpha-100);
		vertical-align: top;
	}

	.legal-content :global(a) {
		color: var(--ds-blue-700);
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.legal-content :global(a:hover) {
		color: var(--ds-blue-600);
	}

	.legal-content :global(hr) {
		border: none;
		border-top: 1px solid var(--ds-gray-alpha-100);
		margin: 2rem 0;
	}

	.legal-content :global(blockquote) {
		border-left: 3px solid var(--ds-gray-alpha-200);
		padding-left: 1rem;
		color: var(--ds-gray-alpha-600);
		margin: 1rem 0;
	}
</style>
