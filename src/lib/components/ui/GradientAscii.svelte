<script lang="ts">
	// Gradient ASCII background (after React Bits, https://reactbits.dev/backgrounds/gradient-ascii).
	// The WebGL engine and its licence notice live in $lib/gradient-ascii.
	import { onMount } from 'svelte';
	import {
		mountGradientAscii,
		resolveGradientAsciiSettings,
		type GradientAsciiHandle,
		type GradientAsciiOptions
	} from '$lib/gradient-ascii';

	interface Props extends GradientAsciiOptions {
		/** Off while the background is out of sight: no frames, no input, the intro waits. */
		active?: boolean;
		class?: string;
		style?: string;
		/** Where pointer input counts (default: this background's parent element). */
		scope?: Element | null;
		/** WebGL 2 is missing or was lost; the parent can paint a fallback. */
		onunavailable?: () => void;
	}

	let {
		active = true,
		class: className = '',
		style = '',
		scope,
		onunavailable,
		...options
	}: Props = $props();

	const settings = $derived(resolveGradientAsciiSettings(options));

	let container: HTMLDivElement;
	let canvas: HTMLCanvasElement;
	let handle = $state.raw<GradientAsciiHandle | null>(null);
	let unavailable = $state(false);

	onMount(() => {
		const instance = mountGradientAscii(container, canvas, () => settings, {
			active,
			getScope: () => scope,
			onUnavailable: () => {
				unavailable = true;
				onunavailable?.();
			}
		});
		handle = instance;
		return () => {
			instance?.destroy();
			handle = null;
		};
	});

	// A changed setting needs one new frame (the loop may be idle under reduced motion).
	$effect(() => {
		void settings;
		handle?.wake();
	});

	$effect(() => {
		handle?.setActive(active);
	});
</script>

<div
	bind:this={container}
	class="gradient-ascii {className}"
	data-gradient-ascii={unavailable ? 'unavailable' : 'live'}
	{style}
>
	<canvas bind:this={canvas} aria-hidden="true"></canvas>
</div>

<style>
	.gradient-ascii {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	canvas {
		position: absolute;
		inset: 0;
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
