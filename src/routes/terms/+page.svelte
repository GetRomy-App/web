<script lang="ts">
	import LegalPage from '$lib/components/legal/LegalPage.svelte';

	let { data } = $props();
</script>

<LegalPage
	title={data.page.title}
	description={data.page.description}
	effective={data.page.effective}
	content={data.page.content}
	canonicalPath="/terms"
/>
