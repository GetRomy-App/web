<script lang="ts">
	import '../../../app.css';
	import { onMount } from 'svelte';
	import { gsap } from '$lib/gsap';

	import Navbar from '$lib/components/landing/Navbar.svelte';
	import Footer from '$lib/components/landing/Footer.svelte';

	let mainContent: HTMLElement;
	let footerText: HTMLElement;

	let name = $state('');
	let email = $state('');
	let role = $state<'customer' | 'prospect' | 'other'>('prospect');
	let requestType = $state<
		'access' | 'erasure' | 'correction' | 'object' | 'restrict' | 'portability' | 'withdraw' | 'other'
	>('erasure');
	let identifiers = $state('');
	let nonprofit = $state('');
	let message = $state('');
	let submitting = $state(false);

	const REQUEST_LABELS: Record<typeof requestType, string> = {
		access: 'Access — get a copy of my data',
		erasure: 'Erasure — delete my data ("right to be forgotten")',
		correction: 'Correction — fix inaccurate data',
		object: 'Object — stop legitimate-interest processing about me',
		restrict: 'Restriction — limit how my data is used',
		portability: 'Portability — receive my data in a machine-readable format',
		withdraw: 'Withdraw consent',
		other: 'Other'
	};

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (submitting) return;
		submitting = true;

		const subject = `Privacy rights request — ${REQUEST_LABELS[requestType]}`;
		const lines = [
			`Name: ${name || '(not provided)'}`,
			`Email: ${email || '(not provided)'}`,
			`I am a: ${role}`,
			`Request type: ${REQUEST_LABELS[requestType]}`,
			'',
			'Identifying information so you can find my data:',
			identifiers || '(none provided)',
			''
		];
		if (role === 'prospect' && nonprofit) {
			lines.push(`Nonprofit (if known) that may hold my data: ${nonprofit}`, '');
		}
		if (message) {
			lines.push('Additional context:', message, '');
		}
		lines.push(
			'---',
			'Sent via the privacy rights form at https://getromy.app/privacy/request'
		);

		const body = encodeURIComponent(lines.join('\n'));
		const mailto = `mailto:howard@getromy.app?subject=${encodeURIComponent(subject)}&body=${body}`;
		window.location.href = mailto;

		setTimeout(() => {
			submitting = false;
		}, 1500);
	}

	onMount(() => {
		gsap.to(mainContent, {
			scale: 0.95,
			borderRadius: '24px',
			scrollTrigger: {
				trigger: mainContent,
				start: 'bottom bottom',
				end: 'bottom 70%',
				scrub: true
			}
		});

		gsap.fromTo(
			footerText,
			{ opacity: 0, y: 20 },
			{
				opacity: 1,
				y: 0,
				scrollTrigger: {
					trigger: mainContent,
					start: 'bottom 90%',
					end: 'bottom 70%',
					scrub: true
				}
			}
		);
	});
</script>

<svelte:head>
	<title>Privacy rights request — Rōmy</title>
	<meta name="title" content="Privacy rights request — Rōmy" />
	<meta
		name="description"
		content="Submit a request to access, erase, correct, or object to processing of your personal data held by Rōmy (GetRomy LLC)."
	/>
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href="https://getromy.app/privacy/request" />
	<meta property="og:title" content="Privacy rights request — Rōmy" />
	<meta property="og:url" content="https://getromy.app/privacy/request" />
</svelte:head>

<Footer bind:footerText />

<Navbar />

