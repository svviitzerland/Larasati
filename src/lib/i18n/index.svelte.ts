import * as base from '$lib/data';
import { ui as en } from './en';
import * as id from './id';

export type Locale = 'en' | 'id';

export const locales: { code: Locale; label: string; name: string }[] = [
	{ code: 'en', label: 'EN', name: 'English' },
	{ code: 'id', label: 'ID', name: 'Bahasa Indonesia' }
];

const english = {
	ui: en,
	profile: base.profile,
	services: base.services,
	gallery: base.gallery,
	timeline: base.timeline,
	sections: base.sections
};

export type Content = typeof english;

/** English with every translated field replaced by its Indonesian text. */
const indonesian: Content = {
	ui: id.ui,
	profile: { ...base.profile, ...id.profile },
	services: base.services.map((service) => ({
		...service,
		text: id.services[service.name] ?? service.text
	})),
	gallery: base.gallery.map((item) => ({ ...item, ...id.gallery[item.id] })),
	timeline: base.timeline.map((entry, i) => ({ ...entry, ...id.timeline[i] })),
	sections: base.sections.map((section) => ({
		...section,
		label: id.sections[section.id] ?? section.label
	}))
};

const content: Record<Locale, Content> = { en: english, id: indonesian };

const STORAGE_KEY = 'lang';

const isLocale = (value: unknown): value is Locale => value === 'en' || value === 'id';

// The page is prerendered in English, so this starts as English on the
// server and for a first-time visitor.
let current = $state<Locale>('en');

/**
 * The language is switched in place, with no change of address, and the choice
 * is remembered in localStorage. Reading `i18n.t` in a template or a `$derived`
 * keeps the text reactive when the visitor switches.
 */
export const i18n = {
	get locale(): Locale {
		return current;
	},
	get t(): Content {
		return content[current];
	},
	/** Switches the language and remembers it for the next visit. */
	set(locale: Locale) {
		current = locale;
		document.documentElement.lang = locale;
		try {
			localStorage.setItem(STORAGE_KEY, locale);
		} catch {
			// storage can be blocked in private windows, the switch still works
		}
	},
	/** Brings back the language chosen on an earlier visit. Call once in the browser. */
	restore() {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (isLocale(saved) && saved !== current) this.set(saved);
		} catch {
			// no stored choice to read, stay in English
		}
	}
};
