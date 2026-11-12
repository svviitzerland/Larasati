import type { Craft } from '$lib/data';

/**
 * Interface text in English: headings, button labels and the text read by
 * screen readers. The content itself (profile, reels, timeline) is in
 * `src/lib/data.ts`.
 */
export const ui = {
	meta: {
		description: (name: string) =>
			`${name} is an MC, voice over artist and model based in Bandung. Explore her recent work and get in touch.`,
		imageAlt: 'Larasati Putri Maharani, MC, voice over and model in Bandung'
	},
	nav: {
		top: 'Back to top',
		cta: 'Get in Touch',
		openMenu: 'Open menu',
		closeMenu: 'Close menu',
		language: 'Language'
	},
	hero: { see: 'See the work' },
	brands: {
		label: 'Brands Larasati has worked on',
		play: (brand: string) => `Play the reel for ${brand}`
	},
	about: { heading: ['Nice to', 'meet you.'], services: 'What I do' },
	work: {
		heading: ['Recent', 'work.'],
		latest: 'Latest',
		playReel: 'Play reel',
		instagram: 'Open on Instagram',
		more: 'More reels',
		count: (total: string) => `${total} reels`,
		play: (title: string, brand: string) => `Play ${title} for ${brand}`,
		playAs: (title: string, brand: string, roles: Craft[]) =>
			`Play ${title} for ${brand}, ${roles.join(' and ')}`,
		cover: (title: string) => `Cover of the ${title} reel`
	},
	timeline: { heading: ['Experience', 'so far.'] },
	contact: {
		heading: ['Have a project', 'in mind?'],
		say: "I'm available for events, voice over and brand campaigns. Send me an email with the date, the location and a few words about what you have in mind."
	},
	viewer: {
		label: 'Instagram reel player',
		closePlayer: 'Close player',
		frame: (title: string) => `Instagram reel: ${title}`,
		work: 'Work',
		role: 'Role',
		client: 'Client',
		topic: 'Topic',
		account: 'Account',
		aired: 'Aired',
		close: 'Close',
		previous: 'Previous reel',
		next: 'Next reel',
		tally: (current: number, total: number) => `${current} of ${total}`
	}
};

export type Interface = typeof ui;
