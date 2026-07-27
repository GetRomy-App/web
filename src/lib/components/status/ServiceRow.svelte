<script lang="ts">
	import type { ServiceSummary } from '$lib/status/types';
	import { STATE_STYLES, formatUptime } from '$lib/status/ui';
	import UptimeBars from './UptimeBars.svelte';
	import Sparkline from './Sparkline.svelte';

	interface Props {
		summary: ServiceSummary;
		maxDays?: number;
	}

	let { summary, maxDays = 90 }: Props = $props();

	const style = $derived(STATE_STYLES[summary.state]);
	const windowLabel = $derived(`${Math.min(maxDays, summary.days.length)} days ago`);
	const showDependencies = $derived(
		summary.components.length > 0 || summary.health === 'unreachable'
	);
</script>

<div class="px-4 md:px-6 py-6">
	<div class="gap-4 flex items-start justify-between">
		<div class="min-w-0">
			<!-- eslint-disable svelte/no-navigation-without-resolve -->
			<a
				href={summary.url}
				target="_blank"
				rel="noreferrer"
				class="text-foreground hover:text-blue-700 gap-1.5 text-base font-medium tracking-tight inline-flex items-center no-underline transition-colors"
			>
				{summary.name}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="12"
					height="12"
					viewBox="0 0 24 24"
					fill="none"
					class="size-3 opacity-50"
					aria-hidden="true"
				>
					<path
						d="M7 17L17 7M17 7H8M17 7V16"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					></path>
				</svg>
			</a>
			<!-- eslint-enable svelte/no-navigation-without-resolve -->
			<p class="text-gray-alpha-600 mt-0.5 text-sm">{summary.description}</p>
		</div>

		<div class="gap-1 flex shrink-0 flex-col items-end">
			<span class="gap-1.5 inline-flex items-center {style.text} text-sm font-medium">
				<span class="size-2 rounded-full {style.dot}"></span>
				{style.label}
			</span>
			<span class="text-gray-alpha-400 gap-2 text-xs flex items-center tabular-nums">
				{#if summary.spark.length > 1}
					<span class="sm:block hidden"><Sparkline values={summary.spark} /></span>
				{/if}
				{#if summary.responseMs !== null}
					{summary.responseMs} ms
				{/if}
			</span>
		</div>
	</div>

	<div class="mt-4">
		<UptimeBars days={summary.days} {maxDays} />
		<div class="text-gray-alpha-400 mt-2 text-xs flex items-center justify-between">
			<span>{windowLabel}</span>
			<span class="text-gray-alpha-600 tabular-nums">
				{formatUptime(summary.uptime.d90)} uptime
			</span>
			<span>Today</span>
		</div>
	</div>

	<!-- Dependency checks reported by the service's own health endpoint — the
	     page can say which layer is hurting, not just "the homepage answers". -->
	{#if showDependencies}
		<div class="border-gray-alpha-100 mt-4 pt-3 border-t">
			<div class="mb-1 gap-2 flex items-center justify-between">
				<span class="text-gray-alpha-400 text-xs font-medium tracking-wide uppercase">
					Dependencies
				</span>
				{#if summary.health === 'unreachable'}
					<span
						class="text-gray-alpha-400 text-xs"
						title="This service's health endpoint isn't answering, so only the page itself is being checked right now."
					>
						Surface checks only
					</span>
				{/if}
			</div>
			{#if summary.components.length > 0}
				<ul class="m-0 p-0 list-none">
					{#each summary.components as component (component.id)}
						{@const componentStyle = STATE_STYLES[component.state]}
						<li class="gap-4 py-1.5 flex items-center justify-between">
							<span class="gap-2 min-w-0 flex items-center" title={component.description}>
								<span class="size-1.5 rounded-full {componentStyle.dot} shrink-0"></span>
								<span class="text-foreground text-sm truncate">{component.name}</span>
								<span class="sr-only">{componentStyle.label}</span>
							</span>
							<span
								class="text-gray-alpha-400 gap-3 text-xs flex shrink-0 items-center tabular-nums"
							>
								{#if component.responseMs !== null && component.state !== 'pending'}
									<span>{component.responseMs} ms</span>
								{/if}
								<span class="text-gray-alpha-600">{formatUptime(component.uptime.d90)}</span>
							</span>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="text-gray-alpha-400 m-0 text-xs">
					No dependency telemetry received yet — uptime above reflects the page only.
				</p>
			{/if}
		</div>
	{/if}
</div>
