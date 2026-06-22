<script lang="ts">
	interface Props {
		/** Response times in ms, oldest first. 0 marks a failed probe. */
		values: number[];
		width?: number;
		height?: number;
	}

	let { values, width = 96, height = 28 }: Props = $props();

	const PAD = 2;

	const path = $derived.by(() => {
		const pts = values.filter((v) => v > 0);
		if (pts.length === 0) return '';
		const max = Math.max(...pts);
		const min = Math.min(...pts);
		const range = max - min || 1;
		const innerW = width - PAD * 2;
		const innerH = height - PAD * 2;
		const n = values.length;
		return values
			.map((v, i) => {
				const x = PAD + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW);
				// Higher response time sits higher on the chart.
				const norm = v > 0 ? (v - min) / range : 0;
				const y = PAD + innerH - norm * innerH;
				return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
			})
			.join(' ');
	});
</script>

{#if path}
	<svg
		{width}
		{height}
		viewBox="0 0 {width} {height}"
		fill="none"
		aria-hidden="true"
		class="overflow-visible"
	>
		<path
			d={path}
			stroke="var(--ds-blue-700)"
			stroke-width="1.5"
			stroke-linejoin="round"
			stroke-linecap="round"
			opacity="0.85"
		/>
	</svg>
{/if}
