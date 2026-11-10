/**
 * Regenerate the site Open Graph image and GitHub social preview from one design.
 * Run with `bun run og`. Requires Chrome or Chromium and ImageMagick.
 */
import { access, mkdtemp, rm } from 'node:fs/promises';
import { constants } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { brandLogos, gallery, profile } from '../src/lib/data.ts';

const root = resolve(import.meta.dir, '..');
const templatePath = join(import.meta.dir, 'og-template.html');
const renders = [
	{
		name: 'og',
		width: 1200,
		height: 630,
		bandHeight: 112,
		gateBottom: -80,
		gateLeft: 168,
		gateWidth: 864,
		gateHeight: 403,
		nameSize: 152,
		outputPath: join(root, 'static', 'og.jpg'),
		format: 'jpeg'
	},
	{
		name: 'social',
		width: 1280,
		height: 640,
		bandHeight: 114,
		gateBottom: -82,
		gateLeft: 180,
		gateWidth: 920,
		gateHeight: 410,
		nameSize: 162,
		outputPath: join(root, 'static', 'social-preview.png'),
		format: 'png'
	}
] as const;

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

for (const render of renders) {
	const tempDir = await mkdtemp(join(tmpdir(), `portfolio-${render.name}-${process.pid}-`));
	const htmlPath = join(tempDir, 'preview.html');
	const pngPath = join(tempDir, 'preview.png');
	const html = template
		.replaceAll('{{WIDTH}}', String(render.width))
		.replaceAll('{{HEIGHT}}', String(render.height))
		.replaceAll('{{BAND_HEIGHT}}', String(render.bandHeight))
		.replaceAll('{{GATE_BOTTOM}}', String(render.gateBottom))
		.replaceAll('{{GATE_LEFT}}', String(render.gateLeft))
		.replaceAll('{{GATE_WIDTH}}', String(render.gateWidth))
		.replaceAll('{{GATE_HEIGHT}}', String(render.gateHeight))
		.replaceAll('{{NAME_SIZE}}', String(render.nameSize))
		.replace('{{FIRST_NAME}}', escapeHtml(firstName))
		.replace('{{LAST_NAME}}', escapeHtml(lastName))
		.replace('{{BRAND_COUNT}}', String(uniqueBrands.length))
		.replace('{{BRAND_LOGOS}}', logos);

	await Bun.write(htmlPath, html);

	try {
		await run(chrome, [
			'--headless=new',
			'--disable-gpu',
			'--no-sandbox',
			'--no-first-run',
			'--allow-file-access-from-files',
			'--hide-scrollbars',
			'--virtual-time-budget=6000',
			`--user-data-dir=${join(tempDir, 'profile')}`,
			`--window-size=${render.width},${render.height}`,
			`--screenshot=${pngPath}`,
			pathToFileURL(htmlPath).href
		]);
		const magickArgs =
			render.format === 'jpeg'
				? [pngPath, '-strip', '-sampling-factor', '4:2:0', '-quality', '92', render.outputPath]
				: [pngPath, '-strip', render.outputPath];
		await run(magick, magickArgs);
		console.log(`Updated ${render.outputPath}`);
	} finally {
		await rm(tempDir, { recursive: true, force: true });
	}
}
