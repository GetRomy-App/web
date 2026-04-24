<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { productUrl, fallbackReleaseUrl } from '$lib/release';
	import { toggleTheme, isDark } from '$lib/theme';

	const RELEASE_TAG = 'v1.0.0';
	const BASE = `https://github.com/GetRomy-App/web/releases/download/${RELEASE_TAG}`;

	let downloadUrl = $state(fallbackReleaseUrl);

	onMount(() => {
		const ua = (navigator.userAgent || '').toLowerCase();
		const platform = (navigator.platform || '').toLowerCase();
		const uaData = (navigator as any).userAgentData;
		const plat = uaData?.platform?.toLowerCase() || platform;

		if (plat.includes('mac') || ua.includes('mac')) {
			downloadUrl = `${BASE}/Romy.dmg`;
		} else if (plat.includes('win') || ua.includes('win')) {
			downloadUrl = `${BASE}/Romy_x64.msi`;
		} else if (plat.includes('linux') || (ua.includes('linux') && !ua.includes('android'))) {
			downloadUrl = `${BASE}/Romy.deb`;
		}
	});
</script>

<div class="inset-x-0 top-2 md:top-6 px-2 md:px-8 fixed z-40 flex justify-center">
	<nav
		class="max-w-3xl border-gray-alpha-200 bg-background/60 p-2 backdrop-blur-md rounded-xl flex w-full items-center justify-between border"
	>
		<div class="gap-0.5 ml-2 flex items-center">
			<img src="/icon-logo.png" alt="Rōmy logo" class="size-6" />
			<span class="text-foreground text-base font-medium tracking-tight">Rōmy</span>
		</div>
		<div class="gap-0.5 flex items-center">
			<button
				onclick={toggleTheme}
				class="text-gray-alpha-600 hover:text-foreground text-xs font-medium transition-colors cursor-pointer"
			>
				{$isDark ? 'Light' : 'Dark'}
			</button>
			<span class="text-gray-alpha-400 text-xs select-none">//</span>
			<Button
				class="h-7 text-xs"
				variant="ghost"
				href={downloadUrl}
				target="_blank"
				rel="noreferrer"
			>
				Download
			</Button>
			<Button class="h-7 text-xs" href={productUrl} target="_blank" rel="noreferrer">
				Get Started
				<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" class="size-3">
					<path d="M9 6C9 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
				</svg>
			</Button>
		</div>
	</nav>
</div>
