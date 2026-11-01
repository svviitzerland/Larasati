<script lang="ts">
	import { reveal } from '$lib/actions/reveal';

	let {
		title = '',
		italic = '',
		align = 'left',
		tone = 'light'
	}: {
		title?: string;
		italic?: string;
		align?: 'left' | 'center';
		tone?: 'light' | 'dark';
	} = $props();
</script>

<h2
	class="font-display text-[clamp(2.4rem,5.6vw,4.4rem)] leading-[1.04] font-light text-balance {tone ===
	'dark'
		? 'text-ivory'
		: 'text-ink'} {align === 'center' ? 'text-center' : ''}"
	use:reveal={{ y: '0px', blur: 0 }}
>
	<span class="line-mask"><span>{title}</span></span>
	{#if italic}
		<span class="line-mask" style="--rv-delay:140ms">
			<span class="{tone === 'dark' ? 'text-gold' : 'text-roseink'} italic">{italic}</span>
		</span>
	{/if}
</h2>
