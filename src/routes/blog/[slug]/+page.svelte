<script lang="ts">
	import '../../../app.css';
	import { onMount } from 'svelte';
	import { gsap, SplitText } from '$lib/gsap';

	import Navbar from '$lib/components/landing/Navbar.svelte';
	import Footer from '$lib/components/landing/Footer.svelte';
	import { PIF_HEADLINE, PIF_DIMENSIONS, EVAL_PROMPT, PIF_METHOD_NOTE, PIF_REPO, PIF_VERSION } from '$lib/benchmarks';

	import { toMetaDescription } from '$lib/seo';
	import Seo from '$lib/components/Seo.svelte';
	let { data } = $props();

	let mainContent: HTMLElement;
	let footerText: HTMLElement;
	let articleHeader: HTMLElement;
	let articleBody: HTMLElement;
	let chartsSection: HTMLElement;

	function formatDate(dateStr: string): string {
		if (!dateStr) return '';
		const d = new Date(dateStr);
		return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
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

			const headerSplit = new SplitText(articleHeader.querySelector('h1'), {
				type: 'lines',
				mask: 'lines'
			});
			splits.push(headerSplit);

			const tl = gsap.timeline();
			tl.fromTo(
				articleHeader.querySelector('.post-meta'),
				{ opacity: 0, y: 10 },
				{ opacity: 1, y: 0, duration: 0.8, ease: 'custom-ease' }
			)
				.fromTo(
					headerSplit.lines,
					{ yPercent: 100 },
					{ yPercent: 0, duration: 1.2, stagger: 0.1, ease: 'custom-ease' },
					'-=0.4'
				)
				.fromTo(
					articleBody,
					{ opacity: 0, y: 20 },
					{ opacity: 1, y: 0, duration: 1.0, ease: 'custom-ease' },
					'-=0.6'
				);

			if (chartsSection) {
				const chartRows = chartsSection.querySelectorAll('.bench-chart-row');
				chartRows.forEach((row) => {
					const bars = row.querySelectorAll('.bench-bar-fill');
					bars.forEach((bar, j) => {
						gsap.fromTo(
							bar,
							{ scaleX: 0 },
							{
								scrollTrigger: { trigger: row, start: 'top 88%' },
								scaleX: 1,
								duration: 1.2,
								ease: 'custom-ease',
								delay: j * 0.1
							}
						);
					});

					const labels = row.querySelectorAll('.bench-bar-value');
					labels.forEach((label, j) => {
						gsap.fromTo(
							label,
							{ opacity: 0 },
							{
								scrollTrigger: { trigger: row, start: 'top 88%' },
								opacity: 1,
								duration: 0.5,
								ease: 'power2.out',
								delay: 0.7 + j * 0.1
							}
						);
					});
				});
			}
		};

		init();

		return () => {
			mounted = false;
			splits.forEach((s) => s.revert());
		};
	});
</script>

<Seo
	title="{data.post.title} — Rōmy Blog"
	description={data.post.excerpt}
	ogTitle={data.post.title}
	path="/blog/{data.post.slug}"
	type="article"
	publishedTime={data.post.date}
	section={data.post.tag}
	keywords="donor intelligence, nonprofit fundraising, prospect research, AI donor research, wealth screening, {data.post.tag.toLowerCase()}"
	jsonLd={[
		{
			'@context': 'https://schema.org',
			'@type': 'BlogPosting',
			'@id': `https://getromy.app/blog/${data.post.slug}#article`,
			headline: data.post.title,
			description: toMetaDescription(data.post.excerpt, 300),
			datePublished: data.post.date,
			dateModified: data.post.date,
			articleSection: data.post.tag,
			image: 'https://getromy.app/og-image.jpg',
			inLanguage: 'en-US',
			url: `https://getromy.app/blog/${data.post.slug}`,
			mainEntityOfPage: `https://getromy.app/blog/${data.post.slug}`,
			author: { '@id': 'https://getromy.app/#organization' },
			publisher: { '@id': 'https://getromy.app/#organization' },
			isPartOf: { '@type': 'Blog', name: 'Rōmy Blog', url: 'https://getromy.app/blog' }
		},
		{
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Rōmy', item: 'https://getromy.app/' },
				{ '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://getromy.app/blog' },
				{
					'@type': 'ListItem',
					position: 3,
					name: data.post.title,
					item: `https://getromy.app/blog/${data.post.slug}`
				}
			]
		}
	]}
/>

<Footer bind:footerText />

<Navbar />

