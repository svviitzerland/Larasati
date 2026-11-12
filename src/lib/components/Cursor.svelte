<script lang="ts">
	import { onFrame } from '$lib/scroll.svelte';

	let dot = $state<HTMLElement | null>(null);
	let ring = $state<HTMLElement | null>(null);
	let active = $state(false);
	let visible = $state(false);

	/**
	 * A small dot that sits on the pointer and a thin ring that trails it.
	 * Over anything clickable the ring opens up a little and the dot fades,
	 * so the cursor points at things without covering them.
	 */
	$effect(() => {
		if (!dot || !ring) return;
		if (!window.matchMedia('(pointer: fine)').matches) return;

		let x = window.innerWidth / 2;
		let y = window.innerHeight / 2;
		let targetX = x;
		let targetY = y;

		const move = (event: PointerEvent) => {
			targetX = event.clientX;
			targetY = event.clientY;
			visible = true;
			active = !!(event.target as HTMLElement | null)?.closest('a, button, [data-cursor]');
		};

		const leave = () => (visible = false);

		window.addEventListener('pointermove', move, { passive: true });
		window.addEventListener('pointerdown', move, { passive: true });
		document.addEventListener('pointerleave', leave);

		const stop = onFrame(() => {
			x += (targetX - x) * 0.22;
			y += (targetY - y) * 0.22;
			if (dot) dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
			if (ring) ring.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
		});

		document.documentElement.classList.add('has-custom-cursor');

		return () => {
			window.removeEventListener('pointermove', move);
			window.removeEventListener('pointerdown', move);
			document.removeEventListener('pointerleave', leave);
			document.documentElement.classList.remove('has-custom-cursor');
			stop();
		};
	});
</script>

<div class="cursor" class:active class:visible aria-hidden="true">
	<span bind:this={ring} class="ring"><span></span></span>
	<span bind:this={dot} class="dot"><span></span></span>
</div>

<style>
	.cursor {
		opacity: 0;
		transition: opacity 0.4s ease;
	}
	.cursor.visible {
		opacity: 1;
	}
	.ring,
	.dot {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 200;
		pointer-events: none;
	}
	/* the outer spans carry the position, the inner ones carry the shape,
	   so resizing never fights the movement */
	.ring span,
	.dot span {
		position: absolute;
		border-radius: 999px;
		transform: translate(-50%, -50%);
	}
	.dot span {
		width: 5px;
		height: 5px;
		background: var(--color-rose);
		transition:
			opacity 0.4s var(--ease-silk),
			transform 0.4s var(--ease-silk);
	}
	.ring span {
		width: 26px;
		height: 26px;
		border: 1px solid color-mix(in srgb, var(--color-rose) 70%, transparent);
		transition:
			width 0.5s var(--ease-silk),
			height 0.5s var(--ease-silk),
			background-color 0.5s var(--ease-silk),
			border-color 0.5s var(--ease-silk);
	}
	.active .ring span {
		width: 42px;
		height: 42px;
		border-color: var(--color-rose);
		background: color-mix(in srgb, var(--color-rose) 14%, transparent);
	}
	.active .dot span {
		opacity: 0;
		transform: translate(-50%, -50%) scale(0.4);
	}

	@media (pointer: coarse) {
		.cursor {
			display: none;
		}
	}
</style>
