<script lang="ts">
	import { profile } from '$lib/data';
	import { i18n, locales } from '$lib/i18n/index.svelte';
	import { glideTo, glideToId, motion, onFrame } from '$lib/scroll.svelte';
	import { ui } from '$lib/ui.svelte';
	import { magnetic } from '$lib/actions/motion';

	// the call-to-action button already goes to the contact section, so the
	// link is not repeated in the middle row
	const sections = $derived(i18n.t.sections);
	const t = $derived(i18n.t.ui.nav);
	const links = $derived(
		sections.filter((section) => section.id !== 'home' && section.id !== 'contact')
	);
	const sheetLinks = $derived(sections.filter((section) => section.id !== 'home'));
	const atContact = $derived(sections[ui.active]?.id === 'contact');

	let compact = $state(false);
	let open = $state(false);
	let hover = $state<number | null>(null);

	let list = $state<HTMLElement | null>(null);
	let items = $state<HTMLElement[]>([]);
	let markX = $state(0);
	let markW = $state(0);
	let markOn = $state(false);

	// which link is hovered or currently being read
	const spot = $derived(
		hover !== null ? hover : links.findIndex((link) => link.id === sections[ui.active]?.id)
	);

	// the marker slides to the highlighted link
	$effect(() => {
		const el = items[spot];
		// the labels change width with the language, so measure again then
		void i18n.locale;
		if (!list || !el) {
			markOn = false;
			return;
		}
		markX = el.offsetLeft;
		markW = el.offsetWidth;
		markOn = true;
	});

	$effect(() => {
		return onFrame((state) => {
			const next = state.y > 40;
			if (next !== compact) compact = next;
		});
	});

	function go(id: string) {
		open = false;
		glideToId(id);
	}
</script>

