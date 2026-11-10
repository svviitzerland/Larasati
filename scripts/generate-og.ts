/**
 * Regenerate `static/og.jpg` from `scripts/og-template.html`.
 * Run with `bun run og`. Requires Chrome or Chromium and ImageMagick.
 */
import { access, unlink } from 'node:fs/promises';
import { constants } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { brandLogos, gallery, profile } from '../src/lib/data.ts';

const root = resolve(import.meta.dir, '..');
const templatePath = join(import.meta.dir, 'og-template.html');
const outputPath = join(root, 'static', 'og.jpg');
const htmlPath = join(tmpdir(), `portfolio-og-${process.pid}.html`);
const pngPath = join(tmpdir(), `portfolio-og-${process.pid}.png`);

function escapeHtml(value: string) {
	return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

async function findExecutable(candidates: string[]) {
	for (const candidate of candidates) {
		if (candidate.includes('/')) {
			try {
				await access(candidate, constants.X_OK);
				return candidate;
			} catch {
				continue;
			}
		}
		const executable = Bun.which(candidate);
		if (executable) return executable;
	}
	return null;
}

async function run(executable: string, args: string[]) {
	const child = Bun.spawn({ cmd: [executable, ...args], stdout: 'inherit', stderr: 'inherit' });
	const status = await child.exited;
	if (status !== 0) throw new Error(`${executable} exited with status ${status}`);
}

const chrome = await findExecutable([
	Bun.env.CHROME_BIN ?? '',
	'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
	'google-chrome',
	'chromium',
	'chromium-browser'
]);
const magick = await findExecutable(['magick']);

if (!chrome)
	throw new Error('Chrome or Chromium was not found. Set CHROME_BIN to its executable path.');
if (!magick)
	throw new Error('ImageMagick was not found. Install it to convert the rendered image to JPEG.');

const uniqueBrands = [...new Set(gallery.map((item) => item.brand))]
	.filter((brand) => brandLogos[brand])
	.slice(0, 6);

const logos = uniqueBrands
	.map((brand) => {
		const logo = brandLogos[brand];
		const assetPath = resolve(root, 'static', logo.src.replace(/^\//, ''));
		const assetUrl = pathToFileURL(assetPath).href;
		const height = Math.min(logo.size * 16, 44);
		const width = height * (logo.width / logo.height);
		const scale = Math.min(1, 132 / width);
		const safeUrl = assetUrl.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
		return `<div class="item"><span class="logo" style="--src: url('${safeUrl}'); --logo-width: ${(width * scale).toFixed(1)}px; --logo-height: ${(height * scale).toFixed(1)}px"></span></div>`;
	})
	.join('\n');

const firstName = profile.shortName;
const lastName = profile.name.slice(firstName.length).trim();
const template = await Bun.file(templatePath).text();
const html = template
	.replace('{{FIRST_NAME}}', escapeHtml(firstName))
	.replace('{{LAST_NAME}}', escapeHtml(lastName))
	.replace('{{BRAND_COUNT}}', String(uniqueBrands.length))
	.replace('{{BRAND_LOGOS}}', logos);

await Bun.write(htmlPath, html);

try {
	await run(chrome, [
		'--headless',
		'--disable-gpu',
		'--allow-file-access-from-files',
		'--hide-scrollbars',
		'--virtual-time-budget=6000',
		'--window-size=1200,630',
		`--screenshot=${pngPath}`,
		pathToFileURL(htmlPath).href
	]);
	await run(magick, [pngPath, '-strip', '-sampling-factor', '4:2:0', '-quality', '92', outputPath]);
	console.log(`Updated ${outputPath}`);
} finally {
	await unlink(htmlPath).catch(() => {});
	await unlink(pngPath).catch(() => {});
}
