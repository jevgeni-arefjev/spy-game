---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: ["src/styles/tokens.css","src/components/Screen.tsx"]
---

# Spy — the shipped app

Scope: the whole React app under `src/`, all six phases of the round.
Mode: Operate.
Audience, job, constraints: see PRODUCT.md. Visual world: see DESIGN.md.
Kind: the mockup direction v6-5 Night Lid / Wallpaper, ported into the real app as its permanent design.

## Provenance

The world was chosen by comparing seven static mockups (`v1/` … `v6-5/`) in `tools/compare`.
`v6-5/DIRECTION.md` is the approved comp and remains the reference for pixel questions the tokens do not answer.
The earlier versions stay in the repo as the record of the exploration; they are not maintained and must not be edited to match the app.

## What the port changed on purpose

- **Self-hosted fonts.** The mockups load Rammetto One and Rubik from Google Fonts. The app must run offline after first load and from `file://` inside the planned Capacitor shell, so both faces ship from `@fontsource` packages through `src/styles/fonts.css`, subset by `unicode-range`.
- **Raster assets as files, not data URIs.** The mockups inline the wallpaper and the three spy poses as base64 because the comparison page loads each version through `iframe.srcdoc`. The app has a document to resolve against, so they are WebP files in `src/assets/` that Vite hashes and emits.
- **One theme, declared.** `tokens.css` carries no `prefers-color-scheme` block and sets `color-scheme: dark` once.
- **A capped, pinned column.** The mockups are a fixed 360×780 frame with `overflow: hidden`. The app caps the column at `24.5rem` and pins it to `100dvh`, so a twelve-player roster scrolls inside its own rack instead of pushing the primary action below the fold, and a window too short for even the minimum layout scrolls the column rather than clipping it.
- **Names that do not fit.** A card's name plate steps through three display sizes rather than breaking a name mid-word; a roster tile ellipsizes.

## Known bounds

- On a window much wider than a phone the wallpaper is scaled well past its native 941×1672. The sheet is a photograph and cannot tile without a seam, so `cover` is the correct call and the blow-up is accepted. The product's use scene is a phone in one hand.
- The Russian locale does not get the display face: Rammetto One has no Cyrillic and falls through to Rubik at weight 800. See DESIGN.md's One-Weight Display Rule.

## Verifying a change

`npm test`, `npm run build` and `npm run lint` are the three gates.
For visual work, build and serve `dist/`, then drive headless Chrome over the six phases by seeding `localStorage['spy:session:v4']` from a same-origin page that redirects to `/`.
Capture the phases in one batch, fix everything the batch shows at once, confirm with at most one more round, and stop.
