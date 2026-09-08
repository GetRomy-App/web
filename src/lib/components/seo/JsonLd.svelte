<script lang="ts">
	interface Props {
		/** Structured data objects, each rendered as its own JSON-LD <script> block. */
		schemas: Record<string, unknown>[];
	}

	let { schemas }: Props = $props();

	// Built here (rather than as markup) so the literal "<script" text never has to appear
	// inside this component's template — that confuses the Svelte template parser.
	const markup = $derived(
		schemas
			.map((schema) => `<script type="application/ld+json">${JSON.stringify(schema)}<${'/script>'}`)
			.join('')
	);
</script>

<svelte:head>
	{@html markup}
</svelte:head>
