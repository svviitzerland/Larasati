# CLAUDE.md

Single-page portfolio for Larasati Putri Maharani, an MC, voice over artist and model in Bandung. Live at https://larasati.my.id. Read this before changing anything; every change must fit the rules below.

## Commands

```bash
bun install
bun run dev      # dev server
bun run check    # svelte-check, must pass
bun run lint     # prettier --check + eslint, must pass
bun run format   # prettier --write
bun run build    # Cloudflare build into .svelte-kit/cloudflare
bun run og       # regenerate static/og.jpg and static/social-preview.png (needs Chrome and ImageMagick)
```

Run `bun run check` and `bun run lint` after every change. Look at the result in a browser at desktop and phone width before calling visual work done.

## Stack

- SvelteKit 2, Svelte 5 in runes mode (`$state`, `$derived`, `$effect`, `$props`), TypeScript.
- Tailwind CSS 4. Design tokens live in the `@theme` block of `src/routes/layout.css`; components mostly use scoped `<style>` with those tokens.
- Fully prerendered (`src/routes/+layout.ts`), deployed to Cloudflare with `@sveltejs/adapter-cloudflare` and `wrangler.jsonc`.
- Package manager is bun.

## Where things are

- `src/lib/data.ts`: all site content in English (profile, services, gallery, brand logos, timeline, nav sections). Change text and reels here, not in components.
- `src/lib/i18n/`: `en.ts` holds the English interface text (headings, buttons, screen-reader labels), `id.ts` holds every Indonesian text, and `index.svelte.ts` merges them and exposes `i18n`.
- `src/routes/+page.svelte`: section order (Hero, Marquee, About, Hall, Timeline, Contact) and meta tags.
- `src/lib/components/`: one file per section, plus `Nav`, `Cursor`, `Lightbox`, `Smooth`, `Seam`, `SectionHeading`.
- `src/lib/scroll.svelte.ts`: the custom smooth-scroll engine.
- `src/lib/actions/`: `reveal`, `marker`, and `motion` (`parallax`, `panel`, `sway`, `magnetic`).
- `src/lib/ui.svelte.ts`, `src/lib/viewer.svelte.ts`: shared state for nav and the reel lightbox.
- `static/gallery/`, `static/brands/`: reel covers and brand logos.

## Scroll engine rules

All page content sits inside `Smooth.svelte`, which is `position: fixed` and moved with a transform that eases toward the real scroll position.

- `position: sticky` and `position: fixed` do not work inside `<Smooth>`. Anything that must stay on screen (nav, cursor, lightbox) is rendered outside it in `+page.svelte`. To pin something inside a section, move it per frame the way `Timeline.svelte` does.
- Scroll-linked motion uses `onFrame` from `$lib/scroll.svelte` and writes straight to `element.style` or a CSS custom property. Do not add separate scroll listeners or a second `requestAnimationFrame` loop for it.
- Use `glideTo` / `glideToId` for programmatic scrolling and `lockScroll` when an overlay opens.
- Every motion must have a `prefers-reduced-motion` fallback that shows the final state.
- Avoid large `filter: blur()` on big elements; it is slow in Safari. Use radial gradients, or blur a small element and scale it up.

## Content rules

- The site is in English and Indonesian. English copy is first person, professional but warm, in plain sentences with concrete facts. No slang, nothing inflated or staged. Avoid words like elevate, passionate, seamless, journey.
- Indonesian copy uses "saya" and, where a reader is addressed, "Anda". It must read like Larasati writing to a client: natural, not stiff, not translated word for word. Earlier Indonesian copy was rejected as staged and machine-written, and a casual "aku" version as unprofessional. Role names (MC, Voice Over, Model) and event names stay as they are.
- The current copy is approved. Do not rewrite it or add new copy unless asked.
- Every visible or screen-reader string goes through `i18n.t`; never hardcode text in a component. Any text added or changed in `data.ts` or `en.ts` needs the matching Indonesian text in `id.ts` in the same change.
- Only real work and real facts. Never invent testimonials, client quotes, follower counts, awards, rates, numbers, or reels.
- Code, comments, identifiers and section ids are all in English. Keep that.
- No portrait photos unless Larasati supplies one. Earlier portraits were rejected.

## Languages

