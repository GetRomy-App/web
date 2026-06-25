<script lang="ts">
	import '../../../app.css';
	import { tick, untrack } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { browser } from '$app/environment';
	import { contactModal } from '$lib/stores/contact.svelte';

	type Status = 'idle' | 'submitting' | 'success';

	let name = $state('');
	let email = $state('');
	let message = $state('');
	let company = $state(''); // honeypot — must stay empty
	let status = $state<Status>('idle');
	let errorMsg = $state('');

	let dialogEl: HTMLElement | undefined = $state();
	let firstFieldEl: HTMLInputElement | undefined = $state();
	let restoreFocusTo: HTMLElement | null = null;

	const copy = $derived(
		contactModal.kind === 'issue'
			? {
					title: 'Report an issue',
					subtitle: 'Tell us what went wrong. We’ll look into it and follow up by email.',
					button: 'Send report',
					placeholder: 'What happened? Where did you see it?'
				}
			: {
					title: 'Get in touch',
					subtitle: 'Send us a note and we’ll get back to you by email.',
					button: 'Send message',
					placeholder: 'How can we help?'
				}
	);

	function reduceMotion(): boolean {
		return browser && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	}

	// React to open/close: focus the first field on open, restore focus on close,
	// and start each session from a clean slate after a successful send.
	$effect(() => {
		const isOpen = contactModal.open;
		untrack(() => {
			if (isOpen) {
				restoreFocusTo = (browser ? (document.activeElement as HTMLElement) : null) ?? null;
				if (status === 'success') {
					name = '';
					email = '';
					message = '';
				}
				status = 'idle';
				errorMsg = '';
				tick().then(() => firstFieldEl?.focus());
			} else {
				restoreFocusTo?.focus?.();
				restoreFocusTo = null;
			}
		});
	});

	function close() {
		contactModal.hide();
	}

	function onWindowKeydown(event: KeyboardEvent) {
		if (!contactModal.open) return;
		if (event.key === 'Escape') {
			event.preventDefault();
			close();
			return;
		}
		if (event.key === 'Tab' && dialogEl) {
			const focusable = dialogEl.querySelectorAll<HTMLElement>(
				'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
			);
			if (focusable.length === 0) return;
			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		}
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (status === 'submitting') return;
		errorMsg = '';

		if (!name.trim() || !email.trim() || !message.trim()) {
			errorMsg = 'Please add your name, email, and a message.';
			return;
		}

		status = 'submitting';
		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name,
					email,
					message,
					company,
					kind: contactModal.kind,
					page: browser ? location.pathname : ''
				})
			});
			if (!res.ok) {
				const data = (await res.json().catch(() => ({}))) as { message?: string };
				throw new Error(data.message || 'Something went wrong. Please try again.');
			}
			status = 'success';
		} catch (err) {
			status = 'idle';
			errorMsg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
		}
	}
</script>

<svelte:window onkeydown={onWindowKeydown} />