<div bind:this={mainContent} class="main-content px-4 md:px-8 overflow-hidden">
	<div class="border-gray-alpha-100 flex min-h-screen flex-col items-center border-x">
		<article class="w-full">
			<!-- Header -->
			<header
				bind:this={articleHeader}
				class="pt-48 md:pt-48 pb-12 px-4 md:px-8 border-gray-alpha-100 border-b max-w-3xl mx-auto"
			>
				<div class="post-meta mb-6 flex items-center gap-3 opacity-0">
					<a
						href="/blog"
						class="text-gray-alpha-600 hover:text-foreground inline-flex items-center gap-1 text-sm font-medium transition-colors no-underline"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" class="size-3.5" aria-hidden="true">
							<path d="M15 6C15 6 9 10.4189 9 12C9 13.5812 15 18 15 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
						</svg>
						Blog
					</a>
					<span class="text-gray-alpha-400 text-xs select-none">//</span>
					<span class="text-gray-alpha-600 border-gray-alpha-200 rounded-full border px-2.5 py-0.5 text-xs font-medium">
						{data.post.tag}
					</span>
					<span class="text-gray-alpha-400 text-xs">
						{formatDate(data.post.date)}
					</span>
				</div>

				<h1 class="text-foreground text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl">
					{data.post.title}
				</h1>
			</header>

			<!-- Body -->
			<div
				bind:this={articleBody}
				class="article-content px-4 md:px-8 py-12 opacity-0 max-w-3xl mx-auto"
			>
				{@html data.post.content}
			</div>

			<!-- Benchmark Charts (only for posts with has_benchmarks) -->
			{#if data.post.has_benchmarks}
				<div bind:this={chartsSection} class="border-gray-alpha-100 border-t">
					<div class="px-4 md:px-8 py-10 max-w-4xl mx-auto">
						<h2 class="text-foreground text-2xl font-medium tracking-tight md:text-3xl mb-2">
							Results
						</h2>
						<p class="text-gray-alpha-400 text-sm mb-8">
							{PIF_VERSION} — higher is better
						</p>

						{#each PIF_HEADLINE as chart}
							<div class="bench-chart-row flex flex-col gap-3 mb-12">
								<h3 class="text-foreground text-base font-medium tracking-tight mb-1">
									{chart.label}
								</h3>
								<p class="text-gray-alpha-400 text-xs mb-2">{chart.subtitle}</p>
								{#each chart.bars as bar}
									<div class="flex items-center gap-3">
										<span class="text-gray-alpha-600 text-xs font-medium w-24 md:w-32 shrink-0 text-right">
											{bar.name}
										</span>
										<div class="relative flex-1 h-9 rounded-md overflow-hidden bg-gray-alpha-50">
											<div
												class="bench-bar-fill absolute inset-y-0 left-0 rounded-md"
												style="width: {bar.score}%; background: {bar.highlight ? 'var(--ds-blue-700)' : 'var(--ds-gray-alpha-200)'}; transform-origin: left center;"
											></div>
											<span
												class="bench-bar-value absolute inset-y-0 flex items-center text-sm font-medium tabular-nums px-3"
												style="left: 0; color: {bar.highlight ? 'white' : 'var(--foreground)'};"
											>
												{bar.score}%
											</span>
										</div>
									</div>
								{/each}
							</div>
						{/each}

						<h3 class="text-foreground text-lg font-medium tracking-tight mb-2">
							Packet track by area
						</h3>
						<p class="text-gray-alpha-400 text-xs mb-6">Share of each area's tasks completed with every check met.</p>

						<div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
							{#each PIF_DIMENSIONS as dim}
								<div class="bench-chart-row flex flex-col gap-2">
									<h4 class="text-foreground text-sm font-medium tracking-tight">{dim.label}</h4>
									<p class="text-gray-alpha-400 text-xs mb-1">{dim.subtitle}</p>
									{#each dim.bars as bar}
										<div class="flex items-center gap-2">
											<span class="text-gray-alpha-600 text-[11px] font-medium w-24 md:w-28 shrink-0 text-right">
												{bar.name}
											</span>
											<div class="relative flex-1 h-6 rounded overflow-hidden bg-gray-alpha-50">
												<div
													class="bench-bar-fill absolute inset-y-0 left-0 rounded"
													style="width: {bar.score}%; background: {bar.highlight ? 'var(--ds-blue-700)' : 'var(--ds-gray-alpha-200)'}; transform-origin: left center;"
												></div>
												<span
													class="bench-bar-value absolute inset-y-0 flex items-center text-[11px] font-medium tabular-nums px-2"
													style="left: 0; color: {bar.highlight ? 'white' : 'var(--foreground)'};"
												>
													{bar.score}%
												</span>
											</div>
										</div>
									{/each}
								</div>
							{/each}
						</div>

						<div class="mt-12 border-gray-alpha-100 border-t pt-8">
							<h3 class="text-foreground text-base font-medium tracking-tight mb-3">
								An example live-track prompt
							</h3>
							<div class="bg-gray-alpha-50 rounded-lg p-4 text-sm text-gray-alpha-600 leading-relaxed font-mono whitespace-pre-wrap">
								{EVAL_PROMPT}
							</div>
							<p class="text-gray-alpha-400 text-xs mt-6 leading-relaxed">
								{PIF_METHOD_NOTE}
								<a href={PIF_REPO} class="underline hover:text-foreground">Read the rubrics and every verdict on GitHub.</a>
							</p>
						</div>
					</div>
				</div>
			{/if}

			<!-- Back link -->
			<div class="px-4 md:px-8 pb-16 border-gray-alpha-100 border-t pt-8 max-w-3xl mx-auto">
				<a
					href="/blog"
					class="text-gray-alpha-600 hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium transition-colors no-underline"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" class="size-3.5" aria-hidden="true">
						<path d="M15 6C15 6 9 10.4189 9 12C9 13.5812 15 18 15 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
					</svg>
					Back to Blog
				</a>
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

	.article-content :global(h1) {
		font-size: 2rem;
		font-weight: 500;
		letter-spacing: -0.02em;
		color: var(--foreground);
		margin-top: 2.5rem;
		margin-bottom: 1rem;
		line-height: 1.2;
	}

	.article-content :global(h1:first-child) {
		display: none;
	}

	.article-content :global(h2) {
		font-size: 1.5rem;
		font-weight: 500;
		letter-spacing: -0.02em;
		color: var(--foreground);
		margin-top: 2.5rem;
		margin-bottom: 0.75rem;
		line-height: 1.3;
	}

	.article-content :global(h3) {
		font-size: 1.25rem;
		font-weight: 500;
		letter-spacing: -0.01em;
		color: var(--foreground);
		margin-top: 2rem;
		margin-bottom: 0.5rem;
		line-height: 1.4;
	}

	.article-content :global(p) {
		font-size: 1.125rem;
		line-height: 1.75;
		color: var(--ds-gray-alpha-600);
		margin-bottom: 1.25rem;
	}

	.article-content :global(strong) {
		color: var(--foreground);
		font-weight: 500;
	}

	.article-content :global(ul),
	.article-content :global(ol) {
		margin-bottom: 1.25rem;
		padding-left: 1.5rem;
	}

	.article-content :global(ul) {
		list-style-type: disc;
	}

	.article-content :global(ol) {
		list-style-type: decimal;
	}

	.article-content :global(li) {
		font-size: 1.125rem;
		line-height: 1.75;
		color: var(--ds-gray-alpha-600);
		margin-bottom: 0.5rem;
	}

	.article-content :global(li strong) {
		color: var(--foreground);
	}

	.article-content :global(blockquote) {
		border-left: 2px solid var(--ds-blue-700);
		padding-left: 1rem;
		margin: 1.5rem 0;
	}

	.article-content :global(blockquote p) {
		color: var(--ds-gray-alpha-600);
		font-style: italic;
	}

	.article-content :global(code) {
		font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace;
		font-size: 0.875em;
		background: var(--ds-gray-alpha-100);
		padding: 0.15em 0.4em;
		border-radius: 4px;
	}

	.article-content :global(pre) {
		background: var(--ds-gray-alpha-100);
		padding: 1rem 1.25rem;
		border-radius: 8px;
		overflow-x: auto;
		margin-bottom: 1.25rem;
	}

	.article-content :global(pre code) {
		background: none;
		padding: 0;
	}

	.article-content :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: 1.5rem;
		font-size: 0.95rem;
	}

	.article-content :global(th) {
		text-align: left;
		font-weight: 500;
		color: var(--foreground);
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--ds-gray-alpha-200);
	}

	.article-content :global(td) {
		padding: 0.75rem 1rem;
		color: var(--ds-gray-alpha-600);
		border-bottom: 1px solid var(--ds-gray-alpha-100);
	}

	.article-content :global(a) {
		color: var(--ds-blue-700);
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.article-content :global(a:hover) {
		color: var(--ds-blue-600);
	}

	.article-content :global(hr) {
		border: none;
		border-top: 1px solid var(--ds-gray-alpha-100);
		margin: 2rem 0;
	}
</style>
