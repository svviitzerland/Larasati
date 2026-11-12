import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-cloudflare';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// This site is built for Cloudflare, through either Pages or
			// Workers. The build output is in `.svelte-kit/cloudflare`, and
			// the Workers settings are in `wrangler.jsonc`. Because the whole
			// page is prerendered (see `src/routes/+layout.ts`), it is
			// served as static files from the Cloudflare network.
			// https://svelte.dev/docs/kit/adapter-cloudflare
			adapter: adapter({
				routes: {
					include: ['/*'],
					exclude: ['<all>']
				}
			})
		})
	]
});
