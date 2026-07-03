<script lang="ts">
	import StatusPage from '$lib/components/status/StatusPage.svelte';

	let { data } = $props();
</script>

<StatusPage {data} />
