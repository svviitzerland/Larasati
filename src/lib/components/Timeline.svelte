<script lang="ts">
	import { i18n } from '$lib/i18n/index.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { onFrame } from '$lib/scroll.svelte';
	import SectionHeading from './SectionHeading.svelte';

	const timeline = $derived(i18n.t.timeline);

	let list = $state<HTMLElement | null>(null);
	let drawn = $state(0);
	let entries = $state<HTMLElement[]>([]);
	// the entry the line is passing; its year is shown large on the left
	let now = $state(0);
	const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

	function centerAlongsideTimeline(node: HTMLElement) {
		let translateY = 0;
		const stop = onFrame(({ viewportH, viewportW }) => {
			const content = node.parentElement;
			if (!content || !list || viewportW < 1024) {
				translateY = 0;
				node.style.transform = '';
				return;
			}

			const rect = node.getBoundingClientRect();
			const bounds = list.getBoundingClientRect();
			const contentTop = content.getBoundingClientRect().top;
			const targetTop = clamp(
				(viewportH - rect.height) / 2,
				contentTop,
				bounds.bottom - rect.height
			);
			translateY += targetTop - rect.top;
			node.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0)`;
		});
		return { destroy: () => stop() };
	}

	// the timeline is drawn as the page scrolls
	$effect(() => {
		if (!list) return;
		return onFrame((state) => {
			if (!list) return;
			const rect = list.getBoundingClientRect();
			const span = rect.height + state.viewportH * 0.35;
			const seen = (state.viewportH * 0.75 - rect.top) / span;
			drawn = Math.min(Math.max(seen, 0), 1);

			let current = 0;
			for (let i = 0; i < entries.length; i++) {
				const top = entries[i]?.getBoundingClientRect().top ?? Infinity;
				if (top <= state.viewportH * 0.55) current = i;
			}
			if (current !== now) now = current;
		});
	});
</script>

<section id="experience" class="trail">
	<div class="wrap">
		<div class="side" use:centerAlongsideTimeline>
			<SectionHeading
				title={i18n.t.ui.timeline.heading[0]}
				italic={i18n.t.ui.timeline.heading[1]}
			/>
			<p class="era font-display" aria-hidden="true">
				{#key timeline[now].year}
					<span>{timeline[now].year}</span>
				{/key}
			</p>
		</div>

		<ol bind:this={list}>
			<span class="line" aria-hidden="true">
				<span style:transform="scaleY({drawn})"></span>
			</span>

			{#each timeline as entry, i (i)}
				<li
					bind:this={entries[i]}
					class="reveal"
					class:now={now === i}
					use:reveal={{ delay: i * 100, y: '30px' }}
				>
					<span class="node" aria-hidden="true"></span>
					<span class="year label-caps">{entry.year}</span>
					<h3 class="font-display">{entry.title}</h3>
					<p>{entry.text}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>

<style>
	.trail {
		position: relative;
		overflow: clip;
		padding: 8rem 1.5rem;
		background: var(--color-mist);
	}
	@media (min-width: 768px) {
		.trail {
			padding: 11rem 3rem;
		}
	}

	.wrap {
		position: relative;
		display: grid;
		gap: 4rem;
		max-width: 1500px;
		margin-inline: auto;
	}
	@media (min-width: 1024px) {
		.wrap {
			grid-template-columns: 0.8fr 1.2fr;
			gap: 6rem;
			align-items: start;
		}
		.side {
			padding-left: clamp(2rem, 5vw, 4rem);
		}
	}

	/* a large year that changes with the entry being read */
	.era {
		display: none;
	}
	@media (min-width: 1024px) {
		.era {
			display: block;
			height: 1em;
			margin-top: 1.6rem;
			overflow: hidden;
			font-size: clamp(4.5rem, 7vw, 6rem);
			font-style: italic;
			font-weight: 300;
			line-height: 1;
			font-variant-numeric: lining-nums;
			color: color-mix(in srgb, var(--color-rose) 55%, var(--color-mist));
		}
		.era span {
			display: block;
			animation: tick 0.9s var(--ease-silk) both;
		}
	}
	@keyframes tick {
		from {
			opacity: 0;
			transform: translateY(70%);
		}
	}

	ol {
		position: relative;
	}
	.line {
		position: absolute;
		top: 0.5rem;
		bottom: 0.5rem;
		left: 0;
		width: 1px;
		background: color-mix(in srgb, var(--color-sand) 90%, transparent);
	}
	@media (min-width: 768px) {
		.line {
			left: 6.5rem;
		}
	}
	.line span {
		position: absolute;
		inset: 0;
		transform-origin: top;
		background: var(--color-rose);
	}

	/* the room for the year is padding, not a heading margin,
	   so it does not leak out and shift the year label */
	li {
		position: relative;
		padding: 1.9rem 0 3.5rem 2rem;
	}
	@media (min-width: 768px) {
		li {
			padding: 0 0 3.5rem 9rem;
		}
	}

	.node {
		position: absolute;
		top: 0.3rem;
		left: 0;
		width: 9px;
		height: 9px;
		margin-left: -4px;
		border-radius: 999px;
		border: 1px solid var(--color-sand);
		background: var(--color-ivory);
		transition:
			background-color 0.7s var(--ease-silk),
			border-color 0.7s var(--ease-silk),
			transform 0.7s var(--ease-silk);
	}
	@media (min-width: 768px) {
		.node {
			top: 0.55rem;
			left: 6.5rem;
		}
		.year {
			top: 0.4rem;
		}
	}
	li.now .node,
	li:hover .node {
		background: var(--color-rose);
		border-color: var(--color-rose);
		transform: scale(1.3);
	}

	.year {
		position: absolute;
		top: 0.2rem;
		left: 2rem;
		color: var(--color-roseink);
	}
	@media (min-width: 768px) {
		.year {
			left: 0;
		}
	}

	li h3 {
		font-size: clamp(1.25rem, 2.6vw, 1.9rem);
		line-height: 1.3;
		transition: color 0.6s var(--ease-silk);
	}
	li:hover h3 {
		color: var(--color-mocha);
	}
	li p {
		margin-top: 0.8rem;
		max-width: 32rem;
		font-size: 0.92rem;
		line-height: 1.9;
		color: var(--color-dusk);
	}
</style>
