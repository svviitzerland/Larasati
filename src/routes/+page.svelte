<script lang="ts">
	import { profile, siteUrl } from '$lib/data';
	import { watchSections } from '$lib/ui.svelte';
	import Smooth from '$lib/components/Smooth.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import Cursor from '$lib/components/Cursor.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import About from '$lib/components/About.svelte';
	import Marquee from '$lib/components/Marquee.svelte';
	import Hall from '$lib/components/Hall.svelte';
	import Timeline from '$lib/components/Timeline.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import Lightbox from '$lib/components/Lightbox.svelte';
	import Seam from '$lib/components/Seam.svelte';

	const description = `${profile.name} is an MC, voice over artist and model based in Bandung. Explore her recent work and get in touch.`;

	const ogImage = `${siteUrl}/og.jpg`;

	// satu pemantau untuk navigasi dan penanda gulir
	$effect(() => watchSections('galeri'));
</script>

<svelte:head>
	<title>{profile.name}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={profile.name} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta
		property="og:image:alt"
		content="Larasati Putri Maharani, MC, voice over and model in Bandung"
	/>
	{#if siteUrl}<meta property="og:url" content="{siteUrl}/" />{/if}
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={profile.name} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />
	<meta property="og:type" content="website" />
</svelte:head>

<!-- semua yang melayang hidup di luar lapisan gulir supaya tetap menempel di layar -->
<Nav />
<Cursor />
<Lightbox />

<Smooth>
	<main>
		<Hero />
		<Marquee />
		<About />
		<!-- peralihan gelap dan terang ditangani di dalam Hall sendiri -->
		<Hall />
		<Timeline />
		<Seam from="var(--color-mist)" to="var(--color-ivory)" height="14vh" />
		<Contact />
	</main>
</Smooth>
