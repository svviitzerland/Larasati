import { onFrame, onResize, type FrameState } from '$lib/scroll.svelte';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/**
 * Moves an element slower or faster than the page scroll.
 * A positive `speed` means the element lags behind.
 */
export function parallax(node: HTMLElement, options: { speed?: number; rotate?: number } = {}) {
	let speed = options.speed ?? 80;
	let rotate = options.rotate ?? 0;
	let top = 0;
	let height = 0;

	const measure = (state: FrameState) => {
		const rect = node.getBoundingClientRect();
		top = rect.top + state.y;
		height = rect.height;
	};

	let measured = false;

	const stopFrame = onFrame((state) => {
		if (!measured) {
			measure(state);
			measured = true;
		}
		const span = state.viewportH + height;
		const seen = clamp((state.y + state.viewportH - top) / span, 0, 1);
		const shift = (seen - 0.5) * speed;
		node.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0) rotate(${(
			(seen - 0.5) *
			rotate
		).toFixed(3)}deg)`;
	});

	const stopResize = onResize(() => {
		measured = false;
	});

	return {
		update(next: { speed?: number; rotate?: number } = {}) {
			speed = next.speed ?? 80;
			rotate = next.rotate ?? 0;
			measured = false;
		},
		destroy() {
			stopFrame();
			stopResize();
		}
	};
}

/**
 * Panel effect. As a section starts to leave through the top of the screen it
 * shrinks and dims a little, so the next section feels like it rises over it.
 */
export function panel(node: HTMLElement, options: { depth?: number; fade?: number } = {}) {
	const depth = options.depth ?? 0.06;
	const fade = options.fade ?? 0.45;

	node.style.transformOrigin = 'center bottom';

	const stop = onFrame((state) => {
		const rect = node.getBoundingClientRect();
		if (rect.bottom < -200 || rect.top > state.viewportH + 200) return;
		// start shrinking only when this section is really leaving,
		// that is, when its bottom edge moves up past the screen
		const exit = clamp(1 - rect.bottom / Math.max(state.viewportH, 1), 0, 1);
		const scale = 1 - exit * depth;
		node.style.transform = `scale(${scale.toFixed(4)})`;
		node.style.opacity = `${(1 - exit * fade).toFixed(3)}`;
		node.style.filter = exit > 0.05 ? `blur(${(exit * 2.4).toFixed(2)}px)` : 'none';
	});

	return { destroy: stop };
}

/**
 * Leans slightly with the scroll velocity so the element feels like it has weight.
 */
export function sway(node: HTMLElement, options: { amount?: number; max?: number } = {}) {
	const amount = options.amount ?? 0.05;
	const max = options.max ?? 3;

	const stop = onFrame((state) => {
		const angle = clamp(state.velocity * amount, -max, max);
		const stretch = 1 + Math.min(Math.abs(state.velocity) * 0.0012, 0.03);
		node.style.transform = `skewY(${angle.toFixed(3)}deg) scaleY(${stretch.toFixed(4)})`;
	});

	return { destroy: stop };
}

/** A button that is pulled slightly towards the cursor. */
export function magnetic(node: HTMLElement, strength = 0.28) {
	let raf = 0;
	let x = 0;
	let y = 0;
	let targetX = 0;
	let targetY = 0;

	const render = () => {
		x += (targetX - x) * 0.16;
		y += (targetY - y) * 0.16;
		node.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
		if (Math.abs(targetX - x) > 0.05 || Math.abs(targetY - y) > 0.05) {
			raf = requestAnimationFrame(render);
		} else {
			raf = 0;
		}
	};

	const kick = () => {
		if (!raf) raf = requestAnimationFrame(render);
	};

	const move = (event: PointerEvent) => {
		const rect = node.getBoundingClientRect();
		targetX = (event.clientX - (rect.left + rect.width / 2)) * strength;
		targetY = (event.clientY - (rect.top + rect.height / 2)) * strength;
		kick();
	};

	const leave = () => {
		targetX = 0;
		targetY = 0;
		kick();
	};

	node.addEventListener('pointermove', move);
	node.addEventListener('pointerleave', leave);

	return {
		destroy() {
			node.removeEventListener('pointermove', move);
			node.removeEventListener('pointerleave', leave);
			cancelAnimationFrame(raf);
		}
	};
}
