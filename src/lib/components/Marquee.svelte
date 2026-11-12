<script lang="ts">
	import { brandLogos, gallery } from '$lib/data';
	import { i18n } from '$lib/i18n/index.svelte';
	import { onFrame, onResize } from '$lib/scroll.svelte';
	import { openViewer } from '$lib/viewer.svelte';

	/**
	 * One logo per brand, ordered from the newest reel. Brands without a logo
	 * file are skipped, and clicking a logo opens that brand's newest reel.
	 */
	const brands = gallery
		.map((item, index) => ({ name: item.brand, index, logo: brandLogos[item.brand] }))
		.filter((brand, i, list) => brand.logo && list.findIndex((b) => b.name === brand.name) === i);

	// repeated three times so the band never looks broken on wide screens
	const loop = [0, 1, 2];

	let track = $state<HTMLElement | null>(null);
	let sets = $state<HTMLElement[]>([]);
	let paused = $state(false);

	/**
	 * The band drifts slowly on its own, then gets pushed along when the page
	 * scrolls. The push is damped so it feels like heavy cloth being pulled,
	 * not a jump.
	 */
	$effect(() => {
		if (!track || !sets[0]) return;
		const el = track;
		const one = sets[0];
		let width = one.offsetWidth;
		let x = 0;
		let push = 0;
		const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		const stopResize = onResize(() => (width = one.offsetWidth));
		const stopFrame = onFrame((state) => {
			if (calm || width === 0) return;
			push += (Math.min(Math.abs(state.velocity), 60) * 0.09 - push) * 0.08;
			x -= (paused ? 0.08 : 0.45) + push;
			if (x <= -width) x += width;
			el.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
		});

		return () => {
			stopResize();
			stopFrame();
		};
	});
</script>

<section class="band" aria-label={i18n.t.ui.brands.label}>
	<div
		class="viewport"
		role="presentation"
		onpointerenter={() => (paused = true)}
		onpointerleave={() => (paused = false)}
	>
		<div bind:this={track} class="track">
			{#each loop as copy (copy)}
				<ul bind:this={sets[copy]} aria-hidden={copy > 0}>
					{#each brands as brand (brand.name)}
						<li>
							<button
								type="button"
								class="logo"
								tabindex={copy > 0 ? -1 : 0}
								onclick={() => openViewer(brand.index)}
								data-cursor
								aria-label={i18n.t.ui.brands.play(brand.name)}
								style:--src="url({brand.logo.src})"
								style:height="{brand.logo.size}rem"
								style:aspect-ratio="{brand.logo.width} / {brand.logo.height}"
							></button>
						</li>
					{/each}
				</ul>
			{/each}
		</div>
	</div>
</section>

<style>
	.band {
		position: relative;
		padding: 3rem 0 3.4rem;
		background: var(--color-ivory);
	}
	/* thin hairlines above and below, fading at both ends */
	.band::before,
	.band::after {
		content: '';
		position: absolute;
		left: 8%;
		right: 8%;
		height: 1px;
		background: linear-gradient(
			90deg,
			transparent,
			color-mix(in srgb, var(--color-rose) 38%, transparent),
			transparent
		);
	}
	.band::before {
		top: 0;
	}
	.band::after {
		bottom: 0;
	}

	.viewport {
		overflow: hidden;
		mask-image: linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent);
	}
	.track {
		display: flex;
		width: max-content;
		will-change: transform;
	}
	ul {
		display: flex;
		align-items: center;
		flex-shrink: 0;
	}
	li {
		display: flex;
		align-items: center;
		padding-inline: clamp(2rem, 4.5vw, 4rem);
	}

	/* the logo is used as a mask, its colour comes from the palette */
	.logo {
		display: block;
		background: var(--color-mocha);
		mask: var(--src) center / contain no-repeat;
		-webkit-mask: var(--src) center / contain no-repeat;
		opacity: 0.9;
		transition:
			background-color 0.6s var(--ease-silk),
			opacity 0.6s var(--ease-silk),
			transform 0.6s var(--ease-silk);
	}
	.logo:hover,
	.logo:focus-visible {
		background: var(--color-roseink);
		opacity: 1;
		transform: translateY(-2px);
	}

	@media (prefers-reduced-motion: reduce) {
		.viewport {
			overflow-x: auto;
		}
	}
</style>
