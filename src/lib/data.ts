/**
 * Semua isi situs ada di file ini, jadi cukup ubah teks dan foto di sini.
 *
 * Isinya disusun dari profil resmi Larasati dan unggahan aslinya. Jangan
 * menambah angka, klien, atau testimoni yang tidak benar benar ada.
 *
 * Sampul galeri disimpan di `static/gallery/` lalu ditulis sebagai
 * `/gallery/nama-berkas.webp` pada properti `cover`.
 */

/**
 * Alamat situs yang sudah tayang, tanpa garis miring di akhir. Wajib diisi
 * supaya gambar pratinjau tautan (og:image) muncul di WhatsApp, LinkedIn,
 * dan media sosial lain, karena mereka hanya membaca alamat lengkap.
 */
export const siteUrl = '';

export const profile = {
	name: 'Larasati Putri Maharani',
	shortName: 'Larasati',
	/** dipakai sebagai monogram di navigasi */
	initials: 'Laras',
	role: 'MC, Voice Over and Model in Bandung',
	location: 'Bandung, Jawa Barat',
	/** kalimat pembuka bagian Tentang */
	intro:
		"Hi 👋 I'm Laras, an MC, voice over artist and on-camera talent based in Bandung. You may have heard my voice on @infobdgcom reels, or seen me hosting events around campus.",
	bio: [
		'I study Information Technology at Telkom University, where I also work as a teaching assistant for Programming Algorithms. Outside of class, I host events, voice brand content and appear on camera for promotional work.',
		"I've been at home in front of a crowd since my time as student council president at SMKN 1 Abang in Bali. At university I joined the public relations team of the IT student association, led its Bina Desa community programme of around 150 participants, and hosted five of its official events."
	],
	email: 'larasati.puan@gmail.com',
	socials: [
		{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/larasatimaharani' },
		{ label: 'GitHub', href: 'https://github.com/larasatiPuan' }
	]
};

/** Hal yang bisa dikerjakan bersama, tampil sebagai daftar di bagian Tentang. */
export const services = [
	{
		name: 'Master of Ceremony',
		text: 'Seminars, campus events and formal ceremonies. I work through the run-down with the organising team and keep the room with me from the opening to the final word.'
	},
	{
		name: 'Voice Over',
		text: 'Narration for brand reels and local media, from food and fitness to a new airline route.'
	},
	{
		name: 'Model',
		text: 'On-camera talent for promotional content, including work for METRO, GrabFood and Melinda Aesthetic Center.'
	}
];

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
 * Karya yang sudah tayang, satu blok untuk satu unggahan, diurutkan dari
 * yang paling baru tayang. Nomor romawinya mengikuti urutan tampil ini.
 * Sampulnya diunduh dari unggahan aslinya dan disimpan di `static/gallery/`, sedangkan videonya
 * diputar lewat sematan resmi Instagram saat dibuka.
 *
 * Untuk menambah satu karya, salin satu blok ke paling atas lalu ganti `code`
 * dengan kode di tautan reel (bagian setelah `/reel/`), simpan sampulnya
 * sebagai `static/gallery/reel-xx.webp`, dan tulis ulang keterangannya.
 * Isi `roles` boleh lebih dari satu kalau satu karya menuntut dua peran.
 * Jangan lupa menggeser nomor romawi karya lainnya.
 */
export const gallery: GalleryItem[] = [
	{
		id: 'r7',
		no: 'I',
		code: 'DfGsQL2hu7H',
		title: 'METRO One Day Super Special',
		roles: ['Model', 'Voice Over'],
		brand: 'METRO Department Store',
		account: '@infobdgcom',
		date: 'October 2026',
		topic: 'Retail and promotions',
		note: "Hosting METRO's one-day sale at Trans Studio Mall: up to 50% off, plus an extra 20% with Bank Mega and Allo PayLater.",
		cover: '/gallery/reel-07.webp'
	},
	{
		id: 'r6',
		no: 'II',
		code: 'DdOgwIVz71Z',
		title: "Bandung's Viral Food and GrabFood's Diskon Puas",
		roles: ['Model', 'Voice Over'],
		brand: 'GrabFood',
		account: '@infobdgcom',
		date: '13 September 2026',
		topic: 'Food and delivery',
		note: "A story every Bandung student renting a room knows: tired of queuing for the latest viral dish, she goes back to comfort food with GrabFood's Diskon Puas No Limit deal.",
		cover: '/gallery/reel-06.webp'
	},
	{
		id: 'r5',
		no: 'III',
		code: 'DcxjYBwPr1f',
		title: 'Road to Ionation 7th: Workout and Wellness',
		roles: ['Voice Over'],
		brand: 'Ion Water by Pocari Sweat',
		account: '@infobdgcom',
		date: '2 September 2026',
		topic: 'Sport and wellness',
		note: 'Narration for a group workout at Setiabudhi Social Club Bandung, part of the lead-up to the seventh Ionation fitness festival.',
		cover: '/gallery/reel-05.webp'
	},
	{
		id: 'r4',
		no: 'IV',
		code: 'DcLjH4APliX',
		title: 'Medikacom Carnaval: Creativity Without Limits',
		roles: ['Voice Over'],
		brand: 'SMK Medikacom',
		account: '@infobdgcom',
		date: '18 August 2026',
		topic: 'Education and school events',
		note: 'Narration for a school carnival, from traditional dress and decorated floats to a parade that stayed in step the whole way.',
		cover: '/gallery/reel-04.webp'
	},
	{
		id: 'r3',
		no: 'V',
		code: 'Db41xWjPf8K',
		title: 'Eiger Women Flagship Store Opens in Bandung',
		roles: ['Voice Over'],
		brand: 'Eiger',
		account: '@infobdgcom',
		date: '11 August 2026',
		topic: 'Retail and outdoor lifestyle',
		note: "Covering the opening of Eiger Women's flagship store on Jalan Sumatra, from the gear on the shelves to its lifetime warranty.",
		cover: '/gallery/reel-03.webp'
	},
	{
		id: 'r2',
		no: 'VI',
		code: 'DbnMTkfzvMC',
		title: 'Bandung to Denpasar, Non-Stop',
		roles: ['Voice Over'],
		brand: 'Garuda Indonesia',
		account: '@infobdgcom',
		date: '4 August 2026',
		topic: 'Aviation and travel',
		note: 'Narration announcing the new direct route from Husein Sastranegara Airport to Denpasar, with a look at the service on board.',
		cover: '/gallery/reel-02.webp'
	},
	{
		id: 'r1',
		no: 'VII',
		code: 'Dbfl901PIbp',
		title: 'A New Beauty Destination in Bandung',
		roles: ['Model', 'Voice Over'],
		brand: 'Melinda Aesthetic Center',
		account: '@infobdgcom',
		date: '1 August 2026',
		topic: 'Beauty and skincare',
		note: 'A walk through a newly opened aesthetic clinic in Bandung, from the consultation rooms to its treatment technology.',
		cover: '/gallery/reel-01.webp'
	}
];

/**
 * Logo brand untuk pita di bawah beranda. Berkasnya putih di atas latar
 * transparan dan hanya dipakai sebagai topeng, jadi warnanya selalu
 * mengikuti palet situs. `height` menyamakan bobot visual: logo yang
 * memanjang dibuat lebih pendek daripada logo yang bertumpuk.
 * `size` adalah tinggi tampil dalam rem, diatur manual per logo.
 * Kuncinya harus sama persis dengan `brand` di galeri.
 */
export const brandLogos: Record<
	string,
	{ src: string; width: number; height: number; size: number }
> = {
	'METRO Department Store': { src: '/brands/metro.png', width: 499, height: 160, size: 2.0 },
	GrabFood: { src: '/brands/grabfood.png', width: 840, height: 160, size: 1.6 },
	'Ion Water by Pocari Sweat': { src: '/brands/ionwater.png', width: 176, height: 160, size: 3.1 },
	'SMK Medikacom': { src: '/brands/medikacom.png', width: 691, height: 160, size: 1.85 },
	Eiger: { src: '/brands/eiger.png', width: 196, height: 160, size: 2.3 },
	'Garuda Indonesia': { src: '/brands/garuda.png', width: 816, height: 160, size: 2.3 }
};

export const timeline = [
	{
		year: '2026',
		title: 'Voice Over and On-Camera Talent, @infobdgcom',
		text: 'Since August I have narrated and appeared in promotional reels for Bandung brands, including GrabFood, Garuda Indonesia, Eiger and METRO.'
	},
	{
		year: '2025',
		title: 'Teaching Assistant, Programming Algorithms',
		text: 'Telkom University. I guide more than 40 students each semester through tutorial classes and grade their assignments and lab work.'
	},
	{
		year: '2025',
		title: 'Public Relations, IT Student Association',
		text: 'Project lead for Bina Desa, first secretary of the PROXIMITI orientation for 200 new students, and MC for five official association events.'
	},
	{
		year: '2024',
		title: 'Lab Assistant and Liaison Officer',
		text: 'Supported Programming Algorithms lab sessions at the Informatics Laboratory and served as a liaison officer for the PKKMB X Megabit 7.0 orientation.'
	},
	{
		year: '2023',
		title: 'Started at Telkom University',
		text: 'Began a degree in Information Technology, joined a web development bootcamp at Google Developer Student Club and the Hardware and Embedded Systems study group.'
	},
	{
		year: '2022',
		title: 'Student Council President, SMKN 1 Abang',
		text: 'Led the student council for a year after serving as vice president, while working as a graphic designer at Oka Print.'
	},
	{
		year: '2021',
		title: 'Forum Genre Bali and PIK-R',
		text: 'Two years running communication, information and education programmes for young people at district and provincial level.'
	}
];

/** Bagian halaman untuk navigasi dan penanda gulir. */
export const sections = [
	{ id: 'atas', label: 'Home' },
	{ id: 'tentang', label: 'About' },
	{ id: 'galeri', label: 'Work' },
	{ id: 'jejak', label: 'Experience' },
	{ id: 'kontak', label: 'Contact' }
];
