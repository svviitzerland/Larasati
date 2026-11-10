/**
 * Mesin gulir halus buatan sendiri.
 *
 * Halaman tetap memakai scrollbar asli (sebuah elemen kosong setinggi konten
 * menjaga tinggi dokumen), lalu isi halaman digeser dengan transform yang
 * mengejar posisi scroll asli secara bertahap. Hasilnya gerak yang meluncur,
 * dan kecepatan luncur itu bisa dipakai komponen lain untuk beranimasi.
 */

export type FrameState = {
	/** posisi gulir yang sudah dihaluskan */
	y: number;
	/** selisih posisi antar frame, positif saat turun */
	velocity: number;
	/** 0 di puncak halaman, 1 di dasar halaman */
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

/** Nilai ringkas untuk komponen yang perlu bereaksi lewat rune. */
export const motion = $state({ progress: 0, ready: false });

type FrameHandler = (state: FrameState) => void;

/* Kedua daftar ini sengaja memakai Set biasa. Isinya tidak pernah dibaca
   oleh templat, hanya ditelusuri tiap frame, jadi tidak perlu reaktif. */
/* eslint-disable svelte/prefer-svelte-reactivity */
const frameHandlers = new Set<FrameHandler>();
const resizeHandlers = new Set<() => void>();
/* eslint-enable svelte/prefer-svelte-reactivity */

/** Dipanggil tiap frame. Tulis langsung ke style elemen supaya tetap ringan. */
export function onFrame(handler: FrameHandler) {
	frameHandlers.add(handler);
	return () => frameHandlers.delete(handler);
}

/** Dipanggil setiap ukuran layar atau tinggi konten berubah. */
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

/** Meluncur ke posisi tertentu, dipakai untuk tautan navigasi. */
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

/** Menyalakan mesin. Mengembalikan fungsi pembersih. */
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
			// Mesin ini mengatur easing sendiri. Menulis ke scrollTop menghindari
			// `scroll-behavior: smooth` browser yang akan menganimasikan ulang
			// setiap langkah dan membuat tautan navigasi terasa macet.
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
 * Mengunci gulir selama tampilan karya terbuka. Posisi disimpan lalu
 * dikembalikan sebelum kunci dilepas, jadi halaman tidak melompat ke atas.
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