{#if contactModal.open}
	<div class="contact-overlay inset-0 p-4 fixed z-50 flex items-center justify-center">
		<!-- Backdrop is a real button so it's keyboard- and screen-reader-friendly. -->
		<button
			type="button"
			aria-label="Close dialog"
			onclick={close}
			class="inset-0 bg-black/50 backdrop-blur-sm absolute cursor-default"
			transition:fade={{ duration: reduceMotion() ? 0 : 150 }}
		></button>

		<div
			bind:this={dialogEl}
			role="dialog"
			aria-modal="true"
			aria-labelledby="contact-modal-title"
			data-lenis-prevent
			class="border-gray-alpha-200 bg-background card-highlight max-w-md rounded-2xl p-6 shadow-2xl sm:p-7 relative z-10 max-h-[90vh] w-full overflow-y-auto border"
			transition:scale={{ duration: reduceMotion() ? 0 : 170, start: 0.97, opacity: 0 }}
		>
			<button
				type="button"
				onclick={close}
				aria-label="Close"
				class="text-gray-alpha-400 hover:text-foreground hover:bg-gray-alpha-100 right-3 top-3 size-8 rounded-lg absolute inline-flex items-center justify-center transition-colors"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					class="size-4"
					aria-hidden="true"
				>
					<path
						d="M18 6L6 18M6 6l12 12"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					></path>
				</svg>
			</button>

			{#if status === 'success'}
				<div class="py-6 text-center">
					<div
						class="bg-green-600/10 text-green-600 mb-4 size-12 mx-auto inline-flex items-center justify-center rounded-full"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							class="size-6"
							aria-hidden="true"
						>
							<path
								d="M20 6L9 17l-5-5"
								stroke="currentColor"
								stroke-width="1.75"
								stroke-linecap="round"
								stroke-linejoin="round"
							></path>
						</svg>
					</div>
					<h2 class="text-foreground text-lg font-medium tracking-tight">Message sent</h2>
					<p class="text-gray-alpha-600 mt-2 max-w-xs text-sm leading-relaxed mx-auto">
						Thanks{name ? `, ${name.split(' ')[0]}` : ''} — we’ve got it and will reply to your email
						shortly.
					</p>
					<button
						type="button"
						onclick={close}
						class="bg-blue-700 hover:bg-blue-700/90 button-highlight mt-6 h-9 rounded-lg px-4 text-sm font-medium text-white inline-flex items-center justify-center transition-colors"
					>
						Done
					</button>
				</div>
			{:else}
				<div class="mb-5 pr-8">
					<h2 id="contact-modal-title" class="text-foreground text-lg font-medium tracking-tight">
						{copy.title}
					</h2>
					<p class="text-gray-alpha-600 mt-1 text-sm leading-relaxed">{copy.subtitle}</p>
				</div>

				<form onsubmit={handleSubmit} class="space-y-4" novalidate>
					<!-- Honeypot: hidden from humans, irresistible to bots. -->
					<div aria-hidden="true" class="pointer-events-none absolute -left-[9999px] opacity-0">
						<label>
							Company
							<input type="text" tabindex="-1" autocomplete="off" bind:value={company} />
						</label>
					</div>

					<label class="block">
						<span class="text-foreground mb-1.5 text-xs font-medium block">Your name</span>
						<input
							bind:this={firstFieldEl}
							type="text"
							bind:value={name}
							required
							autocomplete="name"
							maxlength="120"
							class="border-gray-alpha-200 bg-background text-foreground rounded-md px-3 py-2 text-sm w-full border"
						/>
					</label>

					<label class="block">
						<span class="text-foreground mb-1.5 text-xs font-medium block">Email</span>
						<input
							type="email"
							bind:value={email}
							required
							autocomplete="email"
							maxlength="200"
							class="border-gray-alpha-200 bg-background text-foreground rounded-md px-3 py-2 text-sm w-full border"
						/>
					</label>

					<label class="block">
						<span class="text-foreground mb-1.5 text-xs font-medium block">Message</span>
						<textarea
							bind:value={message}
							required
							rows="4"
							maxlength="5000"
							placeholder={copy.placeholder}
							class="border-gray-alpha-200 bg-background text-foreground rounded-md px-3 py-2 text-sm w-full border"
						></textarea>
					</label>

					{#if errorMsg}
						<p class="text-red-600 text-sm" role="alert">{errorMsg}</p>
					{/if}

					<div class="gap-3 pt-1 flex items-center justify-between">
						<p class="text-gray-alpha-400 text-xs">Goes straight to our inbox.</p>
						<button
							type="submit"
							disabled={status === 'submitting'}
							class="bg-blue-700 hover:bg-blue-700/90 button-highlight h-9 rounded-lg px-4 text-sm font-medium text-white inline-flex items-center justify-center transition-colors disabled:opacity-60"
						>
							{status === 'submitting' ? 'Sending…' : copy.button}
						</button>
					</div>
				</form>
			{/if}
		</div>
	</div>
{/if}

<style>
	.contact-overlay input:focus,
	.contact-overlay textarea:focus {
		outline: 2px solid var(--ds-blue-700);
		outline-offset: 1px;
		border-color: transparent;
	}
</style>