<div bind:this={mainContent} class="main-content px-4 md:px-8 overflow-hidden">
	<div class="border-gray-alpha-100 flex min-h-screen flex-col items-center border-x">
		<div class="w-full max-w-2xl mx-auto pt-40 md:pt-44 pb-16 px-4 md:px-8">
			<header class="mb-10 border-gray-alpha-100 border-b pb-8">
				<div class="post-meta mb-6 flex items-center gap-3">
					<a
						href="/legal"
						class="text-gray-alpha-600 hover:text-foreground inline-flex items-center gap-1 text-sm font-medium transition-colors no-underline"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							class="size-3.5"
							aria-hidden="true"
						>
							<path
								d="M15 6C15 6 9 10.4189 9 12C9 13.5812 15 18 15 18"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							></path>
						</svg>
						Legal
					</a>
				</div>
				<h1 class="text-foreground text-3xl font-medium tracking-tight md:text-4xl">
					Privacy rights request
				</h1>
				<p class="text-gray-alpha-600 text-base mt-3 leading-relaxed">
					Use this form to ask us to access, delete, correct, or stop processing your personal data.
					We respond within 30 days. There is no fee.
				</p>
				<p class="text-gray-alpha-600 text-sm mt-3 leading-relaxed">
					If you have a Rōmy account, the fastest way to export or delete your data is from
					<strong class="text-foreground">Settings → Data &amp; Privacy</strong> inside the app.
				</p>
			</header>

			<form onsubmit={handleSubmit} class="space-y-6">
				<fieldset class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<label class="block">
						<span class="text-foreground text-xs font-medium block mb-1.5">Your name</span>
						<input
							type="text"
							bind:value={name}
							required
							class="border-gray-alpha-200 bg-background text-foreground w-full rounded-md border px-3 py-2 text-sm"
						/>
					</label>
					<label class="block">
						<span class="text-foreground text-xs font-medium block mb-1.5">Email</span>
						<input
							type="email"
							bind:value={email}
							required
							class="border-gray-alpha-200 bg-background text-foreground w-full rounded-md border px-3 py-2 text-sm"
						/>
					</label>
				</fieldset>

				<label class="block">
					<span class="text-foreground text-xs font-medium block mb-1.5">I am a</span>
					<select
						bind:value={role}
						class="border-gray-alpha-200 bg-background text-foreground w-full rounded-md border px-3 py-2 text-sm"
					>
						<option value="customer">Rōmy customer (or my organisation is)</option>
						<option value="prospect"
							>Prospect — a nonprofit may have researched me using Rōmy</option
						>
						<option value="other">Other</option>
					</select>
				</label>

				<label class="block">
					<span class="text-foreground text-xs font-medium block mb-1.5">Type of request</span>
					<select
						bind:value={requestType}
						class="border-gray-alpha-200 bg-background text-foreground w-full rounded-md border px-3 py-2 text-sm"
					>
						{#each Object.entries(REQUEST_LABELS) as [value, label]}
							<option {value}>{label}</option>
						{/each}
					</select>
				</label>

				{#if role === 'prospect'}
					<label class="block">
						<span class="text-foreground text-xs font-medium block mb-1.5"
							>Nonprofit that may hold your data <span class="text-gray-alpha-400">(optional)</span></span
						>
						<input
							type="text"
							bind:value={nonprofit}
							placeholder="e.g. Local Literacy Project"
							class="border-gray-alpha-200 bg-background text-foreground w-full rounded-md border px-3 py-2 text-sm"
						/>
					</label>
				{/if}

				<label class="block">
					<span class="text-foreground text-xs font-medium block mb-1.5"
						>Identifying information</span
					>
					<textarea
						bind:value={identifiers}
						required
						rows="3"
						placeholder="e.g. previous email address, postal address used by the nonprofit, employer at the time, anything that helps us locate your data"
						class="border-gray-alpha-200 bg-background text-foreground w-full rounded-md border px-3 py-2 text-sm"
					></textarea>
					<span class="text-gray-alpha-400 text-xs mt-1 block">
						We do not need ID documents. Please provide only what is needed to find your data.
					</span>
				</label>

				<label class="block">
					<span class="text-foreground text-xs font-medium block mb-1.5"
						>Anything else <span class="text-gray-alpha-400">(optional)</span></span
					>
					<textarea
						bind:value={message}
						rows="4"
						class="border-gray-alpha-200 bg-background text-foreground w-full rounded-md border px-3 py-2 text-sm"
					></textarea>
				</label>

				<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
					<p class="text-gray-alpha-400 text-xs">
						Submitting this form opens your email client with a pre-filled message to
						howard@getromy.app.
					</p>
					<button
						type="submit"
						disabled={submitting}
						class="bg-foreground text-background hover:bg-ds-blue-700 inline-flex items-center justify-center gap-1 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
					>
						{submitting ? 'Opening email…' : 'Send request'}
					</button>
				</div>
			</form>

			<div class="mt-12 text-gray-alpha-400 text-xs leading-relaxed">
				<p>
					Prefer to email us directly? Send your request to
					<a href="mailto:howard@getromy.app" class="underline underline-offset-2">howard@getromy.app</a>.
					We respond within 30 days.
				</p>
				<p class="mt-2">
					EU/UK residents may also lodge a complaint with their local data protection authority
					without contacting us first.
				</p>
			</div>
		</div>
	</div>
</div>

<style>
	.main-content {
		position: relative;
		z-index: 1;
		background: var(--background);
		margin-bottom: 280px;
		transform-origin: center bottom;
	}

	input:focus,
	textarea:focus,
	select:focus {
		outline: 2px solid var(--ds-blue-700);
		outline-offset: 1px;
		border-color: transparent;
	}
</style>
