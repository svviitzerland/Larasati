type RevealOptions = {
	/** delay before the animation starts (ms) */
	delay?: number;
	/** initial vertical offset, e.g. '40px' */
	y?: string;
	/** initial horizontal offset */
	x?: string;
	/** initial scale */
	scale?: number;
	/** initial blur in px */
	blur?: number;
	/** how much of the element must be visible (0–1) */
	threshold?: number;
	/** replay the animation every time the element leaves and re-enters the screen */
	repeat?: boolean;
};

/**
 * Adds the `is-in` class when the element enters the viewport.
 * The transition styles live in layout.css (`.reveal`, `.line-mask`, `.rule-grow`).
 */
export function reveal(node: HTMLElement, options: RevealOptions = {}) {
	let observer: IntersectionObserver | null = null;

	const apply = (o: RevealOptions) => {
		node.style.setProperty('--rv-delay', `${o.delay ?? 0}ms`);
		if (o.y !== undefined) node.style.setProperty('--rv-y', o.y);
		if (o.x !== undefined) node.style.setProperty('--rv-x', o.x);
		if (o.scale !== undefined) node.style.setProperty('--rv-s', String(o.scale));
		if (o.blur !== undefined) node.style.setProperty('--rv-blur', `${o.blur}px`);
	};

	const observe = (o: RevealOptions) => {
		observer?.disconnect();
		observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						node.classList.add('is-in');
						if (!o.repeat) observer?.disconnect();
					} else if (o.repeat) {
						node.classList.remove('is-in');
					}
				}
			},
			{ threshold: o.threshold ?? 0.15, rootMargin: '0px 0px -8% 0px' }
		);
		observer.observe(node);
	};

	apply(options);
	observe(options);

	return {
		update(next: RevealOptions = {}) {
			apply(next);
			observe(next);
		},
		destroy() {
			observer?.disconnect();
		}
	};
}
