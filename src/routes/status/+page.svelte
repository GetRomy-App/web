<script lang="ts">
	import '../../app.css';
	import { onMount } from 'svelte';
	import { gsap } from '$lib/gsap';

	import Navbar from '$lib/components/landing/Navbar.svelte';
	import Footer from '$lib/components/landing/Footer.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Grid from '$lib/components/ui/Grid.svelte';
	import ServiceRow from '$lib/components/status/ServiceRow.svelte';
	import IncidentItem from '$lib/components/status/IncidentItem.svelte';

	import { summarize, computeOverall } from '$lib/status/compute';
	import { OVERALL_STYLES, relativeTime } from '$lib/status/ui';
	import type { HistoryDoc, ServiceSummary, OverallStatus } from '$lib/status/types';
	import { productUrl } from '$lib/release';
	import { contactModal } from '$lib/stores/contact.svelte';

	let { data } = $props();

	// The prerendered load data is stable for this page instance; capture it once
	// so seeding $state from it doesn't trip the "reference captures initial value"
	// lint. Live freshness comes from refresh() below, not from `data` changing.
	// svelte-ignore state_referenced_locally
	const seed = data;

	// Live, refreshable state — seeded from the prerendered snapshot.
	let summaries = $state<ServiceSummary[]>(seed.summaries);
	let overall = $state<OverallStatus>(seed.overall);
	let generatedAt = $state<string>(seed.generatedAt);
	let now = $state<number>(seed.now);
	let live = $state(false);
	let maxDays = $state(90);

	let mainContent: HTMLElement;
	let footerText: HTMLElement;

	const activeIncidents = $derived(data.incidents.filter((i) => i.active));
	const pastIncidents = $derived(data.incidents.filter((i) => !i.active));
	const overallStyle = $derived(OVERALL_STYLES[overall.level]);
	const generatedMs = $derived(generatedAt ? new Date(generatedAt).getTime() : null);
	const serviceNames = $derived(
		Object.fromEntries(data.services.map((s) => [s.id, s.name])) as Record<string, string>
	);

	// Preserve config order while grouping services by their "group".
	const groups = $derived.by(() => {
		const order: string[] = [];
		const byGroup: Record<string, ServiceSummary[]> = {};
		for (const s of summaries) {
			if (!byGroup[s.group]) {
				byGroup[s.group] = [];
				order.push(s.group);
			}
			byGroup[s.group].push(s);
		}
		return order.map((name) => ({ name, items: byGroup[name] }));
	});

	const isOperational = $derived(overall.level === 'operational');

	async function refresh() {
		try {
			const res = await fetch(`${data.rawHistoryUrl}?t=${Date.now()}`, {
				cache: 'no-store',
				headers: { Accept: 'application/json' }
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const doc = (await res.json()) as HistoryDoc;
			const clientNow = Date.now();
			const fresh = summarize(data.services, doc, clientNow);
			summaries = fresh;
			overall = computeOverall(fresh, activeIncidents);
			generatedAt = doc.generatedAt ?? generatedAt;
			now = clientNow;
			live = true;
		} catch {
			// Keep the last good data; the page still shows the build-time snapshot.
			live = false;
		}
	}

	function updateMaxDays() {
		const w = window.innerWidth;
		maxDays = w < 640 ? 30 : w < 900 ? 60 : 90;
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
				scrollTrigger: { trigger: mainContent, start: 'bottom 90%', end: 'bottom 70%', scrub: true }
			}
		);

		updateMaxDays();
		window.addEventListener('resize', updateMaxDays);

		now = Date.now();
		refresh();
		const refreshTimer = setInterval(refresh, 60_000);
		const tickTimer = setInterval(() => (now = Date.now()), 15_000);

		return () => {
			window.removeEventListener('resize', updateMaxDays);
			clearInterval(refreshTimer);
			clearInterval(tickTimer);
		};
	});
</script>

<svelte:head>
	<title>Status — Rōmy</title>
	<meta name="title" content="Status — Rōmy" />
	<meta
		name="description"
		content="Live operational status and uptime history for Rōmy — the donor-intelligence app at intel.getromy.app and getromy.app."
	/>
	<meta property="og:title" content="Status — Rōmy" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://getromy.app/status" />
	<meta property="og:description" content="Live operational status and uptime history for Rōmy." />
	<meta property="og:image" content="https://getromy.app/og-image.jpg" />
	<meta name="twitter:card" content="summary_large_image" />
	<link rel="canonical" href="https://getromy.app/status" />
</svelte:head>

<Footer bind:footerText />

<Navbar />

