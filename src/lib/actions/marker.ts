import { onResize } from '$lib/scroll.svelte';

type MarkerOptions = {
	/** delay before the first line is swept (ms) */
	delay?: number;
	/** time between lines (ms) */
	step?: number;
};

/**
 * Sweeps a highlighter over the text, one line at a time, when the paragraph
 * enters the screen.
 *
 * The text is split into words, then the words that sit on the same line are
 * grouped into one span. Each span is only as wide as its own line, so the
 * sweep stops exactly at the end of the sentence and follows the ragged
 * edge of the text.
 */
export function marker(node: HTMLElement, options: MarkerOptions = {}) {
	const source = (node.textContent ?? '').replace(/\s+/g, ' ').trim();
	const delay = options.delay ?? 0;
	const step = options.step ?? 120;

	let observer: IntersectionObserver | null = null;
	let stopResize: (() => void) | null = null;
	let timer = 0;
	let width = 0;

	const paint = () => {
		node.classList.remove('is-lit');

		// step one, wrap every word so its position can be measured
		const words = source.split(' ').filter(Boolean);
		const probe = document.createDocumentFragment();
		const cells: HTMLElement[] = [];

		words.forEach((word, i) => {
			const cell = document.createElement('span');
			cell.textContent = word;
			probe.append(cell);
			if (i < words.length - 1) probe.append(document.createTextNode(' '));
			cells.push(cell);
		});
		node.replaceChildren(probe);

		// step two, group the words by the line they sit on
		const lines: string[][] = [];
		let previous = Number.NaN;
		for (const cell of cells) {
			const top = cell.offsetTop;
			if (Number.isNaN(previous) || Math.abs(top - previous) > 2) {
				lines.push([]);
				previous = top;
			}
			lines[lines.length - 1].push(cell.textContent ?? '');
		}

		// step three, give each line one span with the highlighter background
		const painted = document.createDocumentFragment();
		lines.forEach((line, i) => {
			const row = document.createElement('span');
			row.className = 'mark-line';
			row.style.setProperty('--mark-delay', `${delay + i * step}ms`);
			row.textContent = line.join(' ');
			painted.append(row);
			if (i < lines.length - 1) painted.append(document.createTextNode(' '));
		});
		node.replaceChildren(painted);
	};

	const watch = () => {
		observer?.disconnect();
		observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					node.classList.add('is-lit');
					observer?.disconnect();
				}
			},
			{ threshold: 0.55 }
		);
		observer.observe(node);
	};

	const build = () => {
		paint();
		watch();
	};

	// the lines only need to be rebuilt when the width changes
	const remeasure = () => {
		const next = node.clientWidth;
		if (next === width) return;
		width = next;
		clearTimeout(timer);
		timer = window.setTimeout(build, 180);
	};

	width = node.clientWidth;
	build();
	stopResize = onResize(remeasure);

	return {
		destroy() {
			observer?.disconnect();
			stopResize?.();
			clearTimeout(timer);
			node.textContent = source;
		}
	};
}