<header class:compact class:open class:dark={ui.dark}>
	<div class="shell">
		<button type="button" class="mark" onclick={() => glideTo(0)} aria-label={t.top}>
			<span class="mono font-display" style:--progress="{motion.progress * 100}%">
				{profile.initials}
			</span>
		</button>

		<nav bind:this={list} class="links" onpointerleave={() => (hover = null)}>
			<span
				class="marker"
				class:on={markOn}
				style:transform="translate3d({markX}px, 0, 0)"
				style:width="{markW}px"
				aria-hidden="true"
			></span>

			{#each links as link, i (link.id)}
				<button
					bind:this={items[i]}
					type="button"
					class="link"
					class:on={spot === i}
					onpointerenter={() => (hover = i)}
					onclick={() => go(link.id)}
				>
					{link.label}
				</button>
			{/each}
		</nav>

		<div class="end">
			<!-- the language changes in place and the choice is remembered -->
			<div class="lang" class:second={i18n.locale === 'id'} role="group" aria-label={t.language}>
				{#each locales as locale (locale.code)}
					<button
						type="button"
						lang={locale.code}
						aria-label={locale.name}
						aria-pressed={i18n.locale === locale.code}
						onclick={() => i18n.set(locale.code)}
					>
						{locale.label}
					</button>
				{/each}
			</div>

			<button
				type="button"
				class="cta"
				class:on={atContact}
				use:magnetic={0.2}
				onclick={() => go('contact')}
				data-cursor
			>
				<span>{t.cta}</span>
				<span class="pip"></span>
			</button>

			<button
				type="button"
				class="burger"
				onclick={() => (open = !open)}
				aria-expanded={open}
				aria-label={open ? t.closeMenu : t.openMenu}
			>
				<span></span>
				<span></span>
			</button>
		</div>
	</div>

	<div class="sheet">
		{#each sheetLinks as link, i (link.id)}
			<button
				type="button"
				class="sheet-link font-display"
				style:transition-delay="{open ? 100 + i * 70 : 0}ms"
				onclick={() => go(link.id)}
			>
				<span class="idx">0{i + 1}</span>
				{link.label}
			</button>
		{/each}
	</div>
</header>

<style>
	header {
		position: fixed;
		top: 0;
		left: 50%;
		z-index: 70;
		width: min(100%, 1180px);
		padding: 1.4rem 1rem 0;
		transform: translateX(-50%);
		color: var(--color-ink);
		transition: color 0.7s var(--ease-silk);
	}
	header.dark {
		color: var(--color-ivory);
	}

	/* one floating bar that shrinks once the page scrolls */
	/* three columns with equal left and right sides, so the row of links
	   in the middle is not shifted by the width of the monogram */
	.shell {
		position: relative;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: 0.75rem;
		/* left and right must match exactly, or the row of links in the
		   middle shifts */
		padding: 0.5rem;
		border-radius: 999px;
		border: 1px solid transparent;
		transition:
			padding 0.9s var(--ease-silk),
			background-color 0.9s var(--ease-silk),
			border-color 0.9s var(--ease-silk),
			box-shadow 0.9s var(--ease-silk),
			backdrop-filter 0.9s var(--ease-silk);
	}
	header.compact .shell {
		background: color-mix(in srgb, var(--color-ivory) 72%, transparent);
		border-color: color-mix(in srgb, var(--color-sand) 70%, transparent);
		box-shadow: 0 30px 60px -45px rgba(60, 40, 35, 0.7);
		backdrop-filter: blur(10px);
	}
	header.compact.dark .shell {
		background: color-mix(in srgb, var(--color-noir) 55%, transparent);
		border-color: color-mix(in srgb, var(--color-gold) 22%, transparent);
	}

	/* --- wordmark that fills with the scroll position --- */
	.mark {
		display: inline-flex;
		align-items: center;
		justify-self: start;
		padding: 0.55rem 0.8rem;
		border-radius: 999px;
	}
	.mono {
		--progress-color: var(--color-roseink);
		--wordmark-base: color-mix(in srgb, currentColor 62%, transparent);
		font-size: 1.45rem;
		font-style: italic;
		font-weight: 600;
		letter-spacing: -0.035em;
		background: linear-gradient(
			90deg,
			var(--progress-color) 0%,
			var(--progress-color) var(--progress),
			var(--wordmark-base) var(--progress),
			var(--wordmark-base) 100%
		);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
	header.dark .mono {
		--progress-color: var(--color-gold);
	}

	/* --- links with a sliding marker --- */
	.links {
		position: relative;
		display: none;
		align-items: center;
		justify-self: center;
		gap: 0.2rem;
	}
	@media (min-width: 900px) {
		.links {
			display: flex;
		}
	}
	.marker {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-blush) 70%, transparent);
		opacity: 0;
		transition:
			transform 0.75s var(--ease-silk),
			width 0.75s var(--ease-silk),
			opacity 0.5s var(--ease-silk),
			background-color 0.7s var(--ease-silk);
	}
	.marker.on {
		opacity: 1;
	}
	header.dark .marker {
		background: color-mix(in srgb, var(--color-gold) 26%, transparent);
	}

	.link {
		position: relative;
		padding: 0.7rem 1.15rem;
		font-size: 0.63rem;
		letter-spacing: 0.24em;
		text-transform: uppercase;
		opacity: 0.62;
		transition: opacity 0.5s var(--ease-silk);
	}
	.link.on,
	.link:hover {
		opacity: 1;
	}

	.end {
		display: flex;
		align-items: center;
		justify-self: end;
		grid-column: 3;
		gap: 0.5rem;
	}

	/* --- language switch: two letters and a marker that slides between them --- */
	.lang {
		position: relative;
		display: grid;
		grid-template-columns: repeat(2, 2.35rem);
		border-radius: 999px;
	}
	.lang::before {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		width: 50%;
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-blush) 70%, transparent);
		transition:
			transform 0.75s var(--ease-silk),
			background-color 0.7s var(--ease-silk);
	}
	.lang.second::before {
		transform: translateX(100%);
	}
	header.dark .lang::before {
		background: color-mix(in srgb, var(--color-gold) 26%, transparent);
	}
	.lang button {
		position: relative;
		padding: 0.7rem 0;
		font-size: 0.63rem;
		letter-spacing: 0.2em;
		text-align: center;
		/* the tracking adds space after the last letter, this evens it out */
		text-indent: 0.2em;
		opacity: 0.55;
		transition: opacity 0.5s var(--ease-silk);
	}
	.lang button[aria-pressed='true'],
	.lang button:hover {
		opacity: 1;
	}

	/* --- call to action --- */
	.cta {
		display: none;
		align-items: center;
		gap: 0.7rem;
		border-radius: 999px;
		border: 1px solid color-mix(in srgb, currentColor 28%, transparent);
		padding: 0.75rem 1.4rem;
		font-size: 0.63rem;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		transition:
			background-color 0.6s var(--ease-silk),
			color 0.6s var(--ease-silk),
			border-color 0.6s var(--ease-silk);
	}
	@media (min-width: 900px) {
		.cta {
			display: inline-flex;
		}
	}
	.pip {
		width: 5px;
		height: 5px;
		border-radius: 999px;
		background: var(--color-rose);
		transition:
			transform 0.6s var(--ease-silk),
			background-color 0.6s var(--ease-silk);
	}
	header.dark .pip {
		background: var(--color-gold);
	}
	/* lit when the reader is actually in the contact section */
	.cta.on {
		border-color: color-mix(in srgb, currentColor 60%, transparent);
		background: color-mix(in srgb, var(--color-blush) 55%, transparent);
	}
	header.dark .cta.on {
		background: color-mix(in srgb, var(--color-gold) 22%, transparent);
	}
	.cta:hover {
		background: currentColor;
		border-color: currentColor;
	}
	header:not(.dark) .cta:hover span:first-child {
		color: var(--color-ivory);
	}
	header.dark .cta:hover span:first-child {
		color: var(--color-noir);
	}
	.cta:hover .pip {
		transform: scale(1.6);
	}

	/* --- small-screen menu --- */
	.burger {
		display: grid;
		gap: 5px;
		padding: 0.9rem 0.8rem;
	}
	@media (min-width: 900px) {
		.burger {
			display: none;
		}
	}
	.burger span {
		display: block;
		width: 20px;
		height: 1px;
		background: currentColor;
		transition: transform 0.6s var(--ease-silk);
	}
	header.open .burger span:first-child {
		transform: translateY(3px) rotate(45deg);
	}
	header.open .burger span:last-child {
		transform: translateY(-3px) rotate(-45deg);
	}

	.sheet {
		display: grid;
		overflow: hidden;
		max-height: 0;
		margin-top: 0.6rem;
		padding-inline: 1.4rem;
		border-radius: 1.6rem;
		background: color-mix(in srgb, var(--color-ivory) 96%, transparent);
		backdrop-filter: blur(10px);
		transition:
			max-height 0.9s var(--ease-silk),
			box-shadow 0.9s var(--ease-silk);
	}
	header.open .sheet {
		max-height: 60svh;
		box-shadow: 0 40px 70px -50px rgba(60, 40, 35, 0.8);
	}
	@media (min-width: 900px) {
		.sheet {
			display: none;
		}
	}
	.sheet-link {
		display: flex;
		align-items: baseline;
		gap: 1rem;
		padding: 1.05rem 0;
		font-size: 1.6rem;
		color: var(--color-ink);
		border-bottom: 1px solid color-mix(in srgb, var(--color-sand) 75%, transparent);
		opacity: 0;
		transform: translateY(14px);
		transition:
			opacity 0.7s var(--ease-silk),
			transform 0.7s var(--ease-silk);
	}
	.sheet-link:last-child {
		border-bottom: 0;
	}
	header.open .sheet-link {
		opacity: 1;
		transform: none;
	}
	.idx {
		font-family: var(--font-sans);
		font-size: 0.6rem;
		letter-spacing: 0.24em;
		color: var(--color-rose);
	}
</style>
