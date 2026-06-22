<script lang="ts">
	import type { DayCell } from '$lib/status/types';
	import { dayCellVar, formatUptime } from '$lib/status/ui';

	interface Props {
		days: DayCell[];
		/** How many trailing days to show (responsive — fewer on small screens). */
		maxDays?: number;
	}

	let { days, maxDays = 90 }: Props = $props();

	const visible = $derived(days.slice(-maxDays));

	function tooltip(cell: DayCell): string {
		const date = new Date(cell.date + 'T00:00:00Z').toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			timeZone: 'UTC'
		});
		if (cell.uptime === null) return `${date} — no data`;
		return `${date} — ${formatUptime(cell.uptime)} uptime`;
	}
</script>

<div class="uptime-strip" role="img" aria-label="{visible.length}-day uptime history">
	{#each visible as cell (cell.date)}
		<span class="bar" style="background-color: {dayCellVar(cell.state)};" title={tooltip(cell)}
		></span>
	{/each}
</div>

<style>
	.uptime-strip {
		display: flex;
		align-items: stretch;
		gap: 2px;
		width: 100%;
		height: 34px;
	}
	.bar {
		flex: 1 1 0;
		min-width: 0;
		border-radius: 2px;
		opacity: 0.9;
		transition:
			opacity 0.15s ease,
			transform 0.15s ease;
	}
	.bar:hover {
		opacity: 1;
		transform: scaleY(1.06);
	}
</style>
