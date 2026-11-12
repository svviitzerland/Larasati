<script lang="ts">
	import { fade, fly, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { i18n } from '$lib/i18n/index.svelte';
	import { viewer, closeViewer } from '$lib/viewer.svelte';
	import { lockScroll } from '$lib/scroll.svelte';

	const gallery = $derived(i18n.t.gallery);
	const t = $derived(i18n.t.ui.viewer);
	const item = $derived(gallery[viewer.index]);

	let frame = $state<HTMLIFrameElement | null>(null);

	/**
	 * The Instagram embed page reports its real height through postMessage, the
	 * same way their official script does. The measurement is stored per reel
	 * so the frame does not jump when that post is opened again.
	 */
	let heights = $state<Record<string, number>>({});
	const frameHeight = $derived(heights[item.code] ?? 0);

	function onMessage(event: MessageEvent) {
		if (!frame || event.source !== frame.contentWindow) return;
		try {
			const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
			const measured = Number(data?.details?.height);
			if (data?.type === 'MEASURE' && measured > 0) heights[item.code] = Math.round(measured);
		} catch {
			// a message from another source, not ours to handle
		}
	}

	function next() {
		viewer.index = (viewer.index + 1) % gallery.length;
	}
	function prev() {
		viewer.index = (viewer.index - 1 + gallery.length) % gallery.length;
	}

	function onKey(event: KeyboardEvent) {
		if (!viewer.open) return;
		if (event.key === 'Escape') closeViewer();
		if (event.key === 'ArrowRight') next();
		if (event.key === 'ArrowLeft') prev();
	}

	$effect(() => {
		if (!viewer.open) return;
		lockScroll(true);
		return () => lockScroll(false);
	});
</script>

<svelte:window on:keydown={onKey} on:message={onMessage} />

{#if viewer.open}
	<div class="viewer" role="dialog" aria-modal="true" aria-label={t.label}>
		<button
			class="backdrop"
			transition:fade={{ duration: 400 }}
			onclick={closeViewer}
			aria-label={t.closePlayer}
		></button>

		<span class="beam" transition:fade={{ duration: 800 }} aria-hidden="true"></span>

		<div class="body">
			{#key item.id}
				<div class="art" in:scale={{ duration: 750, start: 0.94, opacity: 0, easing: cubicOut }}>
					<iframe
						bind:this={frame}
						class="reel"
						title={t.frame(item.title)}
						src="https://www.instagram.com/reel/{item.code}/embed/"
						style:height={frameHeight ? `${frameHeight}px` : null}
						allow="encrypted-media; picture-in-picture; clipboard-write"
						allowfullscreen
						referrerpolicy="origin-when-cross-origin"
					></iframe>
				</div>

				<div class="note" in:fly={{ y: 26, duration: 750, delay: 120, easing: cubicOut }}>
					<p class="gold label-caps">{t.work} {item.no} · {item.date}</p>
					<h3 class="font-display">{item.title}</h3>
					<p class="say">{item.note}</p>

					<dl>
						{#each [[t.role, item.roles.join(', ')], [t.client, item.brand], [t.topic, item.topic], [t.account, item.account], [t.aired, item.date]] as [key, value], i (i)}
							<div>
								<dt class="label-caps">{key}</dt>
								<dd class="font-display">{value}</dd>
							</div>
						{/each}
					</dl>

					<a
						class="out label-caps"
						href="https://www.instagram.com/reel/{item.code}/"
						target="_blank"
						rel="noreferrer noopener"
					>
						{i18n.t.ui.work.instagram}
					</a>
				</div>
			{/key}
		</div>

		<button class="ctrl close" onclick={closeViewer} transition:fade aria-label={t.close}>
			<span></span><span></span>
		</button>
		<button class="ctrl left" onclick={prev} transition:fade aria-label={t.previous}
			><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" /></svg></button
		>
		<button class="ctrl right" onclick={next} transition:fade aria-label={t.next}
			><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5" /></svg></button
		>

		<p class="tally label-caps" transition:fade>{t.tally(viewer.index + 1, gallery.length)}</p>
	</div>
{/if}

<style>
	/* player width, deliberately above the minimum width of the Instagram embed */
	.viewer {
		--reel-w: 21rem;
		position: fixed;
		inset: 0;
		z-index: 150;
		overflow-y: auto;
		overscroll-behavior: contain;
	}
	.backdrop {
		position: fixed;
		inset: 0;
		background: color-mix(in srgb, var(--color-noir) 94%, transparent);
		backdrop-filter: blur(14px);
	}
	.beam {
		position: fixed;
		top: 0;
		left: 50%;
		width: 70vw;
		max-width: 60rem;
		height: 100%;
		margin-left: -35vw;
		clip-path: polygon(43% 0, 57% 0, 96% 100%, 4% 100%);
		background: linear-gradient(to bottom, rgba(255, 236, 204, 0.2), transparent 72%);
		filter: blur(48px);
		pointer-events: none;
	}

	/* the content is centred while it fits, and only scrolls when it does not */
	.body {
		position: relative;
		z-index: 2;
		display: grid;
		align-content: center;
		align-items: center;
		gap: 2.5rem;
		min-height: 100%;
		width: 100%;
		max-width: 72rem;
		margin-inline: auto;
		padding: 5.5rem 1.1rem 5.5rem;
		color: var(--color-ivory);
	}
	@media (min-width: 900px) {
		.viewer {
			--reel-w: 23rem;
		}
		.body {
			grid-template-columns: 1.15fr 0.85fr;
			gap: 4rem;
			padding: 4rem 3rem;
		}
	}

	.art {
		display: flex;
		justify-content: center;
	}
	.reel {
		width: 100%;
		max-width: var(--reel-w);
		/* Fallback height before the embed reports its real size.
		   Instagram places the video in a 4 : 5 box and then adds a
		   header and footer thirteen rem tall. */
		height: calc(var(--reel-w) * 1.25 + 13rem);
		border: 0;
		background: #fff;
		box-shadow: 0 60px 120px -40px rgba(0, 0, 0, 0.9);
	}

	.gold {
		color: var(--color-gold);
		margin-bottom: 1rem;
	}
	.note h3 {
		font-size: clamp(1.8rem, 4vw, 3rem);
		line-height: 1.1;
		font-weight: 300;
		margin-bottom: 1.2rem;
	}
	.say {
		max-width: 24rem;
		font-size: 0.94rem;
		line-height: 1.95;
		color: color-mix(in srgb, var(--color-ivory) 66%, transparent);
	}
	dl {
		margin-top: 2rem;
		padding-top: 1.5rem;
		border-top: 1px solid color-mix(in srgb, var(--color-ivory) 16%, transparent);
	}
	dl div {
		display: flex;
		gap: 1.5rem;
		margin-bottom: 0.7rem;
	}
	dt {
		width: 5.5rem;
		flex-shrink: 0;
		padding-top: 0.35rem;
		color: color-mix(in srgb, var(--color-ivory) 40%, transparent);
	}
	dd {
		font-size: 1.05rem;
		color: color-mix(in srgb, var(--color-ivory) 92%, transparent);
	}

	.out {
		display: inline-block;
		margin-top: 1.8rem;
		padding-bottom: 0.4rem;
		color: var(--color-gold);
		border-bottom: 1px solid color-mix(in srgb, var(--color-gold) 45%, transparent);
		transition: border-color 0.5s var(--ease-silk);
	}
	.out:hover {
		border-color: var(--color-gold);
	}

	.ctrl {
		position: fixed;
		z-index: 3;
		display: grid;
		place-items: center;
		width: 3rem;
		height: 3rem;
		border-radius: 999px;
		border: 1px solid color-mix(in srgb, var(--color-ivory) 20%, transparent);
		background: color-mix(in srgb, var(--color-noir) 70%, transparent);
		color: var(--color-ivory);
		transition:
			background-color 0.5s var(--ease-silk),
			border-color 0.5s var(--ease-silk),
			color 0.5s var(--ease-silk);
	}
	.ctrl:hover {
		background: color-mix(in srgb, var(--color-ivory) 12%, transparent);
		border-color: var(--color-gold);
		color: var(--color-gold);
	}
	.ctrl svg {
		width: 1rem;
		height: 1rem;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.3;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.close {
		top: 1.5rem;
		right: 1.5rem;
	}
	@media (min-width: 768px) {
		.close {
			top: 2.5rem;
			right: 2.5rem;
		}
	}
	.close span {
		position: absolute;
		width: 15px;
		height: 1px;
		background: currentColor;
	}
	.close span:first-child {
		transform: rotate(45deg);
	}
	.close span:last-child {
		transform: rotate(-45deg);
	}

	/* on narrow screens the buttons move to the bottom so they do not cover
	   the player, which already uses almost the full width */
	.left {
		left: 1rem;
		bottom: 1.1rem;
	}
	.right {
		right: 1rem;
		bottom: 1.1rem;
	}
	@media (min-width: 900px) {
		.left {
			left: 2rem;
			top: 50%;
			bottom: auto;
			margin-top: -1.5rem;
		}
		.right {
			right: 2rem;
			top: 50%;
			bottom: auto;
			margin-top: -1.5rem;
		}
	}

	/* on narrow screens the content scrolls past the buttons, so their base is dimmed */
	.viewer::after {
		content: '';
		position: fixed;
		z-index: 2;
		inset-inline: 0;
		bottom: 0;
		height: 7rem;
		background: linear-gradient(to top, var(--color-noir), transparent);
		pointer-events: none;
	}
	@media (min-width: 900px) {
		.viewer::after {
			content: none;
		}
	}

	.tally {
		position: fixed;
		bottom: 2.2rem;
		left: 50%;
		transform: translateX(-50%);
		color: color-mix(in srgb, var(--color-ivory) 42%, transparent);
	}
	@media (min-width: 900px) {
		.tally {
			bottom: 1.6rem;
		}
	}
</style>
