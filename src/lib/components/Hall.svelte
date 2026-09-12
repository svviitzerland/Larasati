<script lang="ts">
	import { tick } from 'svelte';
	import { crafts, gallery, type Craft } from '$lib/data';
	import { onFrame, onResize } from '$lib/scroll.svelte';
	import { openViewer } from '$lib/viewer.svelte';

	let section = $state<HTMLElement | null>(null);
	let stage = $state<HTMLElement | null>(null);
	let rail = $state<HTMLElement | null>(null);

	let pinned = $state(false);
	let height = $state(0);
	let active = $state(0);
	let progress = $state(0);

	let travel = 0;
	let railX = 0;

	// ruang masuk dan ruang keluar, tempat terang melebur jadi gelap
	// dan sebaliknya. Bingkai baru muncul setelah dinding benar benar gelap.
	let lead = $state(0);
	let tail = $state(0);

	// cahaya ruangan yang mengikuti kursor
	let lightX = $state(50);
	let lightY = $state(35);

	const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);
	const hang = ['0rem', '2.5rem', '1rem', '3.25rem'];

	// nama pendek untuk lencana di sudut sampul, ruangnya sempit
	const short: Record<Craft, string> = {
		'Master of Ceremony': 'MC',
		'Voice Over': 'VO',
		Model: 'Model'
	};
	const badge = (roles: Craft[]) => roles.map((role) => short[role]).join(' · ');

	async function measure() {
		if (!section || !rail || !stage) return;

		const wide = window.innerWidth >= 1024;
		const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		pinned = wide && !calm;

		// tunggu kelas terpasang dulu, karena lebar lorong hanya benar
		// setelah tata letak menyamping aktif
		await tick();

		if (!pinned) {
			height = 0;
			travel = 0;
			lead = 0;
			tail = 0;
			stage.style.transform = '';
			rail.style.transform = '';
			return;
		}

		lead = Math.round(window.innerHeight * 0.34);
		tail = Math.round(window.innerHeight * 0.34);
		travel = Math.max(rail.scrollWidth - window.innerWidth, 0);

		const next = lead + window.innerHeight + travel + tail;
		if (Math.abs(next - height) > 1) height = next;
	}

	$effect(() => {
		if (!section || !stage || !rail) return;

		measure();
		const stopResize = onResize(measure);

		const stopFrame = onFrame(() => {
			if (!pinned || !stage || !rail || !section) return;

			// jarak yang sudah ditempuh di dalam lorong, dihitung setelah
			// ruang masuk terlewati supaya bingkai selalu berada di dinding gelap
			const passed = clamp(-section.getBoundingClientRect().top - lead, 0, travel);
			stage.style.transform = `translate3d(0, ${passed.toFixed(2)}px, 0)`;

			const p = travel > 0 ? passed / travel : 0;
			const nextX = -p * travel;
			const swing = clamp((nextX - railX) * 0.06, -3.2, 3.2);
			railX = nextX;
			rail.style.transform = `translate3d(${railX.toFixed(2)}px, 0, 0) skewX(${swing.toFixed(2)}deg)`;

			progress = p;
			const index = clamp(Math.round(p * (gallery.length - 1)), 0, gallery.length - 1);
			if (index !== active) active = index;
		});

		return () => {
			stopResize();
			stopFrame();
		};
	});

	function trackLight(event: PointerEvent) {
		if (!section) return;
		const rect = section.getBoundingClientRect();
		lightX = ((event.clientX - rect.left) / rect.width) * 100;
		lightY = ((event.clientY - rect.top) / rect.height) * 100;
	}
</script>

<section
	id="galeri"
	bind:this={section}
	class="hall"
	class:pinned
	style:height={pinned ? `${height}px` : 'auto'}
	style:--lead={pinned ? `${lead}px` : undefined}
	style:--tail={pinned ? `${tail}px` : undefined}
	onpointermove={trackLight}
	aria-label="Galeri reel Instagram"
