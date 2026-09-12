<script lang="ts">
	import {
		paperEntries,
		paperHeads,
		paperLines,
		paperNameLines,
		profile,
		type PaperKind
	} from '$lib/data';
	import { onResize } from '$lib/scroll.svelte';

	let section = $state<HTMLElement | null>(null);
	let grid = $state<HTMLElement | null>(null);
	let lineEl = $state<HTMLElement | null>(null);
	let leadEl = $state<HTMLElement | null>(null);
	let trailEl = $state<HTMLElement | null>(null);
	let markEl = $state<HTMLElement | null>(null);

	/**
	 * Satu ketukan mengerjakan dua hal sekaligus. Halaman di belakangnya
	 * dicetak ulang dari awal, rupa dan isinya berganti seluruhnya, dan pada
	 * saat yang sama satu huruf berikutnya jatuh ke tempatnya.
	 *
	 * Setelah namanya lengkap, kertasnya tidak berhenti berganti. Ketukannya
	 * cuma melambat dan namanya tinggal di sana, satu satunya hal yang tetap
	 * sementara segala yang tercetak di sekitarnya terus berubah.
	 *
	 * Karena barisnya ditengahkan ulang tiap ada huruf baru, nama itu tumbuh
	 * ke kiri dan ke kanan dari titik tengah layar sementara kalimat di
	 * sekitarnya terdorong keluar.
	 */
	const NAME = profile.name;
	const LETTERS = [...NAME];

	let shown = $state(0);
	let head = $state('');
	let tail = $state('');

	const written = $derived(LETTERS.slice(0, shown).join(''));
	const whole = $derived(shown >= LETTERS.length);

	const ROWS = 13;
	const ANCHOR = Math.floor(ROWS / 2);
	const indexes = Array.from({ length: ROWS }, (_, i) => i);

	/** spasi mati, sebab spasi biasa di ujung dipangkas oleh tata letak flex */
	const GAP = String.fromCharCode(160);
	/** tanda baca yang harus menempel, tidak boleh didahului spasi */
	const cling = /^[,.;:!?)\]»]/;

	const pick = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];
	/** satu baris koran, sengaja panjang supaya terpotong di kedua tepi layar */
	const strip = (n = 3) => Array.from({ length: n }, () => pick(paperLines)).join(' ');

	/** dua lema yang berbeda, dipakai sebagai baris pengantar */
	const pair = () => {
		const first = pick(paperEntries);
		let second = pick(paperEntries);
		while (second === first) second = pick(paperEntries);
		return `${first} · ${second}`;
	};

	/** satu baris indeks, tiga lema berbeda dengan titik penuntun dan nomornya */
	const index = () =>
		[...paperEntries]
			.sort(() => Math.random() - 0.5)
			.slice(0, 3)
			.map(
				(lema) =>
					`${lema} ${'.'.repeat(10 + Math.floor(Math.random() * 14))} ${12 + Math.floor(Math.random() * 240)}`
			)
			.join('     ');

	/**
	 * Bahan penyambung di kiri dan kanan namanya. Bentuknya mengikuti rupa
	 * halaman, dan panjangnya sengaja berlebih supaya barisnya selalu lewat
	 * kedua tepi layar, berapa pun huruf yang sudah tercetak.
	 */
	const filler = (kind: PaperKind) => (kind === 'indeks' ? index() : strip(2));

	/**
	 * Bentuk baris yang mungkin ada di sebuah halaman cetak. Bukan cuma badan
	 * berita, tetapi juga tajuk, baris pengantar, entri indeks, dan garis
	 * pemisah antar rubrik.
	 */
	type RowKind = 'kicker' | 'judul' | 'dek' | 'badan' | 'kabar' | 'caps' | 'indeks' | 'garis';

	type Face = {
		family: string;
		size: number;
		weight: number;
		style: string;
		caps: string;
		track: number;
	};

	const faces: Record<Exclude<RowKind, 'garis'>, Face> = {
		kicker: {
			family: 'var(--font-sans)',
			size: 0.62,
			weight: 400,
			style: 'normal',
			caps: 'uppercase',
			track: 0.2
		},
		judul: {
			family: 'var(--font-display)',
			size: 1.34,
			weight: 600,
			style: 'normal',
			caps: 'none',
			track: -0.012
		},
		dek: {
			family: 'var(--font-display)',
			size: 0.98,
			weight: 400,
			style: 'italic',
			caps: 'none',
			track: 0.01
		},
		badan: {
			family: 'var(--font-display)',
			size: 1,
			weight: 400,
			style: 'normal',
			caps: 'none',
			track: 0
		},
		kabar: {
			family: 'var(--font-sans)',
			size: 0.78,
			weight: 300,
			style: 'normal',
			caps: 'none',
			track: 0
		},
		caps: {
			family: 'var(--font-display)',
			size: 0.88,
			weight: 500,
			style: 'normal',
			caps: 'uppercase',
			track: 0.12
		},
		indeks: {
			family: 'var(--font-sans)',
			size: 0.66,
			weight: 400,
			style: 'normal',
			caps: 'none',
			track: 0.06
		}
	};

	/** wajah huruf untuk kalimat yang mengapit namanya, mengikuti rupa halaman */
	const anchorFaces: Record<PaperKind, Face> = {
		berita: {
			family: 'var(--font-display)',
			size: 1,
			weight: 500,
			style: 'normal',
			caps: 'none',
			track: 0
		},
		judul: {
			family: 'var(--font-display)',
			size: 1.3,
			weight: 600,
			style: 'normal',
			caps: 'none',
			track: -0.012
		},
		indeks: {
			family: 'var(--font-sans)',
			size: 0.74,
			weight: 400,
			style: 'normal',
			caps: 'uppercase',
			track: 0.16
		},
		takarir: {
			family: 'var(--font-sans)',
			size: 0.72,
			weight: 300,
			style: 'italic',
			caps: 'none',
			track: 0.02
		}
	};

	/**
	 * Empat rupa halaman. Satu dipilih acak pada tiap ketukan, jadi kertas di
	 * belakang namanya berganti rupa dan bukan cuma berganti kalimat. Tiap
	 * rupa menentukan susunan barisnya dan, yang lebih penting, sebagai apa
	 * namanya dicetak di baris tengah.
	 */
	const pages: { anchor: PaperKind; rows: RowKind[] }[] = [
		{
			// halaman koran
			anchor: 'judul',
			rows: [
				'kicker',
				'judul',
				'dek',
				'garis',
				'badan',
				'kabar',
				'badan',
				'badan',
				'badan',
				'garis',
				'kicker',
				'kabar',
				'badan'
			]
		},
		{
			// halaman buku
			anchor: 'berita',
			rows: [
				'badan',
				'badan',
				'badan',
				'badan',
				'garis',
				'dek',
				'badan',
				'badan',
				'badan',
				'badan',
				'badan',
				'garis',
				'caps'
			]
		},
		{
			// halaman indeks arsip
			anchor: 'indeks',
			rows: [
				'caps',
				'garis',
				'indeks',
				'indeks',
				'indeks',
				'indeks',
				'indeks',
				'indeks',
				'indeks',
				'indeks',
				'garis',
				'kicker',
				'kabar'
			]
		},
		{
			// halaman majalah
			anchor: 'takarir',
			rows: [
				'kicker',
				'kabar',
				'garis',
				'judul',
				'dek',
				'badan',
				'badan',
				'badan',
				'kabar',
				'garis',
				'caps',
				'badan',
				'kabar'
			]
		}
	];

	/** isi baris, panjang pendeknya sengaja berbeda menurut bentuknya */
	const words = (kind: RowKind) => {
		if (kind === 'judul') return pick(paperHeads);
		if (kind === 'dek' || kind === 'caps') return pick(paperLines);
		if (kind === 'kicker') return pair();
		if (kind === 'indeks') return index();
		return strip(3);
	};

	/**
	 * Jeda sebelum ketukan berikutnya. Selama namanya masih dieja, temponya
	 * melambat menjelang huruf terakhir seperti mesin yang kehabisan putaran.
	 * Sesudah lengkap, temponya turun sekali lagi jadi irama halaman yang
	 * dibalik pelan pelan, bukan lagi ketikan.
	 */
	const pace = () => {
		if (shown >= LETTERS.length) return 460 + Math.random() * 260;
		const done = shown / LETTERS.length;
		return 78 + done * done * 300 + Math.random() * 46;
	};

	$effect(() => {
		if (!section || !grid) return;

		const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const rows = [...grid.querySelectorAll<HTMLElement>('.row')];

		/**
		 * Mencetak satu halaman baru seutuhnya. Rupanya dipilih acak, jadi
		 * baris yang tadinya tajuk bisa jadi entri indeks pada ketukan
		 * berikutnya. Sisa rupa lama selalu dihapus lebih dulu supaya tidak
		 * ada garis pemisah yang tertinggal di bawah kalimat.
		 */
		const print = () => {
			const page = pick(pages);

			for (let i = 0; i < rows.length; i++) {
				if (i === ANCHOR) continue;

				const far = Math.abs(i - ANCHOR);
				// jari jari blur dibatasi, sebab biayanya naik cepat sekali dan
				// baris terjauh toh sudah nyaris tidak terlihat karena redup
				const row = rows[i];
				row.style.filter = `blur(${Math.min(far * 0.45, 2.4).toFixed(2)}px)`;
				row.style.opacity = `${Math.max(0.2, 0.94 - far * 0.1).toFixed(2)}`;

				const kind = page.rows[i];
				if (kind === 'garis') {
					row.textContent = '';
					row.style.setProperty('--w', `${30 + Math.floor(Math.random() * 44)}%`);
					row.style.background =
						'linear-gradient(to right, transparent, color-mix(in srgb, var(--color-ink) 26%, transparent) 12%, color-mix(in srgb, var(--color-ink) 26%, transparent) 88%, transparent) center / var(--w) 1px no-repeat';
					continue;
				}

				const face = faces[kind];
				row.style.background = 'none';
				row.textContent = words(kind);
				row.style.fontFamily = face.family;
				row.style.fontSize = `${(face.size * (0.95 + Math.random() * 0.12)).toFixed(3)}em`;
				row.style.fontWeight = `${face.weight}`;
				row.style.fontStyle = face.style;
				row.style.textTransform = face.caps;
				row.style.letterSpacing = `${(face.track + Math.random() * 0.012).toFixed(3)}em`;
				row.style.transform = `translateX(${(Math.random() * 16 - 8).toFixed(1)}%)`;
			}

			// kalimat yang mengapit namanya ikut berganti rupa tiap ketukan
			const anchor = anchorFaces[page.anchor];
			for (const el of [leadEl, trailEl]) {
				if (!el) continue;
				el.style.fontFamily = anchor.family;
				el.style.fontSize = `${anchor.size}em`;
				el.style.fontWeight = `${anchor.weight}`;
				el.style.fontStyle = anchor.style;
				el.style.textTransform = anchor.caps;
				el.style.letterSpacing = `${anchor.track}em`;
			}

			const [before, , after] = pick(paperNameLines[page.anchor]).split(/(\bLaras\b)/);
			// Kalimatnya selalu disambung di kedua sisi, sebab namanya harus
			// selalu terbaca di tengah tulisan, tidak pernah di ujung baris.
			const rest = after.trimStart();
			const start = before.trimEnd();
			// kalau namanya jatuh di ujung kalimatnya sendiri, sambungannya
			// dipisah titik tengah supaya tidak terbaca sebagai satu kalimat
			const lead = start ? `${filler(page.anchor)} ${start}` : `${filler(page.anchor)} ·`;
			const trail = rest ? `${rest} ${filler(page.anchor)}` : `· ${filler(page.anchor)}`;
			head = `${lead}${GAP}`;
			tail = `${cling.test(rest) ? '' : GAP}${trail}`;
		};

		// halaman pertama sudah tercetak sebelum bagian ini terlihat
		print();

		// kalau gerak diminta ditenangkan, namanya langsung tampil utuh
		if (calm) shown = LETTERS.length;

		let timer = 0;
		const beat = () => {
			print();
			// spasi dijatuhkan bersama huruf sesudahnya, supaya tidak ada
			// ketukan yang terlihat kosong di sela kata
			if (shown < LETTERS.length) {
				shown = Math.min(shown + (LETTERS[shown] === ' ' ? 2 : 1), LETTERS.length);
			}
			timer = window.setTimeout(beat, pace());
		};

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					// kertas disorot dulu sebentar, baru huruf pertama dipukul
					if (!calm && !timer) timer = window.setTimeout(beat, 420);
				} else {
					clearTimeout(timer);
					timer = 0;
				}
			},
			{ threshold: 0.35 }
		);
		observer.observe(section);

		return () => {
			observer.disconnect();
			clearTimeout(timer);
		};
	});

	/**
	 * Barisnya digeser sampai titik tengah namanya jatuh tepat di tengah
	 * layar, jadi yang bergerak adalah kalimat di kanan kirinya, bukan
	 * namanya. `offsetLeft` tidak terpengaruh transform, jadi aman diukur
	 * langsung.
	 */
	function centre() {
		if (!lineEl || !markEl) return;
		const middle = markEl.offsetLeft + markEl.offsetWidth / 2;
		lineEl.style.transform = `translateX(${-middle.toFixed(2)}px)`;
	}

	/** dihitung ulang tiap kali namanya bertambah atau kertasnya berganti */
	$effect(() => {
		void head;
		void tail;
		void shown;
		centre();
	});

	/**
	 * Huruf cetaknya baru selesai dimuat belakangan dan lebar barisnya ikut
	 * berubah, jadi penengahannya diulang sekali lagi setelah itu dan setiap
	 * kali ukuran layar berubah.
	 */
	$effect(() => {
		document.fonts?.ready.then(centre);
		return onResize(centre);
	});
