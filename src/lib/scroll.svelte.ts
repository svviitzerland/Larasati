/**
 * A hand-built smooth-scroll engine.
 *
 * The page keeps the native scrollbar (an empty element as tall as the content
 * holds the document height), and the content is moved with a transform that
 * eases towards the real scroll position. The result is a gliding motion,
 * and its velocity is available to other components for animation.
 */

export type FrameState = {
	/** the smoothed scroll position */
	y: number;
	/** position change between frames, positive when moving down */
	velocity: number;
	/** 0 at the top of the page, 1 at the bottom */
	progress: number;
	viewportH: number;
	viewportW: number;
	docHeight: number;
	direction: number;
};

const frame: FrameState = {
	y: 0,
	velocity: 0,
	progress: 0,
	viewportH: 0,
	viewportW: 0,
	docHeight: 0,
	direction: 1
};

/** Compact values for components that need to react through runes. */
export const motion = $state({ progress: 0, ready: false });

type FrameHandler = (state: FrameState) => void;

/* Both lists use a plain Set on purpose. They are never read by a
   template, only walked every frame, so they do not need to be reactive. */
/* eslint-disable svelte/prefer-svelte-reactivity */
const frameHandlers = new Set<FrameHandler>();
const resizeHandlers = new Set<() => void>();
/* eslint-enable svelte/prefer-svelte-reactivity */

/** Called every frame. Write straight to the element's style to keep it cheap. */
export function onFrame(handler: FrameHandler) {
	frameHandlers.add(handler);
	return () => frameHandlers.delete(handler);
}

/** Called whenever the viewport size or the content height changes. */
export function onResize(handler: () => void) {
	resizeHandlers.add(handler);
	return () => resizeHandlers.delete(handler);
}

export function frameState() {
	return frame;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

let glide: { from: number; to: number; start: number; duration: number } | null = null;
let locked = false;
let lockedY = 0;

/** Glides to a given position, used for navigation links. */
export function glideTo(y: number, duration = 480) {
	const limit = Math.max(frame.docHeight - frame.viewportH, 0);
	glide = { from: window.scrollY, to: clamp(y, 0, limit), start: performance.now(), duration };
}

export function glideToId(id: string, offset = 0) {
	const el = document.getElementById(id);
	if (!el) return;
	glideTo(el.getBoundingClientRect().top + frame.y + offset);
}

function stopGlide() {
	glide = null;
}

/** Starts the engine. Returns a cleanup function. */
export function startScroll(content: HTMLElement, spacer: HTMLElement) {
	let reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	let raf = 0;
	let last = performance.now();

	const measure = () => {
		reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		frame.viewportH = window.innerHeight;
		frame.viewportW = window.innerWidth;
		frame.docHeight = Math.round(content.getBoundingClientRect().height);
		spacer.style.height = `${frame.docHeight}px`;
		for (const handler of resizeHandlers) handler();
	};

	const loop = (now: number) => {
		const delta = Math.min((now - last) / 1000, 0.064);
		last = now;
		const navigating = glide !== null;

		if (glide) {
			const t = clamp((now - glide.start) / glide.duration, 0, 1);
			// The engine handles its own easing. Writing to scrollTop avoids the
			// browser's `scroll-behavior: smooth`, which would re-animate every
			// step and make navigation links feel stuck.
			document.documentElement.scrollTop = glide.from + (glide.to - glide.from) * easeOut(t);
			if (t >= 1) glide = null;
		}

		const target = locked ? lockedY : window.scrollY;
		const ease = reduced || navigating ? 1 : 1 - Math.pow(0.00008, delta);
		const previous = frame.y;

		frame.y += (target - frame.y) * ease;
		if (Math.abs(target - frame.y) < 0.08) frame.y = target;

		frame.velocity = frame.y - previous;
		if (Math.abs(frame.velocity) > 0.4) frame.direction = Math.sign(frame.velocity);

		const span = Math.max(frame.docHeight - frame.viewportH, 1);
		frame.progress = clamp(frame.y / span, 0, 1);

		content.style.transform = `translate3d(0, ${-frame.y}px, 0)`;
		for (const handler of frameHandlers) handler(frame);

		motion.progress = frame.progress;
		raf = requestAnimationFrame(loop);
	};

	const observer = new ResizeObserver(measure);
	observer.observe(content);
	window.addEventListener('resize', measure);
	window.addEventListener('wheel', stopGlide, { passive: true });
	window.addEventListener('touchstart', stopGlide, { passive: true });
	window.addEventListener('keydown', stopGlide);

	frame.y = window.scrollY;
	measure();
	motion.ready = true;
	raf = requestAnimationFrame(loop);

	return () => {
		cancelAnimationFrame(raf);
		observer.disconnect();
		window.removeEventListener('resize', measure);
		window.removeEventListener('wheel', stopGlide);
		window.removeEventListener('touchstart', stopGlide);
		window.removeEventListener('keydown', stopGlide);
		motion.ready = false;
		content.style.transform = '';
		spacer.style.height = '';
	};
}

/**
 * Locks scrolling while the reel viewer is open. The position is saved and
 * restored before the lock is released, so the page does not jump to the top.
 */
export function lockScroll(on: boolean) {
	if (on) {
		lockedY = window.scrollY;
		locked = true;
		document.documentElement.style.overflow = 'hidden';
		return;
	}
	document.documentElement.style.overflow = '';
	window.scrollTo(0, lockedY);
	locked = false;
}
