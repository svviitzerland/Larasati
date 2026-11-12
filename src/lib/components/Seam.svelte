<script lang="ts">
	/**
	 * A join between sections. The colour of the next section rises as a wide
	 * arc, so the change feels like a calm swell
	 * and not a flat line.
	 */
	let {
		from = 'var(--color-ivory)',
		to = 'var(--color-ivory)',
		height = '18vh'
	}: { from?: string; to?: string; height?: string } = $props();
</script>

<div class="seam" style:height style:background={from} aria-hidden="true">
	<span class="swell" style:background={to}></span>
	<span class="line"></span>
</div>

<style>
	.seam {
		position: relative;
		width: 100%;
		overflow: hidden;
		pointer-events: none;
	}

	/* a wide, shallow arc */
	.swell {
		position: absolute;
		inset: 45% -12% -2% -12%;
		border-radius: 50% 50% 0 0 / 100% 100% 0 0;
	}

	/* one hairline following the crest of the arc */
	.line {
		position: absolute;
		inset: calc(45% - 0.6rem) -12% auto -12%;
		height: 60%;
		border-top: 1px solid color-mix(in srgb, var(--color-rose) 22%, transparent);
		border-radius: 50% 50% 0 0 / 100% 100% 0 0;
	}
</style>
