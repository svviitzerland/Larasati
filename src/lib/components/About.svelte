<script lang="ts">
	import { profile, services } from '$lib/data';
	import { reveal } from '$lib/actions/reveal';
	import { panel, parallax } from '$lib/actions/motion';
	import { marker } from '$lib/actions/marker';
	import SectionHeading from './SectionHeading.svelte';
</script>

<section id="tentang" class="about">
	<!-- efek panel dikenakan pada isinya, bukan pada latar, supaya tepi
	     bagian ini tidak pernah terlihat saat menyusut -->
	<div class="wrap" use:panel={{ depth: 0.05, fade: 0.45 }}>
		<div class="top">
			<div class="side" use:parallax={{ speed: 46 }}>
				<SectionHeading title="Nice to" italic="meet you." />
			</div>

			<div class="prose">
				<p
					class="lead reveal font-display"
					use:reveal={{ y: '26px', delay: 120 }}
					use:marker={{ delay: 520, step: 420 }}
				>
					{profile.intro}
				</p>

				{#each profile.bio as paragraph, i (i)}
					<p class="body reveal" use:reveal={{ delay: 200 + i * 90, y: '22px' }}>{paragraph}</p>
				{/each}
			</div>
		</div>

		<div class="services">
			<h3 class="services-title reveal font-display" use:reveal={{ y: '16px', blur: 0 }}>
				What I do
			</h3>

			<ul>
				{#each services as service, i (service.name)}
					<li class="service" use:reveal={{ delay: i * 120, y: '0px', blur: 0 }}>
						<span class="line-mask service-name font-display"><span>{service.name}</span></span>
						<p class="reveal" use:reveal={{ delay: 160 + i * 120, y: '14px' }}>{service.text}</p>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</section>

<style>
	.about {
		position: relative;
		overflow: hidden;
		padding: 8rem 1.5rem;
		background: var(--color-ivory);
	}
	@media (min-width: 768px) {
		.about {
			padding: 11rem 3rem 10rem;
		}
	}

	.wrap {
		position: relative;
		max-width: 1300px;
		margin-inline: auto;
	}

	.top {
		display: grid;
		gap: 3.5rem;
		align-items: start;
	}
	@media (min-width: 900px) {
		.top {
			grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
			gap: 6rem;
		}
	}

	.prose {
		max-width: 40rem;
	}
	.lead {
		margin-top: 0.4rem;
		font-size: clamp(1.4rem, 2.4vw, 1.95rem);
		line-height: 1.45;
		font-weight: 300;
		color: var(--color-ink);
	}
	.body {
		margin-top: 1.6rem;
		max-width: 34rem;
		font-size: 0.98rem;
		line-height: 1.9;
		color: var(--color-dusk);
	}
	.lead + .body {
		margin-top: 2.4rem;
	}

	/* --- daftar layanan --- */
	.services {
		margin-top: 8rem;
	}
	.services-title {
		font-size: clamp(1.5rem, 2.6vw, 2rem);
		font-style: italic;
		font-weight: 300;
		color: var(--color-mocha);
		margin-bottom: 2rem;
	}
	.service {
		position: relative;
		display: grid;
		gap: 0.9rem;
		padding: 2.2rem 0;
		border-top: 1px solid var(--color-sand);
	}
	.service:last-child {
		border-bottom: 1px solid var(--color-sand);
	}
	@media (min-width: 900px) {
		.service {
			grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
			align-items: center;
			gap: 3rem;
			padding: 2.6rem 0;
		}
	}
	.service::before {
		content: '';
		position: absolute;
		inset: 0 -1.5rem;
		background: linear-gradient(
			90deg,
			color-mix(in srgb, var(--color-blush) 55%, transparent),
			transparent 70%
		);
		opacity: 0;
		transition: opacity 0.8s var(--ease-silk);
		pointer-events: none;
	}
	.service:hover::before {
		opacity: 1;
	}
	.service-name {
		position: relative;
		font-size: clamp(2.1rem, 5.4vw, 4.2rem);
		line-height: 1.02;
		font-weight: 300;
		transition:
			color 0.6s var(--ease-silk),
			transform 0.8s var(--ease-silk);
	}
	.service:hover .service-name {
		color: var(--color-roseink);
		transform: translateX(0.6rem);
	}
	.service p {
		position: relative;
		max-width: 28rem;
		font-size: 0.95rem;
		line-height: 1.85;
		color: var(--color-dusk);
	}
</style>