>
	<!-- gerbang lengkung, senada dengan bingkai potret di beranda.
	     Terang di luar, gelap di dalam, tanpa garis batas mendatar. -->
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
			style="background: radial-gradient(48rem 48rem at {lightX}% {lightY}%, rgba(255,232,198,0.1), transparent 62%)"
		></span>
		<span class="ceiling"></span>
		<span class="texture"></span>
	</div>

	<div bind:this={stage} class="stage">
		<div bind:this={rail} class="rail">
			<div class="intro">
				<p class="eyebrow label-caps">Galeri</p>
				<h2 class="font-display">
					Panggung,<br /><span class="gold">Suara, Layar</span>
				</h2>
				<p class="say">
					Tiga peran yang saya kerjakan, membawakan acara, mengisi suara, dan berdiri di depan
					kamera. Yang tersimpan di sini baru sebagiannya dan daftarnya masih terus bertambah.
				</p>
				<ul class="crafts">
					{#each crafts as craft (craft)}
						<li class="label-caps">{craft}</li>
					{/each}
				</ul>
				<p class="hint label-caps">
					{pinned ? 'Gulir untuk melihat karya berikutnya' : 'Ketuk sampul untuk memutar karya'}
				</p>
			</div>

			{#each gallery as item, i (item.id)}
				<button
					type="button"
					class="piece"
					class:near={i === active}
					style:--hang={hang[i % hang.length]}
					onclick={() => openViewer(i)}
					data-cursor="Putar"
					aria-label="Putar karya {item.no}, {item.title} bersama {item.brand}, sebagai {item.roles.join(
						' dan '
					)}"
				>
					<span class="lamp" aria-hidden="true"></span>
					<span class="cone" aria-hidden="true"></span>

					<span class="frame">
						<span class="mat">
							<span class="crop">
								<img
									src={item.cover}
									alt="Sampul reel {item.title} bersama {item.brand}"
									loading="lazy"
								/>
								<span class="tag label-caps" aria-hidden="true">{badge(item.roles)}</span>
								<span class="play" aria-hidden="true"></span>
							</span>
						</span>
						<span class="glass" aria-hidden="true"></span>
					</span>

					<span class="pool" aria-hidden="true"></span>

					<span class="plaque">
						<span class="no label-caps">{item.no} · {item.date}</span>
						<span class="title font-display">{item.title}</span>
						<span class="meta">{item.brand}</span>
						<span class="place">{item.account} · {item.topic}</span>
					</span>
				</button>
			{/each}

			<div class="outro">
				<p class="font-display">Daftar ini terus bertambah</p>
				<p class="say">Terbuka untuk kerja sama berikutnya.</p>
			</div>
		</div>

		<div class="hud" aria-hidden="true">
			<span class="count font-display">{gallery[active].no}</span>
			<span class="bar"><span style:transform="scaleX({progress})"></span></span>
			<span class="count muted font-display">{gallery[gallery.length - 1].no}</span>
		</div>
	</div>
</section>

