<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap, SplitText } from '$lib/gsap';

	let section1: HTMLElement;
	let section2: HTMLElement;

	onMount(() => {
		let splits: SplitText[] = [];
		let mounted = true;

		const init = async () => {
			await document.fonts.ready;
			if (!mounted) return;

			if (section1) {
				const paragraphs1 = Array.from(section1.querySelectorAll('p'));
				const lines1: Element[] = [];

				paragraphs1.forEach((p) => {
					const split = new SplitText(p, { type: 'lines', mask: 'lines' });
					splits.push(split);
					if (split.lines) lines1.push(...split.lines);
				});

				if (lines1.length > 0) {
					gsap.fromTo(
						lines1,
						{ yPercent: 100 },
						{
							scrollTrigger: {
								trigger: section1,
								start: 'top 85%'
							},
							yPercent: 0,
							stagger: 0.1,
							duration: 1.2,
							ease: 'custom-ease',
							delay: 0
						}
					);
				}
			}

			if (section2) {
				const paragraphs2 = Array.from(section2.querySelectorAll('p'));

				paragraphs2.forEach((paragraph, index) => {
					const split = new SplitText(paragraph, {
						type: 'lines',
						mask: 'lines'
					});
					splits.push(split);

					gsap.fromTo(
						split.lines,
						{ yPercent: 100 },
						{
							scrollTrigger: {
								trigger: paragraph,
								start: 'top 85%'
							},
							yPercent: 0,
							stagger: 0.1,
							duration: 1.2,
							ease: 'custom-ease',
							delay: (index + 1) * 0.5
						}
					);
				});
			}
		};

		init();

		return () => {
			mounted = false;
			splits.forEach((split) => split.revert());
		};
	});
</script>

<section
	id="story"
	class="lg:grid-cols-2 lg:divide-x divide-gray-alpha-100 lg:divide-y-0 grid w-full grid-cols-1 divide-y"
>
	<div bind:this={section1} class="px-4 md:px-8 py-8 gap-4 divide-gray-alpha-100 flex flex-col">
		<p class="text-gray-alpha-600 text-lg leading-relaxed md:text-xl text-pretty">
			<span class="text-foreground font-medium tracking-tight">
				Small nonprofits have always faced an unfair disadvantage in fundraising.
			</span>
			The enterprise donor intelligence platforms that large organizations rely on cost tens of thousands
			of dollars per year. For a team of five trying to fund a local literacy program, that's simply out
			of reach. Rōmy was built to close that gap — to deliver the same caliber of prospect research at
			a price that makes sense for organizations operating on tight budgets.
		</p>
		<p class="text-gray-alpha-600 text-lg leading-relaxed md:text-xl text-pretty">
			Behind every great fundraising campaign is deep knowledge of who to ask and why. Rōmy uses
			AI-powered research to surface wealth indicators, giving histories, and affinity signals —
			then distills them into actionable donor profiles. No more spreadsheets cobbled together from
			public records. No more guessing which prospects have both the capacity and the inclination to give.
		</p>
	</div>

	<div bind:this={section2} class="divide-gray-alpha-100 flex flex-col divide-y">
		<p class="px-4 md:px-8 py-8 text-gray-alpha-600 text-lg leading-relaxed md:text-xl text-pretty">
			<span class="text-foreground font-medium tracking-tight">
				In an era where data tools demand enterprise contracts, Rōmy stands apart.
			</span>
			There are no per-seat licenses, no lengthy onboarding, and no hidden fees. You sign in, search for
			prospects, and get results you can act on today. This simplicity isn't a shortcut — it's a design
			principle that keeps the focus on what matters: connecting with the right donors.
		</p>

		<p class="px-4 md:px-8 py-8 text-gray-alpha-600 text-lg leading-relaxed md:text-xl text-pretty">
			<span class="text-foreground font-medium tracking-tight">
				Under the clean interface lies a powerful intelligence engine.
			</span>
			Every prospect profile is built from real signals: philanthropic databases, public giving disclosures,
			and wealth indicators. Rōmy processes these data points and presents them with context — connection
			points, giving capacity estimates, and outreach angles — so your team can start conversations,
			not research projects.
		</p>
	</div>
</section>
