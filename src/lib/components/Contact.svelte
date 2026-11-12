<script lang="ts">
	import { profile } from '$lib/data';
	import { i18n } from '$lib/i18n/index.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { magnetic, parallax } from '$lib/actions/motion';
	import { onFrame } from '$lib/scroll.svelte';

	let section = $state<HTMLElement | null>(null);

	/**
	 * The page opens with an arch in the hero and closes with the same arch.
	 * Here the line is drawn by the scroll, not by time.
	 */
	$effect(() => {
		if (!section) return;
		const el = section;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			el.style.setProperty('--draw', '1');
			return;
		}
		return onFrame((state) => {
			const rect = el.getBoundingClientRect();
			if (rect.top > state.viewportH) return;
			const seen = (state.viewportH - rect.top) / Math.max(rect.height, 1);
			const t = Math.min(Math.max((seen - 0.12) / 0.8, 0), 1);
			el.style.setProperty('--draw', (1 - Math.pow(1 - t, 2)).toFixed(4));
		});
	});
</script>

<!-- Every link in this section leaves the site on purpose. -->
<!-- eslint-disable svelte/no-navigation-without-resolve -->
<section id="contact" bind:this={section} class="close">
	<div class="halo" aria-hidden="true">
		<span class="orb" use:parallax={{ speed: -70 }}></span>
	</div>

	<span class="gate" aria-hidden="true"></span>

	<div class="wrap">
		<h2 class="font-display" use:reveal>
			<span class="line-mask"><span>{i18n.t.ui.contact.heading[0]}</span></span>
			<span class="line-mask" style="--rv-delay:140ms"
				><span class="rose">{i18n.t.ui.contact.heading[1]}</span></span
			>
		</h2>

		<p class="say reveal" use:reveal={{ delay: 220 }}>
			{i18n.t.ui.contact.say}
		</p>

		<a
			class="mail reveal font-display"
			href="mailto:{profile.email}"
			use:reveal={{ delay: 320 }}
			use:magnetic={0.18}
			data-cursor
		>
			{profile.email}
		</a>

		<div class="socials reveal" use:reveal={{ delay: 420 }}>
			{#each profile.socials as social (social.label)}
				<a href={social.href} target="_blank" rel="noreferrer noopener">{social.label}</a>
			{/each}
		</div>
	</div>
</section>

<style>
	.close {
		position: relative;
		overflow: hidden;
		--draw: 0;
		display: grid;
		align-items: center;
		min-height: 100svh;
		padding: 8rem 1.5rem 7rem;
		background: var(--color-ivory);
		text-align: center;
	}
	@media (min-width: 768px) {
		.close {
			padding: 10rem 3rem 9rem;
		}
	}

	/* closing arch, drawn as the page scrolls */
	.gate {
		position: absolute;
		bottom: 0;
		left: 50%;
		/* on narrow screens the legs run off the edges and only the arc remains */
		width: min(60rem, 118vw);
		height: 90%;
		transform: translateX(-50%);
		border: 1px solid color-mix(in srgb, var(--color-rose) 46%, transparent);
		border-bottom: 0;
		border-radius: 50% 50% 0 0 / 38% 38% 0 0;
		/* both legs rise from the floor and meet at the top */
		clip-path: inset(calc((1 - var(--draw)) * 100%) 0 0 0);
		mask-image: linear-gradient(to bottom, #000 55%, transparent 96%);
		pointer-events: none;
	}

	.halo {
		position: absolute;
		inset: 0;
		pointer-events: none;
		mask-image: linear-gradient(to bottom, transparent, #000 25%);
	}
	.orb {
		position: absolute;
		bottom: -12rem;
		left: 50%;
		width: 38rem;
		height: 38rem;
		margin-left: -19rem;
		border-radius: 999px;
		/* a radial gradient instead of blur, so it is cheap to paint */
		background: radial-gradient(
			circle at center,
			color-mix(in srgb, var(--color-blush) 52%, transparent) 0%,
			color-mix(in srgb, var(--color-blush) 34%, transparent) 45%,
			transparent 72%
		);
	}

	.wrap {
		position: relative;
		max-width: 1100px;
		margin-inline: auto;
	}
	h2 {
		font-size: clamp(2.3rem, 6.6vw, 5.4rem);
		line-height: 1.04;
		font-weight: 300;
	}
	.rose {
		color: var(--color-roseink);
		font-style: italic;
	}
	.say {
		margin: 2.2rem auto 0;
		max-width: 30rem;
		font-size: 0.95rem;
		line-height: 1.9;
		color: var(--color-dusk);
	}

	.mail {
		position: relative;
		display: inline-block;
		margin-top: 3rem;
		font-size: clamp(1.5rem, 4vw, 2.8rem);
		font-weight: 300;
	}
	.mail::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: -0.12em;
		height: 1px;
		background: var(--color-rose);
		transform: scaleX(0);
		transform-origin: right;
		transition: transform 0.85s var(--ease-silk);
	}
	.mail:hover::after {
		transform: scaleX(1);
		transform-origin: left;
	}

	.socials {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.8rem;
		margin-top: 3.5rem;
	}
	.socials a {
		padding: 0.85rem 1.8rem;
		border: 1px solid var(--color-sand);
		border-radius: 999px;
		font-size: 0.64rem;
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: var(--color-mocha);
		transition:
			color 0.5s var(--ease-silk),
			border-color 0.5s var(--ease-silk);
	}
	.socials a:hover {
		color: var(--color-ink);
		border-color: var(--color-ink);
	}
</style>
