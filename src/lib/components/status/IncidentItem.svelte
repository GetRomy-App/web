<script lang="ts">
	import type { Incident } from '$lib/status/types';
	import { severityStyle, severityLabel, incidentStatusLabel } from '$lib/status/ui';

	interface Props {
		incident: Incident;
		/** Map of service id -> display name, for the "affected" chips. */
		serviceNames: Record<string, string>;
	}

	let { incident, serviceNames }: Props = $props();

	const sev = $derived(severityStyle(incident.severity));

	function fmt(iso: string): string {
		if (!iso) return '';
		const d = new Date(iso);
		if (isNaN(d.getTime())) return iso;
		return d.toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		});
	}

	const affectedNames = $derived(
		incident.affected.map((id) => serviceNames[id] ?? id).filter(Boolean)
	);
</script>

<article
	class="border-gray-alpha-100 rounded-xl p-5 border {incident.active
		? 'card-highlight bg-gray-alpha-50'
		: ''}"
>
	<div class="gap-2 flex flex-wrap items-center">
		<span
			class="gap-1.5 border-gray-alpha-200 px-2.5 py-0.5 text-xs font-medium inline-flex items-center rounded-full border {sev.text}"
		>
			<span class="size-1.5 rounded-full {sev.dot}"></span>
			{severityLabel(incident.severity)}
		</span>
		<span
			class="text-gray-alpha-600 border-gray-alpha-200 px-2.5 py-0.5 text-xs font-medium rounded-full border"
		>
			{incidentStatusLabel(incident.status)}
		</span>
		{#if incident.active}
			<span class="text-amber-800 text-xs font-medium">● Ongoing</span>
		{/if}
	</div>

	<h3 class="text-foreground mt-3 text-lg font-medium tracking-tight">{incident.title}</h3>

	<div class="text-gray-alpha-400 mt-1 gap-x-2 gap-y-1 text-xs flex flex-wrap items-center">
		<span>{fmt(incident.date)}</span>
		{#if incident.resolved}
			<span aria-hidden="true">→</span>
			<span>{fmt(incident.resolved)}</span>
		{/if}
		{#if affectedNames.length}
			<span class="text-gray-alpha-400 select-none">·</span>
			<span>Affected: {affectedNames.join(', ')}</span>
		{/if}
	</div>

	{#if incident.content}
		<div class="incident-body mt-3 text-sm">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html incident.content}
		</div>
	{/if}
</article>

<style>
	.incident-body :global(p),
	.incident-body :global(li) {
		color: var(--ds-gray-alpha-600);
		line-height: 1.6;
		margin-bottom: 0.5rem;
	}
	.incident-body :global(strong) {
		color: var(--foreground);
		font-weight: 500;
	}
	.incident-body :global(ul),
	.incident-body :global(ol) {
		padding-left: 1.25rem;
		margin-bottom: 0.5rem;
	}
	.incident-body :global(a) {
		color: var(--ds-blue-700);
		text-decoration: underline;
		text-underline-offset: 2px;
	}
	.incident-body :global(code) {
		font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace;
		font-size: 0.85em;
		background: var(--ds-gray-alpha-100);
		padding: 0.1em 0.35em;
		border-radius: 4px;
	}
</style>
