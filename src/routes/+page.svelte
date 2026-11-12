<script lang="ts">
	import { profile, siteUrl } from '$lib/data';
	import { i18n } from '$lib/i18n/index.svelte';
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

	const description = $derived(i18n.t.ui.meta.description(profile.name));

	const ogImage = `${siteUrl}/og.jpg`;

	// one watcher for the navigation and the scroll marker
	$effect(() => watchSections('work'));

	// the page is prerendered in English, so a returning visitor's saved
	// language is applied once the page is running in the browser
	$effect(() => i18n.restore());
</script>

<svelte:head>
	<title>{profile.name}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={profile.name} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={i18n.t.ui.meta.imageAlt} />
	<meta property="og:url" content="{siteUrl}/" />
	<link rel="canonical" href="{siteUrl}/" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={profile.name} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />
	<meta property="og:type" content="website" />
</svelte:head>

<!-- everything that floats lives outside the scroll layer so it stays fixed on screen -->
<Nav />
<Cursor />
<Lightbox />

<Smooth>
	<main>
		<Hero />
		<Marquee />
		<About />
		<!-- the dark and light transitions are handled inside Hall itself -->
		<Hall />
		<Timeline />
		<Seam from="var(--color-mist)" to="var(--color-ivory)" height="14vh" />
		<Contact />
	</main>
</Smooth>