- The switch (EN / ID) is in the navigation. It changes the language in place, with no change of URL, and saves the choice in `localStorage` under `lang`. Do not move languages to separate routes such as `/id`.
- The page is prerendered in English. A saved choice is applied in the browser by `i18n.restore()` in `+page.svelte`.
- Read text with `i18n.t` inside the template or a `$derived`, so it updates when the language changes. An action that reads text once (like `marker`) must sit inside `{#key i18n.locale}`.

## Design

The look is quiet editorial: warm paper, a large light serif, thin hairlines, and one dark room for the work. Everything below is the current system. Match it when editing; do not introduce a second style.

### Principles

- Taste band: the site must feel alive and professional, not plain, but never loud. A full-page WebGL backdrop, intro curtain, tilt cards, a rotating seal and reel covers in the hero were all rejected as too much. A text-only page was rejected as too simple.
- One authored scroll moment per section. Imagery comes only from real reel covers and brand logos.
- Type and space do the work. Decoration is limited to hairlines, soft radial glows, the arch and the paper grain.
- Many visitors arrive on phones from Instagram. Every change must work at phone width and with touch, so nothing may depend on hover alone.
- Do not replace the established look wholesale. Extend it section by section, and ask before a large visual overhaul.

### Colour

Tokens are defined in `@theme` in `src/routes/layout.css`. Use the tokens, never raw hex, and do not add colours.

| Token             | Hex       | Use                                                            |
| ----------------- | --------- | -------------------------------------------------------------- |
| `--color-ivory`   | `#fbf8f5` | page background, text on dark                                  |
| `--color-mist`    | `#f7f1ec` | background of the Experience section                           |
| `--color-shell`   | `#f3ece5` | spare light surface                                            |
| `--color-sand`    | `#e7dbd1` | hairlines and borders on light                                 |
| `--color-blush`   | `#ecd6d2` | highlights: marker sweep, nav marker, hover washes, glows      |
| `--color-rose`    | `#c48d90` | accent lines, cursor, timeline line and nodes, favicon         |
| `--color-roseink` | `#a0646a` | rose for text: italic heading lines, year labels, nav wordmark |
| `--color-mocha`   | `#8d766c` | secondary display text, brand logos, small labels              |
| `--color-dusk`    | `#4a3a34` | body text on light                                             |
| `--color-ink`     | `#241d1b` | primary text on light                                          |
| `--color-noir`    | `#14100f` | background of the gallery                                      |
| `--color-gold`    | `#bfa46f` | accent on dark only: italic heading line, borders, brand names |

- Light sections use ink and dusk text with rose accents. The gallery is the only dark section and uses ivory text with gold accents. Gold is not used on light, rose is not used as the accent on dark.
- Body text on light is `--color-dusk`, never grey. Muted text on dark is ivory mixed with transparent (`color-mix(in srgb, var(--color-ivory) 66%, transparent)`).
- Tints are made with `color-mix(in srgb, <token> N%, transparent)`.
- A fixed paper-grain overlay (`body::after`) covers the whole page. Keep it.
- `::selection` is blush, focus rings are a 1px rose outline with 4px offset.

### Typography

- Display: Cormorant Garamond, weight 300, used for the name, section headings, titles, the email and large labels. Body: Inter, weight 300. Both load from Google Fonts in `src/app.html`.
- Section headings are two lines: the first in ink, the second italic in roseink (gold on dark), and the phrase ends with a full stop or question mark ("Nice to / meet you.", "Recent / work."). Use `SectionHeading.svelte`. No eyebrow or label above a heading.
- Sizes use `clamp()`. Hero name `clamp(3.2rem, 12vw, 9.5rem)`, section headings `clamp(2.4rem, 5.6vw, 4.4rem)`, service names `clamp(2.1rem, 5.4vw, 4.2rem)`, lead paragraph `clamp(1.4rem, 2.4vw, 1.95rem)`.
- Body copy is 0.92 to 0.98rem with line-height 1.75 to 1.9, in columns no wider than about 34rem.
- Small uppercase labels use the `label-caps` utility (0.625rem, 0.34em tracking). Nav links and pills use 0.63rem uppercase with 0.2 to 0.24em tracking.
- Italic is the only emphasis. No bold, no gradient text, no underlines except on text links.

### Shape and layout

