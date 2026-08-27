# CLAUDE.md

Guidance for Claude Code working in this repository.

## What this is

**Spy** — a mobile-first, pass-and-play party game for one shared phone. One
player is secretly the spy; everyone else sees the same word. Five minutes of
discussion, then "Time's up". Voting, scoring and elimination are deliberately
out of scope; the round ends at the timer.

Built on the Vite + React + TypeScript boilerplate that was already here. See
[README.md](README.md) for how to run it and how to add locales, words and
themes.

## Commands

```shell
npm run dev      # dev server
npm run build    # tsc -b && vite build — this is the type-check
npm run lint     # eslint
npm run preview  # serve dist/
```

There is no test runner. `npm run build` is the only automated gate, so run
both `build` and `lint` before calling anything done.

## Layout

```
src/
  game/          domain: config, types, reducer, words, persistence, context
  lib/           storage.ts, classNames.ts, themeColor.ts — no React, no game rules
  components/    reusable UI: Screen, Button, RoleCard, Countdown
  screens/       one per phase: Setup, Reveal, Discussion, Ended
  i18n/          i18next setup + locales/<locale>/<namespace>.json
  styles/        tokens.css (the visual source of truth), tokens.ts, global.css
```

Each component has its `.module.css` next to it. Imports are relative; there
are no path aliases.

## Conventions

- TypeScript strict, plus `noUnusedLocals` / `noUnusedParameters`.
- No semicolons, single quotes, two-space indent — matching the boilerplate.
  There is no Prettier config; follow the surrounding file.
- Named exports everywhere except `App`, which stays a default export because
  `main.tsx` imports it that way.
- Components and hooks live in separate files from the contexts they use, so
  `react-refresh/only-export-components` stays quiet.

## Decisions, and why

**`useReducer` + context, no state library.** The whole app is one finite state
machine over four phases. `src/game/reducer.ts` is the only place state
changes.

**The reducer is pure.** Randomness (spy, word) and `Date.now()` are drawn at
the dispatch site and passed in the action payload — see
`createRoundSetup()` in `src/game/round.ts`. This matters concretely: React
StrictMode double-invokes reducers in development, and an impure one would draw
a different spy on each invocation. It also makes the machine trivially
testable. **Do not call `Math.random()` or `Date.now()` inside the reducer.**

**The timer is deadline-based, never tick-accumulating.** While running, state
holds an absolute `endsAt`; while paused, it holds `remainingMs` and `endsAt`
is null. Every frame recomputes from `Date.now()`. Backgrounding the browser,
locking the phone or reloading the page therefore cannot drift or lose time.
`<Countdown>` is the only component that re-renders per tick, and it resyncs on
`visibilitychange` because backgrounded tabs throttle intervals.

**No router.** Rendering is phase-driven. This app is meant to be wrapped in a
native shell (Capacitor) later, where it is served from something like
`file://` and a history-based router would be a liability.

**All storage goes through `src/lib/storage.ts`.** `localStorage` throws in
private mode and on quota exhaustion, and a party game must not die from that,
so every call is wrapped and failures are swallowed. It is also the seam where
a native preferences plugin will be swapped in. No component may touch
`localStorage` directly.

**Stored state is validated, never repaired.** `parseStoredState()` in
`src/game/persistence.ts` checks the version, the shape *and* cross-field
consistency (the spy is in the roster, the word id is known, `revealIndex` is
in range). Anything off is discarded and the app boots clean. Changing the
state shape means bumping `STATE_VERSION` and `STORAGE_KEY`'s suffix.

**Writes are debounced ~200ms**, with a flush on `pagehide` and
`visibilitychange` — a backgrounded mobile browser may never run the timeout.

**"No going back" on a revealed card** falls out of keying reveal state to the
player id (`revealedFor === player.id` in `RevealScreen`) rather than a boolean.
Once the reducer advances, the id no longer matches and the next card is
face-down by construction.

**Every user-facing string goes through `t()`.** State stores a `wordId`, never
a translated word, so a language switch mid-game is safe. Locales are
discovered with `import.meta.glob`, so adding a language needs no code change.

**All visual constants live in `src/styles/tokens.css`**, split into a raw
`--palette-*` ramp and a semantic `--color-*` layer. Only the semantic layer is
overridden by a theme, which is why the dark mode block is short. Component CSS
contains no hex colours, pixel values or font stacks — `public/favicon.svg` is
the sole exception, since a standalone SVG asset can't read the page's custom
properties.

**`SPY_COUNT` is a config constant but the state models one spy** (`spyId:
string | null`, as specified). Raising `SPY_COUNT` above 1 requires widening
that field to `spyIds: string[]`, updating `persistence.ts`, and bumping
`STATE_VERSION`. The constant is not a switch you can flip on its own.

## Gotchas

- `<Countdown>`'s `onExpire` must be referentially stable, or the tick effect
  re-subscribes every render. `DiscussionScreen` wraps it in `useCallback`.
- Interpolating with a variable named `count` triggers i18next pluralisation.
  Use a different name (`current`, `total`) unless plural forms are wanted —
  `setup.needMore` and `setup.spyHint` do want them and carry `_one`/`_other`.
- CSS uses `100dvh`, not `100vh`, and pads with `env(safe-area-inset-*)`;
  `index.html` sets `viewport-fit=cover` to make that meaningful.
- Text that swaps in place (the reveal hint, the setup error line) has a
  reserved `min-height` so nothing shifts underneath it.
- Whether a card is currently face-up is intentionally *not* persisted.
  Reloading on the card step restores that player's card face-down; they tap
  again. Persisting it would mean a reload could expose a role to whoever is
  holding the phone.

## Out of scope on purpose

Voting, scoring, elimination, multiple spies, per-player word sets, network
play, sound. Ask before adding any of them.
