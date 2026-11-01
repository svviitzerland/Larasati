<script lang="ts">
	import { profile } from '$lib/data';
	import { reveal } from '$lib/actions/reveal';
	import { magnetic, parallax } from '$lib/actions/motion';

	const year = new Date().getFullYear();
</script>

<!-- Semua tautan di bagian ini memang menuju ke luar situs, bukan ke halaman lain. -->
<!-- eslint-disable svelte/no-navigation-without-resolve -->
<section id="kontak" class="close">
	<div class="halo" aria-hidden="true">
		<span class="orb" use:parallax={{ speed: -70 }}></span>
	</div>

	<div class="wrap">
		<h2 class="font-display" use:reveal>
			<span class="line-mask"><span>Have a project</span></span>
			<span class="line-mask" style="--rv-delay:140ms"><span class="rose">in mind?</span></span>
		</h2>

		<p class="say reveal" use:reveal={{ delay: 220 }}>
			I'm available for events, voice over and brand campaigns. Send me an email with the date, the
			location and a few words about what you have in mind.
		</p>

		<a
			class="mail reveal font-display"
			href="mailto:{profile.email}"
			use:reveal={{ delay: 320 }}
			use:magnetic={0.18}
			data-cursor="Email"
		>
			{profile.email}
		</a>

		<div class="socials reveal" use:reveal={{ delay: 420 }}>
			{#each profile.socials as social (social.label)}
				<a href={social.href} target="_blank" rel="noreferrer noopener">{social.label}</a>
			{/each}
		</div>
	</div>

	<footer>
		<p class="label-caps">{year} {profile.name}</p>
	</footer>
</section>

<style>
	.close {
		position: relative;
		overflow: hidden;
		padding: 8rem 1.5rem 3rem;
		background: var(--color-ivory);
		text-align: center;
	}
	@media (min-width: 768px) {
		.close {
			padding: 12rem 3rem 3rem;
		}
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
		/* gradasi lingkaran, bukan blur, supaya ringan digambar */
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

	footer {
		position: relative;
		display: flex;
		justify-content: center;
		max-width: 1500px;
		margin: 7rem auto 0;
		padding-top: 2.5rem;
		border-top: 1px solid color-mix(in srgb, var(--color-sand) 70%, transparent);
		color: color-mix(in srgb, var(--color-mocha) 75%, transparent);
	}
</style>
