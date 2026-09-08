# CLAUDE.md

Guidance for Claude Code working in this repository.

## What this is

**Spy** — a mobile-first, pass-and-play party game for one shared phone. One
player is secretly the spy; everyone else sees the same word. Five minutes of
discussion, then "Time's up". Voting, scoring and elimination are deliberately
out of scope; the round ends at the timer.

The flow is `home → topics → players → reveal → discussion → ended`. Topics are
sets of words the group includes or excludes (at least one, up to all); the
word is drawn from the union. The roster and the topic selection are remembered
and stay editable between games — "Play again" returns to the topics screen,
"Exit" returns home, and neither wipes them.

Built on the Vite + React + TypeScript boilerplate that was already here. See
[README.md](README.md) for how to run it and how to add locales, words and
themes.

## Commands

```shell
npm run dev      # dev server
npm run build    # tsc -b && vite build — this is the type-check
npm run lint     # eslint
npm test         # vitest run — the game/ and lib/ unit suite
npm run preview  # serve dist/
```

`npm test`, `npm run build` and `npm run lint` are the three gates; run all
three before calling anything done. Tests are `*.test.ts` files sitting next to
the module they cover, under `src/game/` and `src/lib/`. They cover pure logic
only — there are no component or DOM tests, so Vitest runs in the `node`
environment with no jsdom.

## Layout

```
src/
  game/          domain: config, types, reducer, topics, words, persistence, context
  lib/           storage.ts, classNames.ts, themeColor.ts — no React, no game rules
  components/    reusable UI: Screen, Button, RoleCard, Countdown
  screens/       one per phase: Home, Topics, Players, Reveal, Discussion, Ended
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
machine over six phases (`home`, `topics`, `players`, `reveal`, `discussion`,
`ended`). `src/game/reducer.ts` is the only place state changes. Every action
guards on the current phase and returns the state untouched if it doesn't
apply. Leaving `ended` (`game/playAgain` → `topics`, `game/exit` → `home`)
keeps `players`, `topicIds` and `spyCount`, and only clears the round.

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
consistency: `topicIds` is a non-empty set of known ids; `spyCount` is an
integer `1 … MAX_PLAYERS`; in a live round (`reveal`/`discussion`/`ended`) every
spy id is in the roster, `spyIds.length` equals `spyCount`, and the word id is
known; before the round starts `spyIds` is empty and `wordId` is null or a
known "last word" memo; `revealIndex` is in range while revealing. A pre-round
`spyCount` above the roster is *not* rejected — the Players screen clamps it on
load. Anything else off is discarded and the app boots clean. Changing the
state shape means bumping `STATE_VERSION` and `STORAGE_KEY`'s suffix — currently
`v4`.

**Writes are debounced ~200ms**, with a flush on `pagehide` and
`visibilitychange` — a backgrounded mobile browser may never run the timeout.

**"No going back" on a revealed card** falls out of keying reveal state to the
player id (`revealedFor === player.id` in `RevealScreen`) rather than a boolean.
Once the reducer advances, the id no longer matches and the next card is
face-down by construction.

**Every user-facing string goes through `t()`.** State stores a `wordId` (and
`topicIds`), never a translated word, so a language switch mid-game is safe.
Namespaces are `common`, `words`, `topics` and `hints`, one JSON file each per
locale; locales are discovered with `import.meta.glob`, so adding a language
needs no code change.

**Topics and words share one source of truth: `src/game/topics.ts`.** `TOPICS`
lists each topic's `words`, each a `{ id, hintId }` pair; `words.ts` derives its
flat `WORD_IDS` pool and the `hintIdForWord` lookup by flattening them, and
`createRoundSetup` draws from `wordIdsForTopics(topicIds)`. Word ids are unique
across topics. Every topic runs on one binary adjective axis — exactly two
`hintId`s, e.g. `travel` → `fast`/`slow` — and the spy's card shows that
adjective as its only clue. Adding a topic is a `TOPICS` entry plus a
`topics.json` line plus its `words.json` and `hints.json` lines — no other code.

**All visual constants live in `src/styles/tokens.css`**, split into a raw
`--palette-*` ramp and a semantic `--color-*` layer. Only the semantic layer is
overridden by a theme, which is why the dark mode block is short. Component CSS
contains no hex colours, pixel values or font stacks — `public/favicon.svg` is
the sole exception, since a standalone SVG asset can't read the page's custom
properties.

**The spy count is runtime state, set on the Players screen.** `spyCount` lives
on `GameState`; `config.ts` only exports `DEFAULT_SPY_COUNT` (the value a fresh
session starts at). A `[−] N [+]` stepper on `PlayersScreen` dispatches
`spyCount/set`, which the reducer clamps to `1 <= spyCount <= players.length`
(`clampSpyCount`). `player/remove` re-clamps when the roster shrinks past the
count, and `PlayersScreen` has a mount effect that clamps a persisted value
that arrived too high. The state models the spies as a set (`spyIds: string[]`),
`createRoundSetup(players, topicIds, prevWord, spyCount)` draws exactly that
many with `pickSample`, and every screen asks `spyIds.includes(id)`. The
`_one`/`_other` plural strings (`players.subtitle`, `discussion.hint`,
`ended.subtitle`, `role.spy.hint`, `app.tagline`) are selected by passing
`{ count: state.spyCount }` at the call site. `spyCount` is kept across "Play
again" and "Exit", like the roster and topics.

## Gotchas

- `<Countdown>`'s `onExpire` must be referentially stable, or the tick effect
  re-subscribes every render. `DiscussionScreen` wraps it in `useCallback`.
- Interpolating with a variable named `count` triggers i18next pluralisation.
  Use a different name (`current`, `total`) unless plural forms are wanted —
  `players.needMore` and `players.spyHint` do want them and carry `_one`/`_other`.
- CSS uses `100dvh`, not `100vh`, and pads with `env(safe-area-inset-*)`;
  `index.html` sets `viewport-fit=cover` to make that meaningful.
- Text that swaps in place (the reveal hint, the setup error line) has a
  reserved `min-height` so nothing shifts underneath it.
- Whether a card is currently face-up is intentionally *not* persisted.
  Reloading on the card step restores that player's card face-down; they tap
  again. Persisting it would mean a reload could expose a role to whoever is
  holding the phone.

## Out of scope on purpose

Voting, scoring, elimination, per-player word sets, network play, sound. Ask
before adding any of them. (Multiple spies is supported — `spyCount`, chosen on
the Players screen.)

## Agent skills

### Issue tracker

Issues and specs are tracked as GitHub issues via the `gh` CLI in
`jevgeni-arefjev/spy-game`. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical triage roles, each label string equal to its name:
`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`.
See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` plus `docs/adr/` at the repo root, created
lazily by `/domain-modeling`. See `docs/agents/domain.md`.
