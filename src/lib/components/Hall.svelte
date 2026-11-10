<script lang="ts">
	import { gallery, type Craft } from '$lib/data';
	import { reveal } from '$lib/actions/reveal';
	import { onFrame } from '$lib/scroll.svelte';
	import { openViewer } from '$lib/viewer.svelte';

	const [latest, ...rest] = gallery;
	const restCount = String(rest.length).padStart(2, '0');

	let section = $state<HTMLElement | null>(null);
	let cover = $state<HTMLElement | null>(null);
	let rail = $state<HTMLUListElement | null>(null);

	// cahaya ruangan yang mengikuti kursor
	let lightX = $state(50);
	let lightY = $state(35);

	// nama pendek untuk lencana di sudut sampul, ruangnya sempit
	const short: Record<Craft, string> = {
		'Master of Ceremony': 'MC',
		'Voice Over': 'VO',
		Model: 'Model'
	};
	const badge = (roles: Craft[]) => roles.map((role) => short[role]).join(' · ');

	/**
	 * Satu momen gulir untuk karya terbaru. Sampulnya masuk sebagai lengkung
	 * kecil, senada dengan potret di beranda, lalu membuka menjadi bingkai
	 * reel utuh ketika sampai di tengah layar.
	 */
	$effect(() => {
		if (!cover) return;
		const el = cover;
		return onFrame((state) => {
			const rect = el.getBoundingClientRect();
			if (rect.top > state.viewportH || rect.bottom < 0) return;
			const seen = (state.viewportH - rect.top) / (state.viewportH * 0.7);
			const t = Math.min(Math.max(seen, 0), 1);
			const eased = 1 - Math.pow(1 - t, 3);
			el.style.setProperty('--open', eased.toFixed(4));
		});
	});

	function trackLight(event: PointerEvent) {
		if (!section) return;
		const rect = section.getBoundingClientRect();
		lightX = ((event.clientX - rect.left) / rect.width) * 100;
		lightY = ((event.clientY - rect.top) / rect.height) * 100;
	}

	function scrollRail(direction: -1 | 1) {
		if (!rail) return;
		rail.scrollBy({ left: direction * rail.clientWidth * 0.72, behavior: 'smooth' });
	}
</script>

