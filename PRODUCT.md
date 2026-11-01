# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

A single-page personal portfolio for Larasati Putri Maharani, read by a mixed audience with no single priority (confirmed):

- Brands, local media (such as @infobdgcom) and agencies looking for voice over, model, or content talent in Bandung.
- Event organisers, campuses, and student associations looking for a Master of Ceremony.
- People who meet her through her studies and teaching in Information Technology at Telkom University.

They arrive from a link (Instagram bio, a DM, a CV) and decide within a short visit whether she fits their next project and how to reach her.

## Product Purpose

Show the work Larasati has already done, so a visitor can see and hear her before contacting her. Success means a visitor watches at least one piece of work and leaves knowing how to reach her (email or Instagram).

## Positioning

A working talent who has real, published brand work (voice over and on-camera reels for GrabFood, Ion Water, Eiger, Garuda Indonesia, Melinda Aesthetic Center and others via @infobdgcom), plus stage experience as an MC, alongside an IT degree and an assistant lecturer role. The portfolio is the proof: every gallery piece is a real, playable reel.

## Operating Context

- Gallery items are Instagram reels, played through Instagram's official embed in a lightbox; covers are downloaded stills stored in `static/gallery/`.
- New reels are added regularly by editing `src/lib/data.ts` (newest first, Roman numerals follow display order).
- Visitors are often on phones, arriving from Instagram.
- Deployed to Cloudflare via SvelteKit (`@sveltejs/adapter-cloudflare`).

## Capabilities and Constraints

- Sections: hero, about, gallery, experience timeline, contact.
- The gallery must read as a real portfolio of finished work: a showcase of what she has made, not a decorative list (confirmed priority).
- Language: English (switched from Indonesian at the user's request, 2026-11-01). Code comments stay in Indonesian.
- Undecided: whether the IT/assistant-lecturer side stays prominent, and whether the profile numbers (40+, 200, 150, 5) stay on the page. The user did not mark either as binding.

## Brand Commitments

- Voice: English, first person, professional but warm and natural; plain sentences with concrete facts. No slang, and nothing staged, inflated, or machine-written (avoid words like elevate, passionate, seamless, journey). History: the original Indonesian copy was rejected as "terlalu dibuat-buat dan AI banget", a casual "aku" rewrite as "kurang profesional", then the user asked for attractive English (2026-11-01).
- No descriptive tagline under the name in the hero (user removed it).
- The existing colour composition (ivory, blush, rose, mocha, gold, noir) is liked and stays (stated by the user).

## Evidence on Hand

- Real gallery reels with covers: `static/gallery/reel-01.webp` to `reel-07.webp`, metadata in `src/lib/data.ts`. Covers are fetched at 900×1600 from the reel's Instagram embed and saved as 720×1280 webp.
- No portrait photos yet. The two files in `static/portrait/` were tried and rejected by the user (2026-11-01); do not use them. Add a portrait only when Larasati supplies a good one.
- Profile facts (education, roles, timeline) in `src/lib/data.ts`.
- Absent and must not be fabricated: testimonials, client quotes, follower counts, awards, rates, or any reel that does not exist.

## Product Principles

1. The work comes first: every visitor should reach a playable reel quickly.
2. Sound like Larasati, not like a press release.
3. Only real work and real facts; nothing invented to look bigger.
4. Make reaching her obvious at the end of every path.