- The arch is the signature shape. It appears as the drawn gate in the hero, the entry and exit of the gallery, the latest reel cover as it opens, the seams between sections and the closing arch in Contact. Reuse it; do not add other motifs.
- Buttons, tags and the nav bar are pills (`border-radius: 999px`) with a 1px border. Reel covers use 0.6rem corners and a 9:16 ratio. There are no cards with icons, and nothing is nested in boxes.
- Content sits in a centred column of 1100px to 1300px (1500px for Experience). Section padding is 8rem on phones and 10 to 12rem from 768px.
- Lines are 1px hairlines in sand or rose, often fading at both ends. Shadows are soft and offset, used only under reel covers and the floating nav.
- Sections never meet on a flat line: the gallery opens and closes through arches, and `Seam.svelte` joins light sections with a shallow arc.

### Motion

- Easing is `--ease-silk` (`cubic-bezier(0.16, 1, 0.3, 1)`) everywhere. Durations are slow: 0.5 to 0.9s for hover and state changes, 1.1 to 1.6s for entrances.
- Entrances use the shared classes in `layout.css` through the `reveal` action: `.reveal` (fade, rise, slight blur), `.line-mask` (a heading line rising from a mask), `.rule-grow` (a hairline growing from the left). Stagger with `delay`.
- Scroll-linked motion writes one value per frame through `onFrame`. Keep one moment per section (listed below) and add no others.
- Hover states lift by 2 to 6px, scale images by about 1.05, or slide a marker. Nothing bounces, spins or tilts.

### Sections

- **Nav** (`Nav.svelte`): a floating pill that gains a blurred ivory background after 40px of scroll and switches to light text over the gallery. Left: the "Laras" wordmark, which fills with roseink as the page scrolls and returns to the top. Centre: section links with a blush marker that slides to the active or hovered link. Right: the EN / ID switch with the same sliding marker, then the "Get in Touch" pill. Below 900px the links collapse into a sheet behind a two-line burger.
- **Hero** (`Hero.svelte`): the name only, two lines, the second italic in mocha, with a "See the work" pill. No tagline, no images, no reel covers. A thin arch draws itself on load, a warm spotlight follows the cursor, and the two lines drift apart as the page scrolls away.
- **Brands** (`Marquee.svelte`): one logo per brand in mocha, used as a mask so it always takes palette colour. The band drifts slowly and is pushed by scroll velocity. Each logo plays that brand's reel.
- **About** (`About.svelte`): heading on the left, text on the right. The intro is swept line by line with a blush highlighter. The three services are large serif rows divided by hairlines; the row at the middle of the screen, or under the cursor, lights up with a blush wash and roseink text.
- **Work** (`Hall.svelte`): the dark room. The latest reel is shown large beside its details; its cover enters as an arch and opens into a full frame, with its colours glowing softly on the wall behind it. Below, the other reels form a wall of 9:16 covers in 2, 3 or 4 columns, each column starting at a different height and moving at its own rate. Every cover is a real reel that plays in the lightbox. Do not turn the wall back into a small horizontal strip.
- **Lightbox** (`Lightbox.svelte`): Instagram's official embed beside the reel's details, with previous, next and close controls and arrow-key support.
- **Experience** (`Timeline.svelte`): heading pinned at the left with a large italic year that changes with the entry being read (desktop only). A rose line draws down the timeline as the page scrolls and the current node fills.
- **Contact** (`Contact.svelte`): centred heading, a short line of text, the email in large serif and two outlined pills for the socials. A blush glow rises from the bottom and an arch rises around the content as the page scrolls. This is the end of the page: there is no footer, no copyright line.
- **Cursor** (`Cursor.svelte`): a small rose dot with a thin trailing ring that opens slightly over clickable things. No labels inside it and no large disc; that version was rejected as too much. It only runs on fine pointers.
- **Favicon** (`src/lib/assets/favicon.svg`): the italic L alone in rose with the gold full stop. No frame or badge, and not the darker roseink, which was rejected as too dark.

## Adding a reel

1. Save the cover as `static/gallery/reel-xx.webp` (720×1280).
2. Copy a block to the top of `gallery` in `src/lib/data.ts`; set `code` to the part after `/reel/` in the Instagram link and write the title, brand, roles, date, topic and note. Add the Indonesian date, topic and note (and title, when it differs) under the same `id` in `gallery` in `src/lib/i18n/id.ts`.
3. Shift the Roman numerals (`no`) of the other items; the newest is `I`.
4. For a new brand, add its logo to `static/brands/` and to `brandLogos`, with the key exactly matching `brand`.
5. Run `bun run og` if the preview image should change.
