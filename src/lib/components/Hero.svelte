<script lang="ts">
	import { glideToId, onFrame } from '$lib/scroll.svelte';

	let started = $state(false);

	let stage = $state<HTMLElement | null>(null);
	let beam = $state<HTMLElement | null>(null);
	let title = $state<HTMLElement | null>(null);
	let first = $state<HTMLElement | null>(null);
	let second = $state<HTMLElement | null>(null);
	let center = $state<HTMLElement | null>(null);

	// lampu sorot yang mengejar kursor dengan lembut
	let aimX = 0;
	let aimY = 0;
	let atX = 0;
	let atY = 0;
	let placed = false;

	$effect(() => {
		const id = setTimeout(() => (started = true), 60);
		return () => clearTimeout(id);
	});

	$effect(() => {
		if (!beam) return;

		return onFrame((state) => {
			const rect = stage?.getBoundingClientRect();
			if (!placed && rect) {
				atX = aimX = rect.width / 2;
				atY = aimY = rect.height * 0.44;
				placed = true;
			}

			atX += (aimX - atX) * 0.07;
			atY += (aimY - atY) * 0.07;

			if (beam) beam.style.transform = `translate3d(${atX.toFixed(1)}px, ${atY.toFixed(1)}px, 0)`;

			// nama bergeser tipis ke arah sorotan
			if (title && rect) {
				const dx = (atX / Math.max(rect.width, 1) - 0.5) * 16;
				const dy = (atY / Math.max(rect.height, 1) - 0.5) * 10;
				title.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0)`;
			}

			// saat mulai digulir, dua baris nama merenggang ke arah berlawanan
			const leave = Math.min(Math.max(state.y / Math.max(state.viewportH, 1), 0), 1);
			const spread = leave * Math.min(state.viewportW, 1400) * 0.06;
			if (first) first.style.transform = `translate3d(${(-spread).toFixed(1)}px, 0, 0)`;
			if (second) second.style.transform = `translate3d(${spread.toFixed(1)}px, 0, 0)`;
			// seluruh isi beranda mundur pelan dan memudar, seperti tirai
			// yang ditarik sebelum bagian berikutnya naik
			if (center) {
				center.style.opacity = (1 - leave * 0.85).toFixed(3);
				center.style.filter = leave > 0.02 ? `blur(${(leave * 3).toFixed(2)}px)` : 'none';
				center.style.scale = (1 - leave * 0.06).toFixed(4);
			}
		});
	});

	function aim(event: PointerEvent) {
		const rect = stage?.getBoundingClientRect();
		if (!rect) return;
		aimX = event.clientX - rect.left;
		aimY = event.clientY - rect.top;
	}
</script>

<section
	id="atas"
	bind:this={stage}
	class="hero"
	class:started
	class:is-in={started}
	onpointermove={aim}
	aria-label="Home"
>
	<div class="ambient" aria-hidden="true">
		<span class="orb one"></span>
		<span class="orb two"></span>
		<span bind:this={beam} class="beamlight"></span>
	</div>

	<!-- lengkung tipis yang menggambar dirinya sendiri saat halaman dibuka -->
	<svg
		class="gate"
		viewBox="0 0 400 520"
		fill="none"
		aria-hidden="true"
		preserveAspectRatio="xMidYMax meet"
	>
		<path d="M18 520 V214 A182 182 0 0 1 382 214 V520" />
	</svg>

	<div bind:this={center} class="center">
		<h1 bind:this={title} class="name font-display">
			<span bind:this={first} class="row">
				<span class="line-mask" style="--rv-delay:200ms"><span>Larasati</span></span>
			</span>
			<span bind:this={second} class="row">
				<span class="line-mask" style="--rv-delay:360ms"
					><span class="soft">Putri Maharani</span></span
				>
			</span>
		</h1>

		<button type="button" class="see" onclick={() => glideToId('galeri')} data-cursor="View">
			<span>See the work</span>
			<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2v11M3.5 8.5 8 13l4.5-4.5" /></svg>
		</button>
	</div>
</section>

<style>
	.hero {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100svh;
		padding: 8rem 1.5rem 7rem;
		overflow: hidden;
		text-align: center;
	}

	.ambient {
		position: absolute;
		inset: 0;
		pointer-events: none;
		mask-image: linear-gradient(to bottom, #000 62%, transparent 97%);
	}
	/* Cahaya latar memakai gradasi lingkaran, bukan lingkaran padat yang
	   diberi blur. Hasilnya nyaris sama tetapi jauh lebih ringan, terutama
	   di Safari yang mahal sekali menggambar blur berjari jari besar. */
	.orb {
		position: absolute;
		border-radius: 999px;
	}
	.one {
		top: -16rem;
		right: -12rem;
		width: 36rem;
		height: 36rem;
		background: radial-gradient(
			circle at center,
			color-mix(in srgb, var(--color-blush) 62%, transparent) 0%,
			color-mix(in srgb, var(--color-blush) 42%, transparent) 42%,
			transparent 72%
		);
		animation: drift 21s ease-in-out infinite;
	}
	.two {
		bottom: -18rem;
		left: -14rem;
		width: 32rem;
		height: 32rem;
		background: radial-gradient(
			circle at center,
			color-mix(in srgb, var(--color-sand) 68%, transparent) 0%,
			color-mix(in srgb, var(--color-sand) 45%, transparent) 44%,
			transparent 74%
		);
		animation: drift 27s ease-in-out infinite reverse;
	}

	/* sorotan hangat yang mengikuti kursor */
	.beamlight {
		position: absolute;
		top: 0;
		left: 0;
		width: 48rem;
		height: 48rem;
		margin: -24rem 0 0 -24rem;
		border-radius: 999px;
		background: radial-gradient(
			circle,
			rgba(255, 253, 249, 0.95),
			rgba(255, 246, 232, 0.4) 40%,
			transparent 68%
		);
		opacity: 0;
		transition: opacity 2s var(--ease-silk) 0.4s;
	}
	.started .beamlight {
		opacity: 1;
	}

	/* lengkung latar, sama seperti gerbang galeri */
	.gate {
		position: absolute;
		bottom: 0;
		left: 50%;
		width: min(54rem, 88vw);
		height: min(36rem, 64svh);
		transform: translateX(-50%);
		pointer-events: none;
		/* kaki lengkungnya dibiarkan larut, bukan terpotong tepi layar */
		mask-image: linear-gradient(to bottom, #000 45%, transparent 92%);
	}
	.gate path {
		fill: none;
		stroke: color-mix(in srgb, var(--color-rose) 42%, transparent);
		stroke-width: 1;
		stroke-dasharray: 1300;
		stroke-dashoffset: 1300;
		transition: stroke-dashoffset 3.4s var(--ease-silk) 0.35s;
	}
	.started .gate path {
		stroke-dashoffset: 0;
	}

	.center {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.name {
		position: relative;
		font-size: clamp(3.2rem, 12vw, 9.5rem);
		line-height: 0.92;
		font-weight: 300;
		letter-spacing: -0.015em;
	}
	.row {
		display: block;
		will-change: transform;
	}
	.soft {
		display: block;
		color: var(--color-mocha);
		font-style: italic;
	}

	.see {
		display: inline-flex;
		align-items: center;
		gap: 0.7rem;
		margin-top: 2.6rem;
		padding: 0.85rem 1.5rem;
		border: 1px solid color-mix(in srgb, var(--color-rose) 55%, transparent);
		border-radius: 999px;
		font-size: 0.82rem;
		letter-spacing: 0.04em;
		color: var(--color-ink);
		opacity: 0;
		transform: translateY(10px);
		transition:
			opacity 1.2s var(--ease-silk) 1s,
			transform 1.2s var(--ease-silk) 1s,
			background-color 0.5s var(--ease-silk),
			border-color 0.5s var(--ease-silk);
	}
	.started .see {
		opacity: 1;
		transform: none;
	}
	.see:hover {
		background: var(--color-blush);
		border-color: var(--color-blush);
	}
	.see svg {
		width: 0.9rem;
		height: 0.9rem;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.3;
		stroke-linecap: round;
		stroke-linejoin: round;
		transition: transform 0.5s var(--ease-silk);
	}
	.see:hover svg {
		transform: translateY(2px);
	}
</style>