<div bind:this={mainContent} class="main-content px-4 md:px-8 overflow-hidden">
	<div class="border-gray-alpha-100 flex min-h-screen flex-col items-center border-x">
		<!-- Hero / overall status -->
		<section
			class="px-4 md:px-8 pt-40 md:pt-44 pb-14 relative z-10 flex w-full flex-col items-center text-center"
		>
			<Grid />

			<div class="mb-6">
				<span
					class="text-gray-alpha-600 border-gray-alpha-200 px-3 py-1 text-xs font-medium tracking-wide rounded-full border uppercase"
				>
					System Status
				</span>
			</div>

			<div class="gap-3 flex items-center justify-center">
				<span
					class="status-dot {overallStyle.dot}"
					class:is-pulsing={isOperational}
					style="--dot-color: {overallStyle.cssVar};"
					aria-hidden="true"
				></span>
				<h1
					class="text-foreground text-3xl font-medium tracking-tight md:text-5xl {overallStyle.text}"
				>
					{overall.label}
				</h1>
			</div>

			<p class="text-gray-alpha-600 mt-5 max-w-xl text-base leading-relaxed md:text-lg text-pretty">
				The systems behind Rōmy's donor intelligence — monitored continuously, reported honestly.
			</p>

			<div
				class="text-gray-alpha-400 mt-6 gap-x-2 gap-y-1 text-xs flex flex-wrap items-center justify-center"
			>
				<span class="tabular-nums">Updated {relativeTime(generatedMs, now)}</span>
				<span class="select-none">·</span>
				<span>Checked automatically every ~10 min</span>
				{#if live}
					<span class="select-none">·</span>
					<span class="text-green-600 gap-1 inline-flex items-center">
						<span class="size-1.5 bg-green-600 rounded-full"></span>
						Live
					</span>
				{/if}
			</div>
		</section>

		<!-- Active incidents -->
		{#if activeIncidents.length}
			<section class="border-gray-alpha-100 px-4 md:px-8 py-10 w-full border-t">
				<div class="max-w-3xl mx-auto w-full">
					<h2 class="text-foreground mb-4 text-sm font-medium tracking-wide uppercase">
						Active {activeIncidents.length === 1 ? 'incident' : 'incidents'}
					</h2>
					<div class="gap-4 flex flex-col">
						{#each activeIncidents as incident (incident.slug)}
							<IncidentItem {incident} {serviceNames} />
						{/each}
					</div>
				</div>
			</section>
		{/if}

		<!-- Services -->
		<section class="border-gray-alpha-100 px-4 md:px-8 py-12 w-full border-t">
			<div class="max-w-3xl mx-auto w-full">
				<div class="mb-5 flex items-center justify-between">
					<h2 class="text-foreground text-lg font-medium tracking-tight">Services</h2>
					<div class="text-gray-alpha-400 gap-3 text-xs flex items-center">
						<span class="gap-1.5 inline-flex items-center">
							<span class="size-2 bg-green-600 rounded-full"></span> Operational
						</span>
						<span class="gap-1.5 inline-flex items-center">
							<span class="size-2 bg-amber-800 rounded-full"></span> Degraded
						</span>
						<span class="gap-1.5 inline-flex items-center">
							<span class="size-2 bg-red-600 rounded-full"></span> Down
						</span>
					</div>
				</div>

				<div class="gap-8 flex flex-col">
					{#each groups as group (group.name)}
						<div>
							{#if groups.length > 1}
								<h3 class="text-gray-alpha-600 mb-2 text-xs font-medium tracking-wide uppercase">
									{group.name}
								</h3>
							{/if}
							<div
								class="border-gray-alpha-100 divide-gray-alpha-100 card-highlight rounded-2xl divide-y overflow-hidden border"
							>
								{#each group.items as summary (summary.id)}
									<ServiceRow {summary} {maxDays} />
								{/each}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<!-- Incident history -->
		<section class="border-gray-alpha-100 px-4 md:px-8 py-12 w-full border-t">
			<div class="max-w-3xl mx-auto w-full">
				<h2 class="text-foreground mb-5 text-lg font-medium tracking-tight">Incident history</h2>
				{#if pastIncidents.length}
					<div class="gap-4 flex flex-col">
						{#each pastIncidents as incident (incident.slug)}
							<IncidentItem {incident} {serviceNames} />
						{/each}
					</div>
				{:else}
					<div
						class="border-gray-alpha-100 text-gray-alpha-600 rounded-2xl px-6 py-10 text-sm border border-dashed text-center"
					>
						No incidents reported in the last 90 days.
					</div>
				{/if}
			</div>
		</section>

		<!-- Footer note / CTA -->
		<section class="border-gray-alpha-100 px-4 md:px-8 py-12 relative w-full border-t">
			<Grid />
			<div class="max-w-3xl mx-auto w-full">
				<h2 class="text-foreground mb-3 text-2xl font-medium tracking-tight md:text-3xl">
					Built to be there when you ask.
				</h2>
				<p
					class="text-gray-alpha-600 mb-8 max-w-xl text-base leading-relaxed md:text-lg text-pretty"
				>
					Fundraising doesn't wait for office hours. This page is driven by an automated monitor
					that probes every service continuously — no manual refresh, no spin.
				</p>
				<div class="gap-3 flex flex-wrap items-center">
					<Button href={productUrl} target="_blank" rel="noreferrer" class="w-fit">
						Open Rōmy
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
					<Button variant="secondary" onclick={() => contactModal.show('issue')} class="w-fit">
						Report an issue
					</Button>
				</div>
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

	.status-dot {
		position: relative;
		width: 0.85rem;
		height: 0.85rem;
		border-radius: 9999px;
		flex-shrink: 0;
	}

	.status-dot.is-pulsing::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: 9999px;
		background: var(--dot-color);
		animation: status-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
	}

	@keyframes status-ping {
		0% {
			transform: scale(1);
			opacity: 0.6;
		}
		75%,
		100% {
			transform: scale(2.4);
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.status-dot.is-pulsing::after {
			animation: none;
		}
	}
</style>