<!-- Tautan Instagram memang menuju ke luar situs. -->
<!-- eslint-disable svelte/no-navigation-without-resolve -->
<section id="galeri" bind:this={section} class="hall" onpointermove={trackLight} aria-label="Work">
	<!-- gerbang lengkung: terang di luar, gelap di dalam, tanpa garis batas mendatar -->
	<div class="portal in" aria-hidden="true">
		<span class="ring"></span>
		<span class="arch"></span>
	</div>
	<div class="portal out" aria-hidden="true">
		<span class="arch"></span>
	</div>

	<div class="room" aria-hidden="true">
		<span
			class="lamplight"
			style="background: radial-gradient(48rem 48rem at {lightX}% {lightY}%, rgba(255,232,198,0.09), transparent 62%)"
		></span>
		<span class="texture"></span>
	</div>

	<div class="inner">
		<header class="head">
			<h2 class="work-heading reveal font-display" use:reveal={{ y: '12px', blur: 0 }}>
				<span>Recent</span><span class="work-italic">work.</span>
			</h2>
		</header>

		<!-- karya terbaru tampil paling besar -->
		<article class="feature">
			<button
				bind:this={cover}
				type="button"
				class="feature-cover"
				onclick={() => openViewer(0)}
				data-cursor="Play"
				aria-label="Play {latest.title} for {latest.brand}"
			>
				<img src={latest.cover} alt="Cover of the {latest.title} reel" />
				<span class="shade" aria-hidden="true"></span>
				<span class="fresh">Latest</span>
				<span class="play big" aria-hidden="true"></span>
			</button>

			<div class="feature-info">
				<h3 class="feature-title reveal font-display" use:reveal={{ delay: 80 }}>
					{latest.title.replaceAll('-', '‑')}
				</h3>
				<p class="feature-brand reveal" use:reveal={{ delay: 140 }}>
					{latest.brand} <span>· {latest.date}</span>
				</p>
				<ul class="roles reveal" use:reveal={{ delay: 200 }}>
					{#each latest.roles as role (role)}
						<li>{role}</li>
					{/each}
				</ul>
				<p class="feature-note reveal" use:reveal={{ delay: 260 }}>{latest.note}</p>
				<div class="actions reveal" use:reveal={{ delay: 320 }}>
					<button type="button" class="watch" onclick={() => openViewer(0)}>
						<span class="play small" aria-hidden="true"></span>
						Play reel
					</button>
					<a
						class="out"
						href="https://www.instagram.com/reel/{latest.code}/"
						target="_blank"
						rel="noreferrer noopener"
					>
						Open on Instagram
					</a>
				</div>
			</div>
		</article>

		<!-- sisanya berderet, tetap dengan nama brand dan perannya -->
		<div class="more">
			<div class="more-head">
				<p class="more-title reveal font-display" use:reveal={{ y: '12px', blur: 0 }}>More reels</p>
				<div class="more-controls">
					<p class="more-hint reveal" use:reveal={{ y: '12px', blur: 0 }}>
						{restCount} reels
					</p>
					<div class="rail-controls" role="group" aria-label="Browse reels">
						<button
							type="button"
							class="rail-arrow"
							aria-label="Previous reels"
							onclick={() => scrollRail(-1)}
						>
							<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m12.5 4.5-5 5.5 5 5.5" /></svg>
						</button>
						<button
							type="button"
							class="rail-arrow"
							aria-label="Next reels"
							onclick={() => scrollRail(1)}
						>
							<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7.5 4.5 5 5.5-5 5.5" /></svg>
						</button>
					</div>
				</div>
			</div>
			<ul bind:this={rail} class="grid" aria-label="More reels">
				{#each rest as item, i (item.id)}
					<li>
						<button
							type="button"
							class="tile reveal"
							use:reveal={{ delay: (i % 3) * 110, y: '40px' }}
							onclick={() => openViewer(i + 1)}
							data-cursor="Play"
							aria-label="Play {item.title} for {item.brand}, {item.roles.join(' and ')}"
						>
							<span class="crop">
								<img src={item.cover} alt="Cover of the {item.title} reel" loading="lazy" />
								<span class="tag" aria-hidden="true">{badge(item.roles)}</span>
								<span class="play" aria-hidden="true"></span>
							</span>
							<span class="tile-brand">{item.brand}</span>
							<span class="tile-title font-display">{item.title}</span>
						</button>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</section>

<style>
	.hall {
		--portal: clamp(9rem, 22vh, 14rem);
		position: relative;
		overflow: hidden;
		background: var(--color-noir);
		color: var(--color-ivory);
	}

	.room {
		position: absolute;
		inset: 0;
		pointer-events: none;
		/* suasana dipudarkan di kedua ujung supaya tidak ada tepi saat warna berganti */
		mask-image: linear-gradient(
			to bottom,
			transparent 0,
			#000 var(--portal),
			#000 calc(100% - var(--portal)),
			transparent 100%
		);
	}
	.lamplight,
	.texture {
		position: absolute;
		inset: 0;
	}
	.texture {
		opacity: 0.35;
		mix-blend-mode: overlay;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
	}

	/* --- gerbang masuk dan keluar --- */
	.portal {
		position: absolute;
		inset-inline: 0;
		height: var(--portal);
		overflow: hidden;
		pointer-events: none;
	}
	.portal.in {
		top: 0;
		background: var(--color-ivory);
	}
	.portal.out {
		bottom: 0;
		background: var(--color-mist);
	}
	/* lengkungnya lebih lebar dari layar supaya bahunya keluar dari tepi */
	.arch {
		position: absolute;
		left: 50%;
		width: 118vw;
		transform: translateX(-50%);
		background: var(--color-noir);
	}
	.portal.in .arch {
		top: 16%;
		bottom: -1px;
		border-radius: 50% 50% 0 0 / 40% 40% 0 0;
		box-shadow:
			inset 0 34px 60px -28px rgba(0, 0, 0, 0.85),
			0 -6px 70px rgba(255, 232, 196, 0.16);
	}
	.portal.out .arch {
		top: -1px;
		bottom: 18%;
		border-radius: 0 0 50% 50% / 0 0 40% 40%;
		box-shadow:
			inset 0 -34px 60px -28px rgba(0, 0, 0, 0.85),
			0 6px 70px rgba(255, 232, 196, 0.16);
	}
	.ring {
		position: absolute;
		left: 50%;
		top: 4%;
		bottom: 0;
		width: 132vw;
		transform: translateX(-50%);
		border: 1px solid color-mix(in srgb, var(--color-rose) 28%, transparent);
		border-bottom: 0;
		border-radius: 50% 50% 0 0 / 40% 40% 0 0;
	}

	.inner {
		position: relative;
		max-width: 1300px;
		margin-inline: auto;
		padding: calc(var(--portal) + 1.5rem) 1.5rem calc(var(--portal) + 2rem);
	}
	@media (min-width: 768px) {
		.inner {
			padding-inline: 3rem;
		}
	}

	.head {
		max-width: 1100px;
		margin-inline: auto;
		text-align: center;
	}
	.head::after {
		content: '';
		display: block;
		width: 3rem;
		height: 1px;
		margin: 1.05rem auto 0;
		background: color-mix(in srgb, var(--color-gold) 75%, transparent);
	}
	.work-heading {
		display: flex;
		justify-content: center;
		align-items: baseline;
		gap: 0.2em;
		font-size: clamp(3rem, 6.5vw, 5.5rem);
		font-weight: 300;
		line-height: 1;
		letter-spacing: -0.02em;
		color: var(--color-ivory);
		white-space: nowrap;
	}
	.work-italic {
		color: var(--color-gold);
		font-style: italic;
	}

	/* --- karya terbaru --- */
	.feature {
		position: relative;
		display: grid;
		gap: 2rem;
		margin: 2.8rem auto 0;
	}
	@media (min-width: 900px) {
		.feature {
			max-width: 1100px;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			align-items: center;
			gap: 0;
			margin-top: 3rem;
		}
		.feature::before {
			position: absolute;
			z-index: 1;
			top: 50%;
			left: 50%;
			width: 1px;
			height: 84%;
			transform: translate(-50%, -50%);
			background: color-mix(in srgb, var(--color-gold) 32%, transparent);
			content: '';
		}
	}

	.feature-cover {
		--open: 0;
		position: relative;
		display: block;
		width: min(100%, 15rem);
		aspect-ratio: 9 / 16;
		margin-inline: auto;
		overflow: hidden;
		/* lengkung atas mengecil sampai jadi sudut biasa saat terbuka penuh */
		border-radius: calc((1 - var(--open)) * 11rem + 0.6rem) calc((1 - var(--open)) * 11rem + 0.6rem)
			0.6rem 0.6rem;
		transform: scale(calc(0.86 + var(--open) * 0.14));
		transform-origin: 50% 100%;
		box-shadow:
			0 50px 90px -40px rgba(0, 0, 0, 0.95),
			0 0 0 1px color-mix(in srgb, var(--color-gold) 22%, transparent);
	}
	@media (min-width: 900px) {
		.feature-cover {
			width: min(100%, 17rem);
			height: auto;
			margin-inline: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.feature-cover {
			border-radius: 0.6rem;
			transform: none;
		}
	}
	.feature-cover img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 1.4s var(--ease-silk);
	}
	.feature-cover:hover img {
		transform: scale(1.04);
	}
	.feature-info {
		width: 100%;
		max-width: 36rem;
		margin-inline: auto;
		padding-inline: clamp(1rem, 5vw, 1.5rem);
		text-align: center;
	}
	.shade {
		position: absolute;
		inset: 0;
		background: linear-gradient(to top, rgba(20, 16, 15, 0.45), transparent 40%);
	}

	.fresh {
		position: absolute;
		top: 0.9rem;
		left: 0.9rem;
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		padding: 0.4rem 0.8rem 0.4rem 0.65rem;
		border-radius: 999px;
		font-size: 0.72rem;
		color: #fff;
		background: rgba(18, 14, 12, 0.55);
		backdrop-filter: blur(6px);
	}
	.fresh::before {
		content: '';
		width: 0.45rem;
		height: 0.45rem;
		border-radius: 999px;
		background: var(--color-gold);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-gold) 22%, transparent);
	}
	.feature-title {
		max-width: 24ch;
		margin-inline: auto;
		font-size: clamp(2rem, 3.8vw, 3.3rem);
		line-height: 1.04;
		font-weight: 300;
		text-wrap: balance;
	}
	.feature-brand {
		margin-top: 0.9rem;
		font-size: 0.92rem;
		color: var(--color-ivory);
	}
	.feature-brand span {
		color: color-mix(in srgb, var(--color-ivory) 55%, transparent);
	}
	.roles {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 1.1rem;
	}
	.roles li {
		padding: 0.4rem 0.9rem;
		border: 1px solid color-mix(in srgb, var(--color-gold) 40%, transparent);
		border-radius: 999px;
		font-size: 0.74rem;
		letter-spacing: 0.04em;
		color: color-mix(in srgb, var(--color-ivory) 82%, transparent);
	}
	.feature-note {
		margin-top: 1.2rem;
		margin-inline: auto;
		max-width: 30rem;
		font-size: 0.92rem;
		line-height: 1.75;
		color: color-mix(in srgb, var(--color-ivory) 66%, transparent);
	}
	.actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 1.4rem;
		margin-top: 1.6rem;
	}
	.watch {
		display: inline-flex;
		align-items: center;
		gap: 0.8rem;
		padding: 0.9rem 1.5rem 0.9rem 1rem;
		border-radius: 999px;
		background: var(--color-ivory);
		color: var(--color-noir);
		font-size: 0.86rem;
		transition:
			background-color 0.5s var(--ease-silk),
			transform 0.5s var(--ease-silk);
	}
	.watch:hover {
		background: var(--color-blush);
		transform: translateY(-2px);
	}
	.out {
		font-size: 0.86rem;
		color: color-mix(in srgb, var(--color-ivory) 72%, transparent);
		text-decoration: underline;
		text-decoration-color: color-mix(in srgb, var(--color-gold) 55%, transparent);
		text-underline-offset: 0.35em;
		transition: color 0.4s var(--ease-silk);
	}
	.out:hover {
		color: var(--color-ivory);
	}
	@media (min-width: 900px) {
		.feature {
			--feature-inset: clamp(2.75rem, 5vw, 4rem);
		}
		.feature .feature-cover {
			width: min(100%, 17rem);
			margin-left: 0;
			margin-right: var(--feature-inset);
			justify-self: end;
		}
		.feature .feature-info {
			justify-self: start;
			width: calc(100% - var(--feature-inset));
			max-width: 36rem;
			margin-left: var(--feature-inset);
			margin-right: 0;
			padding-inline: 0;
			text-align: left;
		}
		.feature .feature-title,
		.feature .feature-note {
			margin-inline: 0;
		}
		.feature .roles,
		.feature .actions {
			justify-content: flex-start;
		}
	}

	/* --- tombol putar, digambar dengan CSS --- */
	.play {
		position: absolute;
		top: 50%;
		left: 50%;
		display: grid;
		place-items: center;
		width: 3rem;
		height: 3rem;
		margin: -1.5rem 0 0 -1.5rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.7);
		background: rgba(18, 14, 12, 0.38);
		transition:
			background-color 0.6s var(--ease-silk),
			border-color 0.6s var(--ease-silk),
			transform 0.6s var(--ease-silk);
	}
	/* segitiga putar digambar dengan clip-path */
	.play::after {
		content: '';
		width: 0.62rem;
		height: 0.78rem;
		margin-left: 3px;
		background: #fff;
		clip-path: polygon(0 0, 100% 50%, 0 100%);
	}
	.play.big {
		width: 4.6rem;
		height: 4.6rem;
		margin: -2.3rem 0 0 -2.3rem;
	}
	.play.big::after {
		width: 0.9rem;
		height: 1.1rem;
		margin-left: 4px;
	}
	.play.small {
		position: relative;
		top: auto;
		left: auto;
		width: 1.9rem;
		height: 1.9rem;
		margin: 0;
		border: 0;
		background: var(--color-noir);
	}
	.play.small::after {
		width: 0.44rem;
		height: 0.56rem;
		margin-left: 2px;
	}
	.feature-cover:hover .play,
	.tile:hover .play,
	.tile:focus-visible .play {
		border-color: var(--color-gold);
		background: rgba(18, 14, 12, 0.6);
		transform: scale(1.08);
	}

	/* --- deretan karya lainnya --- */
	.more {
		max-width: 1100px;
		margin: 4.5rem auto 0;
	}
	.more-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}
	.more-title {
		font-size: clamp(1.4rem, 2.2vw, 1.8rem);
		font-style: italic;
		font-weight: 300;
		color: color-mix(in srgb, var(--color-ivory) 70%, transparent);
	}
	.more-hint {
		font-size: 0.68rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: color-mix(in srgb, var(--color-ivory) 48%, transparent);
	}
	.more-controls,
	.rail-controls {
		display: flex;
		align-items: center;
	}
	.more-controls {
		gap: 1rem;
	}
	.rail-controls {
		gap: 0.45rem;
	}
	.rail-arrow {
		display: grid;
		width: 2.25rem;
		height: 2.25rem;
		place-items: center;
		border: 1px solid color-mix(in srgb, var(--color-gold) 38%, transparent);
		border-radius: 50%;
		color: color-mix(in srgb, var(--color-ivory) 78%, transparent);
		transition:
			background-color 0.35s var(--ease-silk),
			border-color 0.35s var(--ease-silk),
			color 0.35s var(--ease-silk),
			transform 0.35s var(--ease-silk);
	}
	.rail-arrow:hover {
		transform: translateY(-1px);
		border-color: var(--color-gold);
		background: color-mix(in srgb, var(--color-gold) 16%, transparent);
		color: var(--color-ivory);
	}
	.rail-arrow svg {
		width: 1rem;
		height: 1rem;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.grid {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: min(55vw, 12.5rem);
		grid-template-rows: minmax(0, 1fr);
		gap: 1rem;
		margin-top: 1.5rem;
		padding-bottom: 1.2rem;
		overflow-x: auto;
		overflow-y: hidden;
		overscroll-behavior-inline: contain;
		scroll-snap-type: x mandatory;
		scroll-padding-inline: 0.25rem;
		scrollbar-color: color-mix(in srgb, var(--color-gold) 55%, transparent) transparent;
		scrollbar-width: thin;
	}
	@media (min-width: 700px) {
		.grid {
			grid-auto-columns: clamp(10.5rem, 12.5vw, 12.5rem);
			gap: 1.35rem;
		}
	}
	@media (min-width: 1200px) {
		.grid {
			gap: 1.5rem;
		}
	}
	.grid::-webkit-scrollbar {
		height: 0.3rem;
	}
	.grid::-webkit-scrollbar-track {
		background: color-mix(in srgb, var(--color-ivory) 10%, transparent);
	}
	.grid::-webkit-scrollbar-thumb {
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-gold) 55%, transparent);
	}
	.grid > li {
		min-width: 0;
		scroll-snap-align: start;
	}

	.tile {
		display: block;
		width: 100%;
		text-align: left;
	}
	.crop {
		position: relative;
		display: block;
		aspect-ratio: 9 / 16;
		overflow: hidden;
		border-radius: 0.5rem;
		box-shadow:
			0 30px 50px -30px rgba(0, 0, 0, 0.9),
			0 0 0 1px rgba(255, 236, 204, 0.08);
		transition: box-shadow 0.7s var(--ease-silk);
	}
	.crop img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: saturate(0.82) brightness(0.9);
		transition:
			filter 0.9s var(--ease-silk),
			transform 1.3s var(--ease-silk);
	}
	.tile:hover .crop img,
	.tile:focus-visible .crop img {
		filter: none;
		transform: scale(1.05);
	}
	.tile:hover .crop,
	.tile:focus-visible .crop {
		box-shadow:
			0 40px 60px -30px rgba(0, 0, 0, 1),
			0 0 0 1px color-mix(in srgb, var(--color-gold) 60%, transparent);
	}
	.tag {
		position: absolute;
		top: 0.55rem;
		left: 0.55rem;
		padding: 0.3rem 0.55rem;
		border-radius: 999px;
		font-size: 0.62rem;
		letter-spacing: 0.08em;
		color: #fff;
		background: rgba(18, 14, 12, 0.55);
		backdrop-filter: blur(6px);
	}
	.tile-brand {
		display: block;
		margin-top: 1rem;
		font-size: 0.74rem;
		letter-spacing: 0.06em;
		color: var(--color-gold);
	}
	.tile-title {
		display: -webkit-box;
		margin-top: 0.35rem;
		overflow: hidden;
		font-size: 1.02rem;
		line-height: 1.3;
		color: color-mix(in srgb, var(--color-ivory) 88%, transparent);
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		transition: color 0.5s var(--ease-silk);
	}
	.tile:hover .tile-title {
		color: var(--color-ivory);
	}
</style>
