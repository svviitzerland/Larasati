<script lang="ts">
	import { profile } from '$lib/data';
	import { watchSections } from '$lib/ui.svelte';
	import Smooth from '$lib/components/Smooth.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import Cursor from '$lib/components/Cursor.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Ticker from '$lib/components/Ticker.svelte';
	import About from '$lib/components/About.svelte';
	import Hall from '$lib/components/Hall.svelte';
	import Focus from '$lib/components/Focus.svelte';
	import Timeline from '$lib/components/Timeline.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import Lightbox from '$lib/components/Lightbox.svelte';
	import Seam from '$lib/components/Seam.svelte';

	const description = `Portofolio ${profile.name}, ${profile.role}. Galeri karya sebagai pembawa acara, pengisi suara, dan model, pengalaman, dan kontak kerja sama.`;

	// satu pemantau untuk navigasi dan penanda gulir
	$effect(() => watchSections('galeri'));
</script>

<svelte:head>
	<title>{profile.name}, {profile.role}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={profile.name} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
</svelte:head>

<!-- semua yang melayang hidup di luar lapisan gulir supaya tetap menempel di layar -->
<Nav />
<Cursor />
<Lightbox />

<Smooth>
	<main>
		<Hero />
		<Ticker />
		<About />
		<!-- peralihan gelap dan terang ditangani di dalam Hall sendiri -->
		<Hall />
		<Focus />
		<Timeline />
		<Seam from="var(--color-mist)" to="var(--color-ivory)" height="14vh" />
		<Contact />
	</main>
</Smooth>
