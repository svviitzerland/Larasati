import type { Craft } from '$lib/data';
import type { Interface } from './en';

/**
 * Indonesian text for the whole site. Everything here mirrors the English
 * content in `src/lib/data.ts` and `./en.ts`, so a change there needs the same
 * change here. A reel or timeline entry with no translation falls back to
 * English.
 *
 * Voice: first person with "saya", plain and warm, the way Larasati would
 * write to a client. Role names (MC, Voice Over, Model) and event names stay
 * as they are used in the industry.
 */
export const ui: Interface = {
	meta: {
		description: (name) =>
			`${name} adalah MC, voice over talent, dan model di Bandung. Lihat karya terbarunya dan hubungi langsung.`,
		imageAlt: 'Larasati Putri Maharani, MC, voice over, dan model di Bandung'
	},
	nav: {
		top: 'Kembali ke atas',
		cta: 'Hubungi Saya',
		openMenu: 'Buka menu',
		closeMenu: 'Tutup menu',
		language: 'Bahasa'
	},
	hero: { see: 'Lihat karya' },
	brands: {
		label: 'Brand yang pernah bekerja sama dengan Larasati',
		play: (brand) => `Putar reel ${brand}`
	},
	about: { heading: ['Senang', 'berkenalan.'], services: 'Yang saya kerjakan' },
	work: {
		heading: ['Karya', 'terbaru.'],
		latest: 'Terbaru',
		playReel: 'Putar reel',
		instagram: 'Buka di Instagram',
		more: 'Reel lainnya',
		count: (total) => `${total} reel`,
		play: (title, brand) => `Putar ${title} untuk ${brand}`,
		playAs: (title, brand, roles: Craft[]) =>
			`Putar ${title} untuk ${brand}, ${roles.join(' dan ')}`,
		cover: (title) => `Sampul reel ${title}`
	},
	timeline: { heading: ['Pengalaman', 'sejauh ini.'] },
	contact: {
		heading: ['Ada rencana', 'acara atau proyek?'],
		say: 'Saya terbuka untuk acara, voice over, dan kampanye brand. Kirim email berisi tanggal, lokasi, dan sedikit cerita tentang rencana Anda.'
	},
	viewer: {
		label: 'Pemutar reel Instagram',
		closePlayer: 'Tutup pemutar',
		frame: (title) => `Reel Instagram: ${title}`,
		work: 'Karya',
		role: 'Peran',
		client: 'Klien',
		topic: 'Topik',
		account: 'Akun',
		aired: 'Tayang',
		close: 'Tutup',
		previous: 'Reel sebelumnya',
		next: 'Reel berikutnya',
		tally: (current, total) => `${current} dari ${total}`
	}
};

export const profile = {
	role: 'MC, Voice Over, dan Model di Bandung',
	intro:
		'Halo 👋 Saya Laras, MC, voice over talent, dan model di Bandung. Mungkin Anda pernah mendengar suara saya di reel @infobdgcom, atau melihat saya membawakan acara di kampus.',
	bio: [
		'Saya kuliah Teknologi Informasi di Telkom University, sekaligus menjadi asisten dosen untuk mata kuliah Algoritma Pemrograman. Di luar kelas, saya membawakan acara, mengisi voice over untuk berbagai brand, dan menjadi model untuk kampanye promosi.',
		'Saya sudah terbiasa tampil di depan banyak orang sejak menjadi ketua OSIS di SMKN 1 Abang, Bali. Di kampus, saya bergabung dengan tim humas himpunan mahasiswa Teknologi Informasi, memimpin program Bina Desa yang diikuti sekitar 150 peserta, dan menjadi MC di lima acara resmi himpunan.'
	]
};

/** keyed by the service name in `data.ts` */
export const services: Record<string, string> = {
	'Master of Ceremony':
		'Seminar, acara kampus, dan acara resmi. Saya membahas rundown bersama panitia, lalu menjaga perhatian audiens dari pembukaan sampai kalimat penutup.',
	'Voice Over':
		'Narasi untuk reel brand dan media lokal, mulai dari kuliner dan olahraga sampai rute penerbangan baru.',
	Model: 'Kampanye promosi, di antaranya untuk METRO, GrabFood, dan Melinda Aesthetic Center.'
};

/** keyed by the reel `id` in `data.ts` */
export const gallery: Record<
	string,
	{ title?: string; date: string; topic: string; note: string }