</script>

<section bind:this={section} class="paper" aria-label="Sekilas tentang Larasati">
	<span class="glow" aria-hidden="true"></span>

	<div bind:this={grid} class="rows">
		{#each indexes as i (i)}
			{#if i === ANCHOR}
				<div class="row anchor">
					<span bind:this={lineEl} class="line">
						<span bind:this={leadEl} class="lead">{head}</span><mark
							bind:this={markEl}
							class="hit"
							class:whole
						>
							<span class="say">{NAME}</span>
							<span class="ch" aria-hidden="true">{written}</span>
						</mark><span bind:this={trailEl} class="trail">{tail}</span>
					</span>
				</div>
			{:else}
				<div class="row" aria-hidden="true"></div>
			{/if}
		{/each}
	</div>

	<!-- tepi halaman dilarutkan ke kertas, jadi barisnya tidak terpotong siku -->
	<span class="fade side" aria-hidden="true"></span>
	<span class="fade top" aria-hidden="true"></span>
	<span class="grain" aria-hidden="true"></span>

	<p class="folio label-caps" aria-hidden="true">Arsip · Bandung · hal. 214</p>
</section>

<style>
	.paper {
		position: relative;
		display: grid;
		place-items: center;
		min-height: 100svh;
		overflow: hidden;
		background: var(--color-mist);
	}

	/* cahaya baca yang jatuh tepat di baris tengah */
	.glow {
		position: absolute;
		inset: 0;
		background: radial-gradient(
			44rem 18rem at 50% 50%,
			color-mix(in srgb, #fff 78%, transparent),
			transparent 70%
		);
		pointer-events: none;
	}

	/* Tinggi tiap baris dikunci, jadi seberapa pun isinya berubah, tidak ada
	   satu pun baris yang bergeser naik atau turun. */
	.rows {
		--row: clamp(1.9rem, 5.2vh, 3.1rem);
		--name: clamp(1.2rem, 2.4vw, 1.9rem);
		position: relative;
		z-index: 1;
		display: grid;
		grid-auto-rows: var(--row);
		width: 100%;
		font-family: var(--font-display);
		font-size: clamp(1.1rem, 2.1vw, 1.7rem);
		color: var(--color-ink);
	}

	/* Di layar sempit halamannya diperbesar, seolah dilihat lebih dekat,
	   supaya nama di tengah tetap terbaca jelas. */
	@media (max-width: 700px) {
		.rows {
			--row: clamp(2.5rem, 7.2vh, 3.6rem);
			--name: clamp(1.6rem, 6.6vw, 2.2rem);
			font-size: clamp(1.35rem, 4.6vw, 1.8rem);
		}
		.line {
			font-size: 1.4em;
		}
	}

	.row {
		display: flex;
		align-items: center;
		justify-content: center;
		height: var(--row);
		overflow: hidden;
		white-space: nowrap;
		line-height: var(--row);
		contain: content;
	}

	/* baris kalimat utama, tetap satu baris teks biasa seperti yang lain */
	.anchor {
		position: relative;
		z-index: 2;
		display: block;
	}
	.line {
		position: absolute;
		top: 0;
		left: 50%;
		display: flex;
		align-items: center;
		height: 100%;
		white-space: nowrap;
		font-weight: 500;
	}

	/* Satu satunya yang tidak pernah berpindah dari tengah layar, dan satu
	   satunya yang ukurannya tidak ikut rupa halaman. */
	.hit {
		position: relative;
		z-index: 0;
		display: flex;
		align-items: baseline;
		white-space: nowrap;
		color: var(--color-ink);
		background: none;
		padding: 0 0.06em;
		font-family: var(--font-display);
		font-size: var(--name);
		font-style: normal;
		font-weight: 600;
		text-transform: none;
		letter-spacing: 0.02em;
	}

	/* nama utuh untuk pembaca layar, tidak ikut menentukan lebar */
	.say {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
	}

	/* Hurufnya satu rupa sejak huruf pertama dan muncul apa adanya, tanpa
	   gerak sama sekali. Yang bergerak di bagian ini cuma halamannya. */
	.ch {
		white-space: pre;
	}

	/* Sapuan stabilonya dibuat sebagai lapisan tersendiri di belakang huruf,
	   sedikit lebih pendek dari tinggi baris, ujungnya membulat tidak rata,
	   dan miring tipis seperti coretan tangan. Sapuannya baru dijalankan
	   setelah huruf terakhir jatuh, sebagai penutup. */
	.hit::before {
		content: '';
		position: absolute;
		z-index: -1;
		inset: 17% -0.14em 13% -0.12em;
		border-radius: 0.42em 0.2em 0.34em 0.26em / 0.7em 0.5em 0.6em 0.44em;
		transform: rotate(-0.7deg) skewX(-1.5deg);
		background-image: linear-gradient(
			100deg,
			color-mix(in srgb, var(--color-blush) 62%, transparent),
			color-mix(in srgb, var(--color-blush) 96%, transparent) 18%,
			color-mix(in srgb, var(--color-blush) 86%, transparent) 74%,
			color-mix(in srgb, var(--color-blush) 58%, transparent)
		);
		background-repeat: no-repeat;
		background-size: 0% 100%;
		filter: blur(0.35px);
		transition: background-size 1s cubic-bezier(0.42, 0.06, 0.2, 1) 200ms;
	}
	.hit.whole::before {
		background-size: 100% 100%;
	}

	/* --- perabot halaman --- */
	.fade,
	.grain {
		position: absolute;
		inset: 0;
		z-index: 3;
		pointer-events: none;
	}
	.side {
		background:
			linear-gradient(to right, var(--color-mist), transparent 16%),
			linear-gradient(to left, var(--color-mist), transparent 16%);
	}
	.top {
		background:
			linear-gradient(to bottom, var(--color-mist), transparent 14%),
			linear-gradient(to top, var(--color-mist), transparent 14%);
	}
	.grain {
		z-index: 4;
		opacity: 0.5;
		mix-blend-mode: multiply;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.28'/%3E%3C/svg%3E");
	}

	.folio {
		position: absolute;
		z-index: 5;
		bottom: clamp(1.6rem, 5vh, 3rem);
		left: 50%;
		transform: translateX(-50%);
		white-space: nowrap;
		color: color-mix(in srgb, var(--color-ink) 34%, transparent);
	}

	@media (prefers-reduced-motion: reduce) {
		.hit::before {
			transition: none;
		}
	}
</style>
