# Spy

A mobile-first, pass-and-play party game. Three or more people share one phone.
Everyone sees the same secret word — except the spy, who has to blend in and work
it out while everyone else tries to spot them. Five minutes on the clock, then
"Time's up".

Built on React + TypeScript + Vite. No router, no state library, no UI kit.

## Running it

```shell
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm test         # vitest — unit suite for the game logic
npm run preview  # serve the production build
npm run lint
```

It is designed for a 360px-wide viewport. In a desktop browser, open device
emulation and pick a phone.

## How a round works

`setup → reveal → discussion → ended`, driven entirely by
[`src/game/reducer.ts`](src/game/reducer.ts) — there is no router, the phase
decides what renders.

1. **Setup** — add at least three names.
2. **Reveal** — for each player in turn: a handoff screen ("pass the phone
   to…"), then a face-down card they tap to see their role. "Got it" advances;
   a card can never be revealed twice.
3. **Discussion** — a five-minute countdown with pause/resume and "End round".
4. **Ended** — play again with the same players (new word, new spy), or start
   over.

The whole session is written to `localStorage` under `spy:session:v2`, so
reloading mid-reveal or mid-timer puts the group back exactly where they were.
The timer stores an absolute deadline rather than counting ticks, so
backgrounding the browser or locking the phone doesn't lose time.

## Adding a locale

1. Copy `src/i18n/locales/en/` to `src/i18n/locales/<code>/` and translate
   `common.json` (UI strings) and `words.json` (the word list).
2. That's it — `src/i18n/index.ts` discovers `locales/*/*.json` with
   `import.meta.glob`, so no wiring to update. `SUPPORTED_LOCALES` picks the new
   folder up automatically.

Only `FALLBACK_LOCALE` in `src/i18n/index.ts` is hardcoded, and only because
something has to be the fallback. To let players choose a language, call
`i18n.changeLanguage(code)` — state stores a `wordId`, never a translated
string, so switching mid-game is safe.

Every user-facing string lives in the locale files. Nothing in the components
contains display text.

## Adding words

1. Add `{ id: 'library' }` to `WORDS` in [`src/game/words.ts`](src/game/words.ts).
2. Add `"library": "Library"` to `words.json` in **every** locale folder.

The id is what gets persisted, so ids must stay stable once a build ships. Word
selection never repeats the previous round's word for a group playing again.

## Editing the theme

Everything visual lives in [`src/styles/tokens.css`](src/styles/tokens.css), in
two layers:

- `--palette-*` — the raw colour ramps. Components never touch these.
- `--color-*`, plus the spacing, type, radius, shadow, motion and layout scales
  — the semantic layer components actually use.

To restyle the app, override the semantic layer. Dark mode is exactly that: one
`@media (prefers-color-scheme: dark)` block at the bottom of the file
redefining `--color-*` and nothing else. A user-selectable theme would be the
same block keyed on `[data-theme="…"]`.

[`src/styles/tokens.ts`](src/styles/tokens.ts) mirrors the same names as typed
`var()` references for the rare places JavaScript needs a token; keep the two
files in step.

Component styles are CSS Modules sitting next to their component, and they
contain no raw hex colours, pixel values or font stacks. The one exception is
`public/favicon.svg`, which is a standalone asset and can't read the page's
custom properties.

## Tuning the rules

[`src/game/config.ts`](src/game/config.ts) holds `SPY_COUNT`,
`DISCUSSION_SECONDS`, `MIN_PLAYERS`, `MAX_PLAYERS` and the storage key. Changing
the persisted shape means bumping `STATE_VERSION` — old sessions are then
discarded on boot rather than migrated.

`SPY_COUNT` is a live switch: the state stores the spies as a set and the copy
has singular/plural forms, so setting it to `2` genuinely gives you two spies
with no other change. Keep it below `MIN_PLAYERS` — a round needs civilians.
Changing it discards any in-progress session on the next boot.

## Bundle size

Gzipped production build: **72.1 kB** total (68.1 kB JS, 3.6 kB CSS, 0.4 kB
HTML). Splitting it out to measure: ~43.1 kB React, ~19.4 kB
i18next + react-i18next, ~6.7 kB of this app's own code.

`npm run build` prints these figures on every build.
