import { sections } from './data';
import { onFrame } from './scroll.svelte';

/**
 * Shared state for the floating elements.
 * `dark` switches on the light styles while crossing the dark gallery,
 * `active` marks the page section being read.
 */
export const ui = $state({ dark: false, active: 0 });

/** One watcher for both the navigation and the scroll marker. */
export function watchSections(darkId = 'work') {
	// only holds element references, never read by a template
	// eslint-disable-next-line svelte/prefer-svelte-reactivity
	const cache = new Map<string, HTMLElement>();

	const find = (id: string) => {
		let el = cache.get(id);
		if (!el) {
			const found = document.getElementById(id);
			if (!found) return null;
			cache.set(id, found);
			el = found;
		}
		return el;
	};

	return onFrame((state) => {
		let current = 0;
		for (let i = 0; i < sections.length; i++) {
			const el = find(sections[i].id);
			if (el && el.getBoundingClientRect().top <= state.viewportH * 0.4) current = i;
		}
		if (current !== ui.active) ui.active = current;

		const dark = find(darkId);
		if (!dark) return;
		const rect = dark.getBoundingClientRect();
		const middle = state.viewportH * 0.5;
		const isDark = rect.top <= middle && rect.bottom >= middle;
		if (isDark !== ui.dark) ui.dark = isDark;
	});
}
