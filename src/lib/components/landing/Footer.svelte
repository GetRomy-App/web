<script lang="ts">
	import { onMount } from 'svelte';
	import { isDark } from '$lib/theme';
	import GradientAscii from '$lib/components/ui/GradientAscii.svelte';

	let { footerText = $bindable<HTMLElement>() } = $props();

	// React Bits' "Atmosphere" look, and its light-mode swap.
	const DARK_COLORS = ['#1e3fd8', '#f6f8ff', '#a5d8ff', '#38bdf8'];
	const LIGHT_COLORS = ['#4f8ff7', '#e8f0ff', '#b4d0ff', '#7cb4fb'];

	let footer = $state<HTMLElement>();
	let revealed = $state(false);
	let unavailable = $state(false);

	// The footer sits fixed behind the page and shows only in its last 280px of scroll; until
	// then the background draws nothing, so its intro plays as the page lifts off it.
	onMount(() => {
		let frame = 0;
		const measure = () => {
			frame = 0;
			if (!footer) return;
			const below = document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);
			revealed = below < footer.offsetHeight - 1;
		};
		const schedule = () => {
			if (!frame) frame = requestAnimationFrame(measure);
		};
		measure();
		window.addEventListener('scroll', schedule, { passive: true });
		window.addEventListener('resize', schedule, { passive: true });
		const pageSize = new ResizeObserver(schedule);
		pageSize.observe(document.body);
		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener('scroll', schedule);
			window.removeEventListener('resize', schedule);
			pageSize.disconnect();
		};
	});
</script>

<footer
	bind:this={footer}
	class="footer-reveal"
	class:footer-light={!$isDark}
	class:footer-fallback={unavailable}
>
	<div class="inset-0 absolute z-0">
		<GradientAscii
			active={revealed}
			scope={footer}
			lightMode={!$isDark}
			colors={$isDark ? DARK_COLORS : LIGHT_COLORS}
			onunavailable={() => (unavailable = true)}
		/>
	</div>
	<div bind:this={footerText} class="relative z-10"></div>
</footer>

<style>
	.footer-reveal {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 280px;
		z-index: 0;
		overflow: hidden;
		background: #03040b;
	}

	.footer-light {
		background: #ffffff;
	}

	/* No WebGL 2: the same horizon glow, without the characters. */
	.footer-fallback {
		background:
			radial-gradient(
				120% 140% at 50% -20%,
				#f6f8ff 0%,
				#a5d8ff 22%,
				#38bdf8 40%,
				#1e3fd8 62%,
				transparent 85%
			),
			#03040b;
	}

	.footer-fallback.footer-light {
		background:
			radial-gradient(120% 140% at 50% -20%, #e8f0ff 0%, #b4d0ff 30%, #7cb4fb 55%, transparent 85%),
			#ffffff;
	}
</style>
