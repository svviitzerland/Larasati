/**
 * Semua isi situs ada di file ini, jadi cukup ubah teks dan foto di sini.
 *
 * Isinya disusun dari profil resmi Larasati. Angka angka yang dipakai juga
 * diambil apa adanya dari sana, bukan karangan, supaya tetap bisa
 * dipertanggungjawabkan kalau ada yang bertanya.
 *
 * Sampul galeri disimpan di `static/gallery/` lalu ditulis sebagai
 * `/gallery/nama-berkas.webp` pada properti `cover`.
 */

export const profile = {
	name: 'Larasati Putri Maharani',
	shortName: 'Larasati',
	/** dipakai sebagai monogram di navigasi */
	initials: 'Laras',
	role: 'Mahasiswa Teknologi Informasi dan Master of Ceremony',
	location: 'Bandung, Jawa Barat',
	intro:
		'Saya belajar Teknologi Informasi di Telkom University, mengajar algoritma pemrograman sebagai asisten dosen, dan berdiri di depan mikrofon ketika himpunan punya acara. Ketiganya menuntut hal yang sama, persiapan yang rapi dan kemampuan membaca ruangan.',
	bio: [
		'Sejak Januari 2025 saya menjadi asisten dosen Algoritma Pemrograman di Universitas Telkom, mendampingi lebih dari empat puluh mahasiswa setiap semester. Sebelumnya saya asisten praktikum untuk mata kuliah yang sama, menemani mereka membedah logika dan menelusuri kesalahan kode baris demi baris.',
		'Di Himpunan Mahasiswa Teknologi Informasi saya bekerja di Divisi Hubungan Masyarakat. Dari sana saya memimpin program Bina Desa yang melibatkan sekitar seratus lima puluh peserta, menjadi Sekretaris I kaderisasi PROXIMITI untuk dua ratus mahasiswa, dan membawakan sekitar lima acara resmi sebagai pembawa acara.',
		'Kebiasaan berdiri di depan orang banyak sudah dimulai jauh sebelum kuliah, dari Ketua OSIS di SMKN 1 Abang sampai Forum Genre Provinsi Bali. Latar multimedia dan pengalaman sebagai desainer grafis membuat saya terbiasa memikirkan dua hal sekaligus, isi acaranya dan bagaimana ia terlihat.'
	],
	email: 'larasati.puan@gmail.com',
	socials: [
		{ label: 'Instagram', href: 'https://www.instagram.com/larasati.puan/' },
		{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/larasatimaharani' },
		{ label: 'GitHub', href: 'https://github.com/larasatiPuan' }
	]
};

export const stats = [
	{ value: 40, suffix: '+', label: 'Mahasiswa dibimbing tiap semester' },
	{ value: 200, suffix: '', label: 'Peserta kaderisasi PROXIMITI' },
	{ value: 150, suffix: '', label: 'Peserta program Bina Desa' },
	{ value: 5, suffix: '', label: 'Acara resmi dibawakan' }
];

export const tickerWords = [
	'Master of Ceremony',
	'Voice Over',
	'Model',
	'Asisten Dosen',
	'Algoritma Pemrograman',
	'Java',
	'Public Relations',
	'Pengembangan Web',
	'Desain Grafis',
	'Public Speaking'
];

/** Dua sisi profesi yang ditampilkan berdampingan. */
export const facets = [
	{
		no: '01',
		title: 'Di Balik Layar',
		subtitle: 'Teknologi',
		text: 'Mengajarkan logika pemrograman kepada mahasiswa, menelusuri kesalahan kode bersama mereka, dan menilai hasil praktikum. Di luar kelas, saya belajar pengembangan web dan sistem tertanam.',
		skills: [
			'Java',
			'Algoritma dan Struktur Data',
			'Pengembangan Web',
			'Sistem Tertanam',
			'Desain Grafis',
			'Multimedia'
		]
	},
	{
		no: '02',
		title: 'Di Atas Panggung',
		subtitle: 'Panggung dan Suara',
		text: 'Membawakan acara resmi himpunan, memimpin program pengabdian di desa, dan mengurus kaderisasi ratusan mahasiswa baru. Semuanya berawal dari satu kebiasaan, berani memegang mikrofon.',
		skills: [
			'Master of Ceremony',
			'Voice Over',
			'Model',
			'Public Speaking',
			'Hubungan Masyarakat',
			'Manajemen Acara'
		]
	}
];

/**
 * Kumpulan kalimat untuk bagian sorot bergaya koran. Kalimat kalimat ini
 * diacak lalu diganti dengan tempo cepat sebagai latar, sementara nama
 * Laras di tengah layar tetap diam.
 */
export const paperLines = [
	'Empat puluh mahasiswa duduk menunggu sesi responsi dimulai pada sore itu.',
	'Logika pemrograman dibedah pelan pelan sampai semua orang paham alurnya.',
	'Kesalahan kode ditelusuri baris demi baris hingga penyebabnya ketemu.',
	'Empat belas jurnal praktikum diperiksa satu per satu sebelum tenggat.',
	'Seratus lima puluh peserta hadir dalam program Bina Desa di Pasir Endah.',
	'Dua ratus mahasiswa baru dikawal melewati rangkaian kaderisasi.',
	'Mikrofon dinyalakan, susunan acara dibaca ulang, lalu ruangan menyimak.',
	'Rundown berubah di menit terakhir dan tidak ada tamu yang menyadarinya.',
	'Divisi hubungan masyarakat menyiapkan setiap detail acara resmi himpunan.',
	'Antarmuka yang rapi lahir dari persiapan yang sama telitinya dengan rundown.',
	'Java dipakai untuk menjelaskan konsep yang tadinya terasa berat.',
	'Desain poster dikerjakan malam hari, presentasi dibawakan keesokan paginya.',
	'Ketua OSIS belajar berbicara di depan ratusan siswa sejak bangku sekolah.',
	'Forum Genre mengajarkan cara menyampaikan pesan agar benar benar sampai.',
	'Sistem tertanam dipelajari bersama teman teman satu kelompok studi.',
	'Kesan pertama dibangun dalam tiga puluh detik yang pertama.',
	'Setiap ruangan punya karakter sendiri dan harus dibaca lebih dulu.',
	'Pembukaan yang ringkas ternyata lebih diingat daripada sambutan panjang.',
	'Bandung menjadi tempat semua kebiasaan itu bertemu dalam satu jadwal.',
	'Acara berjalan sesuai rencana karena setiap kemungkinan sudah disiapkan.'
];

/** Kalimat pendek berhuruf judul, dipakai untuk baris tajuk. */
export const paperHeads = [
	'Rundown Berubah di Menit Terakhir',
	'Empat Puluh Mahasiswa Menunggu Responsi',
	'Mikrofon Dinyalakan, Ruangan Menyimak',
	'Bina Desa Menutup Pekan dengan Sorak',
	'Dua Ratus Nama Baru Masuk Daftar Hadir',
	'Logika Dibedah Sampai Semua Paham',
	'Kesan Pertama Dibangun Tiga Puluh Detik',
	'Panggung Kecil di Ujung Ruang Kuliah',
	'Suara yang Sampai ke Baris Paling Belakang',
	'Persiapan Rapi Menyelamatkan Satu Acara'
];

/** Lema untuk halaman indeks, disusul titik titik dan nomor halaman. */
export const paperEntries = [
	'Algoritma Pemrograman',
	'Bina Desa, Pasir Endah',
	'Kaderisasi PROXIMITI',
	'Forum Genre Bali',
	'Hubungan Masyarakat',
	'Informatics Laboratory',
	'Master of Ceremony',
	'Sistem Tertanam',
	'Voice Over',
	'Desain Grafis',
	'PKKMB Megabit',
	'Ketua OSIS'
];

/** Bentuk cetakan tempat namanya bisa muncul. */
export type PaperKind = 'berita' | 'judul' | 'indeks' | 'takarir';

/**
 * Kalimat yang memuat nama Laras, dikelompokkan menurut bentuk cetakannya.
 * Halaman boleh berganti rupa sesuka hati, dari berita ke indeks ke takarir,
 * tetapi namanya selalu jatuh di titik tengah layar.
 *
 * Syaratnya satu, tiap kalimat harus memuat kata Laras persis sekali dan
 * berdiri sendiri, sebab kata itulah yang ditukar dengan nama lengkapnya.
 */
export const paperNameLines: Record<PaperKind, string[]> = {
	berita: [
		'Empat puluh mahasiswa tiap semester belajar algoritma bersama Laras di kelas responsi.',
		'Himpunan menyerahkan mikrofon kepada Laras ketika acara resmi harus dibuka.',
		'Program Bina Desa dengan seratus lima puluh peserta dipimpin oleh Laras sebagai ketua.',
		'Dua ratus mahasiswa baru dikawal Laras melewati rangkaian kaderisasi PROXIMITI.',
		'Di daftar asisten dosen Algoritma Pemrograman, nama Laras sudah tercatat sejak 2025.'
	],
	judul: [
		'Mikrofon Diserahkan kepada Laras Ketika Acara Dibuka',
		'Laras Memimpin Bina Desa di Pasir Endah',
		'Dua Ratus Mahasiswa Baru Dikawal Laras',
		'Laras Tercatat sebagai Asisten Dosen Sejak 2025'
	],
	indeks: [
		'Laras · pembawa acara · hal. 214',
		'Laras · asisten dosen · hal. 87',
		'Laras · pengisi suara · hal. 132',
		'Laras · hubungan masyarakat · hal. 45'
	],
	takarir: [
		'Foto: Laras memimpin Bina Desa di Pasir Endah, 2025',
		'Dokumentasi: Laras membawakan acara resmi himpunan',
		'Arsip 2026 · HMTI · Laras, Divisi Hubungan Masyarakat',
		'Takarir: Laras di ruang praktikum Informatics Laboratory'
	]
};

/** Tiga peran yang dikerjakan di depan panggung, mikrofon, dan kamera. */
export type Craft = 'Master of Ceremony' | 'Voice Over' | 'Model';

/** urutannya dipakai sebagai keterangan singkat di bawah judul galeri */
export const crafts: Craft[] = ['Master of Ceremony', 'Voice Over', 'Model'];

export type GalleryItem = {
	id: string;
	no: string;
	/** kode pendek reel di Instagram, dipakai untuk pemutar sematan */
	code: string;
	title: string;
	roles: Craft[];
	brand: string;
	account: string;
	/** tanggal tayang, ditulis apa adanya untuk pelat nama */
	date: string;
	topic: string;
	note: string;
	cover: string;
};

/**
 * Karya yang sudah tayang, satu blok untuk satu unggahan. Sampulnya diunduh
 * dari unggahan aslinya dan disimpan di `static/gallery/`, sedangkan videonya
 * diputar lewat sematan resmi Instagram saat dibuka.
 *
 * Untuk menambah satu karya, salin satu blok di bawah lalu ganti `code`
 * dengan kode di tautan reel (bagian setelah `/reel/`), simpan sampulnya
 * sebagai `static/gallery/reel-xx.webp`, dan tulis ulang keterangannya.
 * Isi `roles` boleh lebih dari satu kalau satu karya menuntut dua peran.
 */
export const gallery: GalleryItem[] = [
	{
		id: 'r1',
		no: 'I',
		code: 'Dbfl901PIbp',
		title: 'Destinasi Cantik Baru di Bandung',
		roles: ['Model', 'Voice Over'],
		brand: 'Melinda Aesthetic Center',
		account: '@infobdgcom',
		date: '1 Agustus 2026',
		topic: 'Kecantikan dan perawatan kulit',
		note: 'Menyusuri klinik kecantikan yang baru dibuka di Bandung, dari ruang konsultasi sampai teknologi perawatan yang ditawarkan.',
		cover: '/gallery/reel-01.webp'
	},
	{
		id: 'r2',
		no: 'II',
		code: 'DbnMTkfzvMC',
		title: 'Bandung ke Denpasar Terbang Langsung',
		roles: ['Voice Over'],
		brand: 'Garuda Indonesia',
		account: '@infobdgcom',
		date: '4 Agustus 2026',
		topic: 'Penerbangan dan perjalanan',
		note: 'Mengisi narasi kabar rute langsung Bandung menuju Denpasar lewat Bandara Husein Sastranegara, lengkap dengan gambaran layanan di dalam pesawat.',
		cover: '/gallery/reel-02.webp'
	},
	{
		id: 'r3',
		no: 'III',
		code: 'Db41xWjPf8K',
		title: 'Eiger Women Flagship Store Buka di Bandung',
		roles: ['Voice Over'],
		brand: 'Eiger',
		account: '@infobdgcom',
		date: '11 Agustus 2026',
		topic: 'Peritel dan gaya hidup luar ruang',
		note: 'Meliput pembukaan gerai utama Eiger Women di Jalan Sumatra, berkeliling dari rak perlengkapan sampai layanan garansi seumur hidup.',
		cover: '/gallery/reel-03.webp'
	},
	{
		id: 'r4',
		no: 'IV',
		code: 'DcLjH4APliX',
		title: 'Medikacom Carnaval, Kreativitas Tanpa Batas',
		roles: ['Voice Over'],
		brand: 'SMK Medikacom',
		account: '@infobdgcom',
		date: '18 Agustus 2026',
		topic: 'Pendidikan dan acara sekolah',
		note: 'Mengisi narasi liputan karnaval sekolah, dari busana daerah dan kendaraan hias sampai kekompakan peserta di sepanjang jalan.',
		cover: '/gallery/reel-04.webp'
	},
	{
		id: 'r5',
		no: 'V',
		code: 'DcxjYBwPr1f',
		title: 'Road to Ionation 7th, Workout dan Wellness',
		roles: ['Voice Over'],
		brand: 'Ion Water by Pocari Sweat',
		account: '@infobdgcom',
		date: '2 September 2026',
		topic: 'Olahraga dan kebugaran',
		note: 'Mengisi narasi sesi olahraga bersama di Setiabudhi Social Club Bandung, rangkaian menuju festival kebugaran Ionation ketujuh.',
		cover: '/gallery/reel-05.webp'
	}
];

export const timeline = [
	{
		year: '2025',
		title: 'Asisten Dosen Algoritma Pemrograman',
		text: 'Universitas Telkom. Membimbing lebih dari empat puluh mahasiswa tiap semester lewat kelas responsi, lalu menilai tugas dan hasil praktikum mereka.'
	},
	{
		year: '2025',
		title: 'Divisi Hubungan Masyarakat HMTI',
		text: 'Ketua pelaksana Bina Desa untuk seratus lima puluh peserta, Sekretaris I PROXIMITI untuk dua ratus mahasiswa, sekaligus pembawa acara di lima acara resmi.'
	},
	{
		year: '2024',
		title: 'Asisten Praktikum dan Liaison Officer',
		text: 'Mendampingi praktikum Algoritma Pemrograman di Informatics Laboratory, dan menjadi penghubung peserta pada PKKMB X Megabit 7.0.'
	},
	{
		year: '2024',
		title: 'Kelompok Studi Hardware and Embedded System',
		text: 'Mendalami sistem tertanam bersama kelompok studi, melengkapi sisi perangkat keras dari ilmu yang dipelajari di kelas.'
	},
	{
		year: '2023',
		title: 'Mulai kuliah dan bergabung dengan GDSC',
		text: 'Masuk Teknologi Informasi Telkom University, lalu mengikuti bootcamp pengembangan web di Google Developer Student Club.'
	},
	{
		year: '2022',
		title: 'Ketua OSIS SMKN 1 Abang',
		text: 'Memimpin organisasi siswa selama satu tahun setelah sebelumnya menjadi wakil ketua, sambil bekerja sebagai desainer grafis di Oka Print.'
	},
	{
		year: '2021',
		title: 'Forum Genre Bali dan PIK-R',
		text: 'Mengurus komunikasi, informasi, dan edukasi untuk remaja di tingkat kabupaten dan provinsi selama dua tahun.'
	}
];

/** Bagian halaman untuk navigasi dan penanda gulir. */
export const sections = [
	{ id: 'atas', label: 'Beranda' },
	{ id: 'tentang', label: 'Tentang' },
	{ id: 'galeri', label: 'Galeri' },
	{ id: 'jejak', label: 'Pengalaman' },
	{ id: 'kontak', label: 'Kontak' }
];