<style>
	.hall {
		/* tinggi sampul di dalam lorong, dipakai ulang untuk menghitung lebar */
		--reel: min(50svh, 33rem);
		position: relative;
		overflow: hidden;
		background: var(--color-noir);
		color: var(--color-ivory);
	}

	.room {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}
	.lamplight,
	.ceiling,
	.texture {
		position: absolute;
		inset: 0;
	}

	/* semua lapisan suasana dipudarkan di kedua ujung supaya tidak ada
	   satu pun tepi yang terlihat saat warna berganti */
	.lamplight,
	.texture {
		mask-image: linear-gradient(
			to bottom,
			transparent 0,
			#000 var(--lead, 34vh),
			#000 calc(100% - var(--tail, 34vh)),
			transparent 100%
		);
	}
	.ceiling {
		top: var(--lead, 34vh);
		background: radial-gradient(90% 45% at 50% 0%, rgba(255, 236, 204, 0.12), transparent 70%);
		/* sinar langit langit ikut memudar di awal supaya tidak meninggalkan
		   garis tepat di tempat warna selesai berganti */
		mask-image: linear-gradient(to bottom, transparent 0, #000 22vh);
	}
	.texture {
		opacity: 0.4;
		mix-blend-mode: overlay;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
	}

	/* peralihan warna terjadi di dalam bagian ini sendiri, bukan lewat
	   elemen terpisah, sehingga tidak ada garis batas sama sekali */
	/* --- gerbang masuk dan keluar --- */
	.portal {
		position: absolute;
		inset-inline: 0;
		overflow: hidden;
		pointer-events: none;
	}
	.portal.in {
		top: 0;
		height: var(--lead, 34vh);
		background: var(--color-ivory);
	}
	.portal.out {
		bottom: 0;
		height: var(--tail, 34vh);
		background: var(--color-mist);
	}

	/* lengkungnya sengaja lebih lebar dari layar supaya bahunya keluar
	   dari tepi dan tidak menyisakan sudut yang bersiku */
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

	/* garis lengkung tipis mengelilingi gerbang */
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

	/* --- panggung yang menempel di layar selama bagian ini dilewati --- */
	.stage {
		position: relative;
		padding-block: 38vh;
	}
	.pinned .stage {
		position: absolute;
		inset-inline: 0;
		top: var(--lead, 0px);
		height: 100svh;
		display: flex;
		align-items: center;
		padding-block: 0;
		will-change: transform;
	}

	.rail {
		display: grid;
		gap: 5rem;
		padding-inline: 1.5rem;
	}
	@media (min-width: 640px) {
		.rail {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 4rem 2.5rem;
			padding-inline: 3rem;
		}
	}
	.pinned .rail {
		display: flex;
		align-items: center;
		gap: 5vw;
		width: max-content;
		padding-inline: 8vw;
		grid-template-columns: none;
		will-change: transform;
	}

	/* --- teks pembuka dan penutup lorong --- */
	.intro,
	.outro {
		max-width: 34rem;
	}
	.pinned .intro {
		width: 30rem;
		flex-shrink: 0;
	}
	.pinned .outro {
		width: 24rem;
		flex-shrink: 0;
	}
	.eyebrow {
		color: var(--color-gold);
		margin-bottom: 1.6rem;
	}
	.intro h2 {
		font-size: clamp(2.4rem, 5vw, 4rem);
		line-height: 1.02;
		font-weight: 300;
		margin-bottom: 1.8rem;
	}
	.gold {
		color: var(--color-gold);
		font-style: italic;
	}
	.say {
		font-size: 0.94rem;
		line-height: 1.95;
		color: color-mix(in srgb, var(--color-ivory) 58%, transparent);
	}
	.crafts {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 1.8rem;
	}
	.crafts li {
		padding: 0.5rem 0.8rem;
		color: color-mix(in srgb, var(--color-ivory) 62%, transparent);
		border: 1px solid color-mix(in srgb, var(--color-gold) 30%, transparent);
		border-radius: 999px;
	}

	.hint {
		margin-top: 1.8rem;
		color: color-mix(in srgb, var(--color-gold) 75%, transparent);
	}
	.outro .font-display {
		font-size: clamp(1.6rem, 3vw, 2.2rem);
		margin-bottom: 1rem;
	}

	/* --- satu karya --- */
	.piece {
		position: relative;
		display: block;
		width: 100%;
		max-width: 20rem;
		text-align: left;
		transition: transform 0.9s var(--ease-silk);
	}
	/* di lorong, tinggi gambar ditentukan layar sehingga tiap bingkai
	   punya lebar berbeda persis seperti dinding pameran sungguhan */
	.pinned .piece {
		width: auto;
		max-width: none;
		flex-shrink: 0;
		transform: translateY(var(--hang));
	}
	/* tinggi sampul ditentukan layar supaya satu bingkai utuh selalu muat
	   dalam sekali tampilan, lebarnya mengikuti perbandingan reel 9 : 16.
	   Lebar dihitung tegas, bukan diserahkan pada aspect-ratio, supaya
	   Safari tidak melebarkan bingkai melebihi gambarnya. */
	.pinned .crop {
		display: block;
		height: var(--reel);
		width: calc(var(--reel) * 0.5625);
	}
	.pinned .plaque {
		max-width: 18rem;
	}

	.lamp {
		position: absolute;
		top: -1.7rem;
		left: 50%;
		width: 3rem;
		height: 6px;
		margin-left: -1.5rem;
		border-radius: 999px;
		background: linear-gradient(180deg, #7a6a4e, var(--color-gold));
		box-shadow: 0 6px 18px rgba(255, 226, 170, 0.4);
	}
	.lamp::after {
		content: '';
		position: absolute;
		inset-inline: 30%;
		bottom: -3px;
		height: 4px;
		border-radius: 999px;
		background: #ffe9c2;
		filter: blur(2px);
	}

	.cone {
		position: absolute;
		top: -1.3rem;
		left: 50%;
		width: 190%;
		height: 128%;
		margin-left: -95%;
		clip-path: polygon(46% 0, 54% 0, 100% 100%, 0 100%);
		background: linear-gradient(to bottom, rgba(255, 233, 194, 0.28), rgba(255, 233, 194, 0) 74%);
		filter: blur(20px);
		opacity: 0.5;
		pointer-events: none;
		animation: flicker 7s ease-in-out infinite;
		transition: opacity 0.9s var(--ease-silk);
	}

	.frame {
		position: relative;
		display: block;
		padding: 0.6rem;
		background: linear-gradient(150deg, #4a3b30, #2a211c 55%, #3d3129);
		box-shadow:
			0 40px 60px -35px rgba(0, 0, 0, 0.95),
			inset 0 0 0 1px rgba(255, 226, 178, 0.18);
		transition: box-shadow 0.9s var(--ease-silk);
	}
	.mat {
		display: block;
		padding: 1rem;
		background: #ece2d5;
		box-shadow: inset 0 0 22px rgba(90, 70, 50, 0.22);
	}
	.crop {
		position: relative;
		display: block;
		width: 100%;
		aspect-ratio: 9 / 16;
		overflow: hidden;
	}
	.crop img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: saturate(0.8) brightness(0.88);
		transform: scale(1.01);
		transition:
			filter 1s var(--ease-silk),
			transform 1.5s var(--ease-silk);
	}
	/* penanda bahwa yang dibingkai adalah unggahan, bukan sekadar foto */
	.tag {
		position: absolute;
		top: 0.6rem;
		left: 0.6rem;
		padding: 0.32rem 0.5rem 0.3rem;
		font-size: 0.5rem;
		letter-spacing: 0.22em;
		color: rgba(255, 255, 255, 0.9);
		background: rgba(18, 14, 12, 0.42);
		border: 1px solid rgba(255, 255, 255, 0.24);
	}
	.play {
		position: absolute;
		top: 50%;
		left: 50%;
		display: grid;
		place-items: center;
		width: 3.2rem;
		height: 3.2rem;
		margin: -1.6rem 0 0 -1.6rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.62);
		background: rgba(18, 14, 12, 0.34);
		transition:
			background-color 0.7s var(--ease-silk),
			border-color 0.7s var(--ease-silk),
			transform 0.7s var(--ease-silk);
	}
	.play::after {
		content: '';
		margin-left: 3px;
		border-left: 11px solid rgba(255, 255, 255, 0.94);
		border-block: 7px solid transparent;
	}

	.glass {
		position: absolute;
		inset: 0.6rem;
		background: linear-gradient(118deg, rgba(255, 255, 255, 0.14) 0%, transparent 42%);
		opacity: 0.5;
		transition: opacity 0.9s var(--ease-silk);
		pointer-events: none;
	}
	.pool {
		position: absolute;
		left: 12%;
		right: 12%;
		height: 1.6rem;
		border-radius: 50%;
		background: radial-gradient(50% 50% at 50% 50%, rgba(255, 226, 178, 0.18), transparent 70%);
		opacity: 0;
		transition: opacity 0.9s var(--ease-silk);
	}

	.plaque {
		display: block;
		margin-top: 1.6rem;
		padding-left: 1rem;
		border-left: 1px solid color-mix(in srgb, var(--color-gold) 45%, transparent);
		transition:
			border-color 0.7s var(--ease-silk),
			transform 0.9s var(--ease-silk);
	}
	.plaque > * {
		display: block;
	}
	.plaque .no {
		color: color-mix(in srgb, var(--color-gold) 85%, transparent);
		margin-bottom: 0.6rem;
	}
	.title {
		font-size: 1.3rem;
		line-height: 1.3;
	}
	.meta {
		margin-top: 0.5rem;
		font-size: 0.78rem;
		color: color-mix(in srgb, var(--color-ivory) 48%, transparent);
	}
	.place {
		margin-top: 0.25rem;
		font-size: 0.72rem;
		font-style: italic;
		color: color-mix(in srgb, var(--color-ivory) 32%, transparent);
	}

	.piece:hover,
	.piece:focus-visible,
	.piece.near {
		transform: translateY(calc(var(--hang, 0rem) - 0.5rem));
	}
	.piece:hover .cone,
	.piece:focus-visible .cone,
	.piece.near .cone {
		opacity: 1;
	}
	.piece:hover .crop img,
	.piece:focus-visible .crop img,
	.piece.near .crop img {
		filter: saturate(1.04) brightness(1.02);
		transform: scale(1.06);
	}
	.piece:hover .play,
	.piece:focus-visible .play,
	.piece.near .play {
		border-color: var(--color-gold);
		background: rgba(18, 14, 12, 0.55);
		transform: scale(1.08);
	}
	.piece:hover .frame,
	.piece:focus-visible .frame {
		box-shadow:
			0 60px 80px -40px rgba(0, 0, 0, 1),
			inset 0 0 0 1px color-mix(in srgb, var(--color-gold) 55%, transparent);
	}
	.piece:hover .glass,
	.piece:focus-visible .glass {
		opacity: 0.85;
	}
	.piece:hover .pool,
	.piece:focus-visible .pool,
	.piece.near .pool {
		opacity: 1;
	}
	.piece:hover .plaque,
	.piece:focus-visible .plaque {
		border-color: var(--color-gold);
		transform: translateX(4px);
	}

	/* --- penunjuk posisi di dalam lorong --- */
	.hud {
		display: none;
	}
	.pinned .hud {
		position: absolute;
		bottom: 2.6rem;
		left: 8vw;
		right: 8vw;
		display: flex;
		align-items: center;
		gap: 1.2rem;
	}
	.count {
		font-size: 0.9rem;
		letter-spacing: 0.2em;
		color: var(--color-gold);
	}
	.muted {
		color: color-mix(in srgb, var(--color-ivory) 30%, transparent);
	}
	.bar {
		position: relative;
		flex: 1;
		height: 1px;
		background: color-mix(in srgb, var(--color-ivory) 16%, transparent);
	}
	.bar span {
		position: absolute;
		inset: 0;
		transform-origin: left;
		background: var(--color-gold);
	}

	@media (prefers-reduced-motion: reduce) {
		.cone {
			animation: none;
		}
	}
</style>
