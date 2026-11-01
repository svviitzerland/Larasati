<script lang="ts">
	import { timeline } from '$lib/data';
	import { reveal } from '$lib/actions/reveal';
	import { onFrame } from '$lib/scroll.svelte';
	import { panel, parallax } from '$lib/actions/motion';
	import SectionHeading from './SectionHeading.svelte';

	let list = $state<HTMLElement | null>(null);
	let drawn = $state(0);

	// garis waktu digambar mengikuti posisi gulir
	$effect(() => {
		if (!list) return;
		return onFrame((state) => {
			if (!list) return;
			const rect = list.getBoundingClientRect();
			const span = rect.height + state.viewportH * 0.35;
			const seen = (state.viewportH * 0.75 - rect.top) / span;
			drawn = Math.min(Math.max(seen, 0), 1);
		});
	});
</script>

<section id="jejak" class="trail">
	<div class="wrap" use:panel={{ depth: 0.04, fade: 0.4 }}>
		<div class="side" use:parallax={{ speed: 60 }}>
			<SectionHeading title="Experience" italic="so far." />
			<p class="say reveal" use:reveal={{ delay: 150 }}>
				Organisations, teaching and paid work, from Bali to Bandung.
			</p>
		</div>

		<ol bind:this={list}>
			<span class="line" aria-hidden="true">
				<span style:transform="scaleY({drawn})"></span>
			</span>

			{#each timeline as entry, i (entry.title)}
				<li class="reveal" use:reveal={{ delay: i * 100, y: '30px' }}>
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
		overflow: hidden;
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
	}

	.say {
		margin-top: 2rem;
		max-width: 24rem;
		font-size: 0.94rem;
		line-height: 1.9;
		color: var(--color-dusk);
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

	li {
		position: relative;
		padding-left: 2rem;
		padding-bottom: 3.5rem;
	}
	@media (min-width: 768px) {
		li {
			padding-left: 9rem;
		}
	}

	.node {
		position: absolute;
		top: 0.55rem;
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
			left: 6.5rem;
		}
	}
	li:hover .node {
		background: var(--color-rose);
		border-color: var(--color-rose);
		transform: scale(1.3);
	}

	.year {
		position: absolute;
		top: 0.4rem;
		left: 2rem;
		color: var(--color-roseink);
	}
	@media (min-width: 768px) {
		.year {
			left: 0;
		}
	}

	li h3 {
		margin-top: 1.8rem;
		font-size: clamp(1.25rem, 2.6vw, 1.9rem);
		line-height: 1.3;
		transition: color 0.6s var(--ease-silk);
	}
	@media (min-width: 768px) {
		li h3 {
			margin-top: 0;
		}
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