> = {
	r8: {
		date: '10 November 2026',
		topic: 'Gaya hidup dan acara kampus',
		note: 'Liputan FIT ALARM POP-UP TAKEOVER di Telkom University, saat Fitbar dan Alpha Drive One membawa pengalaman Look Good, Feel Good, Do Good ke kampus.'
	},
	r7: {
		date: 'Oktober 2026',
		topic: 'Ritel dan promosi',
		note: 'Membawakan promo satu hari METRO di Trans Studio Mall: diskon hingga 50%, ditambah 20% dengan Bank Mega dan Allo PayLater.'
	},
	r6: {
		title: 'Makanan Viral Bandung dan Diskon Puas GrabFood',
		date: '13 September 2026',
		topic: 'Kuliner dan pesan antar',
		note: 'Cerita yang akrab bagi anak kos di Bandung: capek mengantre makanan yang lagi viral, ia kembali ke makanan andalannya lewat promo Diskon Puas No Limit dari GrabFood.'
	},
	r5: {
		date: '2 September 2026',
		topic: 'Olahraga dan kebugaran',
		note: 'Narasi untuk sesi olahraga bersama di Setiabudhi Social Club Bandung, bagian dari rangkaian menuju festival kebugaran Ionation yang ketujuh.'
	},
	r4: {
		title: 'Medikacom Carnaval: Kreativitas Tanpa Batas',
		date: '18 Agustus 2026',
		topic: 'Pendidikan dan acara sekolah',
		note: 'Narasi untuk karnaval sekolah, dari busana adat dan kendaraan hias sampai barisan pawai yang kompak sepanjang jalan.'
	},
	r3: {
		title: 'Eiger Women Flagship Store Buka di Bandung',
		date: '11 Agustus 2026',
		topic: 'Ritel dan gaya hidup outdoor',
		note: 'Liputan pembukaan flagship store Eiger Women di Jalan Sumatra, dari perlengkapan di raknya sampai garansi seumur hidup.'
	},
	r2: {
		title: 'Bandung ke Denpasar, Tanpa Transit',
		date: '4 Agustus 2026',
		topic: 'Penerbangan dan perjalanan',
		note: 'Narasi pengumuman rute langsung baru dari Bandara Husein Sastranegara ke Denpasar, sekaligus memperlihatkan layanan di dalam pesawat.'
	},
	r1: {
		title: 'Destinasi Cantik Baru di Bandung',
		date: '1 Agustus 2026',
		topic: 'Kecantikan dan perawatan kulit',
		note: 'Berkeliling klinik estetika yang baru dibuka di Bandung, dari ruang konsultasi sampai teknologi perawatannya.'
	}
};

/** in the same order as `timeline` in `data.ts` */
export const timeline = [
	{
		title: 'Voice Over dan Model, @infobdgcom',
		text: 'Sejak Agustus, saya mengisi narasi dan tampil di reel promosi untuk brand di Bandung, di antaranya GrabFood, Garuda Indonesia, Eiger, dan METRO.'
	},
	{
		title: 'Asisten Dosen, Algoritma Pemrograman',
		text: 'Telkom University. Setiap semester saya mendampingi lebih dari 40 mahasiswa di kelas tutorial, lalu menilai tugas dan praktikum mereka.'
	},
	{
		title: 'Humas, Himpunan Mahasiswa Teknologi Informasi',
		text: 'Ketua pelaksana Bina Desa, sekretaris satu orientasi PROXIMITI untuk 200 mahasiswa baru, dan MC di lima acara resmi himpunan.'
	},
	{
		title: 'Asisten Praktikum dan Liaison Officer',
		text: 'Mendampingi praktikum Algoritma Pemrograman di Laboratorium Informatika, dan menjadi liaison officer pada orientasi PKKMB X Megabit 7.0.'
	},
	{
		title: 'Mulai Kuliah di Telkom University',
		text: 'Memulai studi Teknologi Informasi, mengikuti bootcamp web development di Google Developer Student Club, dan bergabung dengan kelompok studi Hardware and Embedded Systems.'
	},
	{
		title: 'Ketua OSIS, SMKN 1 Abang',
		text: 'Memimpin OSIS selama setahun setelah sebelumnya menjadi wakil ketua, sambil bekerja sebagai desainer grafis di Oka Print.'
	},
	{
		title: 'Forum Genre Bali dan PIK-R',
		text: 'Dua tahun menjalankan program komunikasi, informasi, dan edukasi untuk remaja di tingkat kabupaten dan provinsi.'
	}
];

/** keyed by the section `id` in `data.ts` */
export const sections: Record<string, string> = {
	home: 'Beranda',
	about: 'Tentang',
	work: 'Karya',
	experience: 'Pengalaman',
	contact: 'Kontak'
};
