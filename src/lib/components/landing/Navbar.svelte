<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { productUrl, fallbackReleaseUrl } from '$lib/release';
	import { toggleTheme, isDark } from '$lib/theme';

	const RELEASE_TAG = 'v1.0.0';
	const BASE = `https://github.com/GetRomy-App/web/releases/download/${RELEASE_TAG}`;

	let downloadUrl = $state(fallbackReleaseUrl);
	let menuOpen = $state(false);
	let menuRef: HTMLDivElement | undefined = $state();

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

		function onDocClick(e: MouseEvent) {
			if (!menuOpen) return;
			if (menuRef && !menuRef.contains(e.target as Node)) {
				menuOpen = false;
			}
		}
		function onKey(e: KeyboardEvent) {
			if (e.key === 'Escape') menuOpen = false;
		}
		document.addEventListener('click', onDocClick);
		document.addEventListener('keydown', onKey);
		return () => {
			document.removeEventListener('click', onDocClick);
			document.removeEventListener('keydown', onKey);
		};
	});
</script>

<div class="inset-x-0 top-2 md:top-6 px-2 md:px-8 fixed z-40 flex justify-center">
	<nav
		class="max-w-3xl border-gray-alpha-200 bg-background/60 p-2 backdrop-blur-md rounded-xl flex w-full items-center justify-between border"
	>
		<div class="gap-0.5 ml-2 flex items-center">
			<img src="/icon-logo.png" alt="" class="size-6" />
			<span class="text-foreground text-base font-medium tracking-tight">Rōmy</span>
		</div>
		<div class="gap-0.5 flex items-center">
			<!-- Desktop links -->
			<a
				href="/labs"
				class="text-gray-alpha-600 hover:text-foreground text-xs font-medium transition-colors hidden md:inline"
			>
				Labs
			</a>
			<span class="text-gray-alpha-400 text-xs select-none hidden md:inline">//</span>
			<a
				href="/blog"
				class="text-gray-alpha-600 hover:text-foreground text-xs font-medium transition-colors hidden md:inline"
			>
				Blog
			</a>
			<span class="text-gray-alpha-400 text-xs select-none hidden md:inline">//</span>
			<button
				onclick={toggleTheme}
				aria-label="Toggle theme"
				class="text-gray-alpha-600 hover:text-foreground text-xs font-medium transition-colors cursor-pointer hidden md:inline"
			>
				{$isDark ? 'Light' : 'Dark'}
			</button>
			<span class="text-gray-alpha-400 text-xs select-none hidden md:inline">//</span>

			<!-- Mobile dropdown -->
			<div class="relative md:hidden" bind:this={menuRef}>
				<button
					type="button"
					aria-label="More"
					aria-haspopup="menu"
					aria-expanded={menuOpen}
					onclick={() => (menuOpen = !menuOpen)}
					class="text-gray-alpha-600 hover:text-foreground inline-flex items-center gap-0.5 text-xs font-medium transition-colors cursor-pointer px-1.5"
				>
					More
					<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" class="size-2.5" aria-hidden="true">
						<path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
					</svg>
				</button>
				{#if menuOpen}
					<div
						role="menu"
						class="border-gray-alpha-200 bg-background/95 backdrop-blur-md absolute right-0 top-full mt-2 min-w-[140px] rounded-xl border p-1 shadow-lg z-50"
					>
						<a
							href="/labs"
							role="menuitem"
							onclick={() => (menuOpen = false)}
							class="text-gray-alpha-600 hover:text-foreground hover:bg-gray-alpha-100 block rounded-lg px-3 py-2 text-xs font-medium transition-colors no-underline"
						>
							Labs
						</a>
						<a
							href="/blog"
							role="menuitem"
							onclick={() => (menuOpen = false)}
							class="text-gray-alpha-600 hover:text-foreground hover:bg-gray-alpha-100 block rounded-lg px-3 py-2 text-xs font-medium transition-colors no-underline"
						>
							Blog
						</a>
						<button
							type="button"
							role="menuitem"
							onclick={() => {
								toggleTheme();
								menuOpen = false;
							}}
							class="text-gray-alpha-600 hover:text-foreground hover:bg-gray-alpha-100 block w-full text-left rounded-lg px-3 py-2 text-xs font-medium transition-colors cursor-pointer"
						>
							{$isDark ? 'Light' : 'Dark'}
						</button>
					</div>
				{/if}
			</div>

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
				<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" class="size-3" aria-hidden="true">
					<path d="M9 6C9 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
				</svg>
			</Button>
		</div>
	</nav>
</div>
