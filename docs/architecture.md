# Architecture, and why

Why the code is shaped the way it is.
[CLAUDE.md](../CLAUDE.md) carries the same decisions compressed to rules; this is the reasoning behind them.
[DESIGN.md](../DESIGN.md) is normative for anything visual.

## State machine

`useReducer` + context, no state library.
The whole app is one finite state machine over six phases (`home`, `topics`, `players`, `reveal`, `discussion`, `ended`).
`src/game/reducer.ts` is the only place state changes.
Every action guards on the current phase and returns the state untouched if it doesn't apply.
Leaving `ended` (`game/playAgain` → `topics`, `game/exit` → `home`) keeps `players`, `topicIds` and `spyCount`, and only clears the round.

## Purity and randomness

The reducer is pure.
Randomness (spy, word) and `Date.now()` are drawn at the dispatch site and passed in the action payload — see `createRoundSetup()` in `src/game/round.ts`.
This matters concretely: React StrictMode double-invokes reducers in development, and an impure one would draw a different spy on each invocation.
It also makes the machine trivially testable.
Do not call `Math.random()` or `Date.now()` inside the reducer.

## The timer

The timer is deadline-based, never tick-accumulating.
While running, state holds an absolute `endsAt`; while paused, it holds `remainingMs` and `endsAt` is null.
Every frame recomputes from `Date.now()`.
Backgrounding the browser, locking the phone or reloading the page therefore cannot drift or lose time.
`<Countdown>` is the only component that re-renders per tick, and it resyncs on `visibilitychange` because backgrounded tabs throttle intervals.

## No router

Rendering is phase-driven.
This app is meant to be wrapped in a native shell (Capacitor) later, where it is served from something like `file://` and a history-based router would be a liability.

## Persistence

All storage goes through `src/lib/storage.ts`.
`localStorage` throws in private mode and on quota exhaustion, and a party game must not die from that, so every call is wrapped and failures are swallowed.
It is also the seam where a native preferences plugin will be swapped in.
No component may touch `localStorage` directly.

Stored state is validated, never repaired.
`parseStoredState()` in `src/game/persistence.ts` checks the version, the shape *and* cross-field consistency: `topicIds` is a non-empty set of known ids; `spyCount` is an integer `1 … MAX_PLAYERS`; in a live round (`reveal`/`discussion`/`ended`) every spy id is in the roster, `spyIds.length` equals `spyCount`, and the word id is known; before the round starts `spyIds` is empty and `wordId` is null or a known "last word" memo; `revealIndex` is in range while revealing.
A pre-round `spyCount` above the roster is *not* rejected — the Players screen clamps it on load.
Anything else off is discarded and the app boots clean.
Changing the state shape means bumping `STATE_VERSION` and `STORAGE_KEY`'s suffix — currently `v4`.

Writes are debounced ~200ms, with a flush on `pagehide` and `visibilitychange` — a backgrounded mobile browser may never run the timeout.

Whether a card is currently face-up is intentionally *not* persisted.
Reloading on the card step restores that player's card face-down; they tap again.
Persisting it would mean a reload could expose a role to whoever is holding the phone.

"No going back" on a revealed card falls out of keying reveal state to the player id (`revealedFor === player.id` in `RevealScreen`) rather than a boolean.
Once the reducer advances, the id no longer matches and the next card is face-down by construction.

## i18n

Every user-facing string goes through `t()`.
State stores a `wordId` (and `topicIds`), never a translated word, so a language switch mid-game is safe.
Namespaces are `common`, `words`, `topics` and `hints`, one JSON file each per locale; locales are discovered with `import.meta.glob`, so adding a language needs no code change.

The locale is chosen on the lid and nowhere else.
`<LanguagePicker>` — a round globe punch in the home screen's top-right corner — opens a small insert listing every entry in `SUPPORTED_LOCALES`, each row a piece punched from it (the language in play is the punched one, with the brass pip; the rest are scored die lines).
Choosing one calls `setLocale()` in `src/i18n/index.ts`, the only writer of `spy:locale:v1` and of `document.documentElement.lang`.
Each locale's `common.json` supplies its own `language.name`, written in itself, so a new `locales/` folder needs no code here either.
The picker renders only on `HomeScreen`: from the topics screen on, the phone is being passed around, and a stray tap on a corner must not relabel the game under whoever is holding it.
A stored locale that no longer ships is ignored and the app boots in `FALLBACK_LOCALE`.

## Topics and words

Topics and words share one source of truth: `src/game/topics.ts`.
`TOPICS` lists each topic's `words`, each a `{ id, hintId }` pair; `words.ts` derives its flat `WORD_IDS` pool and the `hintIdForWord` lookup by flattening them, and `createRoundSetup` draws from `wordIdsForTopics(topicIds)`.
Word ids are unique across topics.
Every topic runs on one binary adjective axis — exactly two `hintId`s, e.g. `travel` → `fast`/`slow` — and the spy's card shows that adjective as its only clue.
Adding a topic is a `TOPICS` entry plus a `topics.json` line plus its `words.json` and `hints.json` lines — no other code.

## Multiple spies

The spy count is runtime state, set on the Players screen.
`spyCount` lives on `GameState`; `config.ts` only exports `DEFAULT_SPY_COUNT` (the value a fresh session starts at).
A `[−] N [+]` stepper on `PlayersScreen` dispatches `spyCount/set`, which the reducer clamps to `1 <= spyCount <= players.length` (`clampSpyCount`).
`player/remove` re-clamps when the roster shrinks past the count, and `PlayersScreen` has a mount effect that clamps a persisted value that arrived too high.
The state models the spies as a set (`spyIds: string[]`), `createRoundSetup(players, topicIds, prevWord, spyCount)` draws exactly that many with `pickSample`, and every screen asks `spyIds.includes(id)`.
The `_one`/`_other` plural strings (`players.subtitle`, `discussion.hint`, `ended.subtitle`) are selected by passing `{ count: state.spyCount }` at the call site.
`spyCount` is kept across "Play again" and "Exit", like the roster and topics.

A spy's card never says how many spies there are.
`role.spy.hint` is a single, non-plural string and `RoleCard` takes no `spyCount`: with two spies the card is byte-for-byte what it is with one.
Knowing an ally exists — let alone that one does not — is information the round is supposed to withhold, and the count is already public on the Players and Discussion screens.
Do not reintroduce a plural here.

## Visual system

All visual constants live in `src/styles/tokens.css`, split into a raw `--palette-*` ramp and a semantic `--color-*` layer.
Component CSS contains no hex colours, pixel values or font stacks — `public/favicon.svg` and `src/assets/card-back.svg` are the only exceptions, since a standalone SVG asset can't read the page's custom properties.
Keep XML comments out of those two: a `--` inside one makes the file invalid XML and a strict parser drops it silently.

There is one theme, on purpose.
The world is a printed box in a dim room, so `tokens.css` declares `color-scheme: dark` once and carries no `prefers-color-scheme` block.
A light mode would be a different product, not a different setting.
Do not add one without the owner's sign-off.

Depth is the grammar of what can be touched.
Every interactive surface is a piece die-cut from board — a 4px bottom edge in the stock's darker tone, an offset shadow, a 2px sink on press — or the dashed die line of a piece that was never punched out, which is what "disabled" means everywhere in this app.
A new control inherits all of that from `Button`; it does not restyle it.
DESIGN.md carries this and the rest as named rules.

Both faces are self-hosted.
Rammetto One (display) and Rubik (text) ship from `@fontsource` packages via `src/styles/fonts.css`, subset with `unicode-range`.
Nothing may be fetched from a font CDN: the app has to run offline after first load and from `file://` inside the planned Capacitor shell.
Rammetto has no Cyrillic, so display type asks for weight 800 with `font-synthesis: none` and Russian falls through to Rubik's variable axis.

The content column is pinned to `100dvh`, not grown past it.
`Screen` caps it at `24.5rem` and gives it its own `overflow-y`, so a twelve-player roster scrolls inside its own rack instead of pushing the primary action below the fold.
The primary action is always the last element in the column.

A foil title is one line, fitted to the column.
The `font-size` a screen gives `<FoilTitle>` is the *maximum*; `useFitToWidth` measures the line and scales it down by the ratio it overflows the block by, which is exact because text width is linear in font size.
"Spy" is stamped at the full `7rem`; "Шпион" is not, and neither is a long `ended.title` on a 320px phone.
The fit re-runs on resize and on `document.fonts.ready`, because a line measured in the fallback face comes out the wrong width.

## Motion and view transitions

A phase change is a view transition; everything else is one piece settling.
Motion is documented in DESIGN.md and is normative like the rest of it.
The keyframes are global, in `src/styles/motion.css`, because a `::view-transition-*` pseudo-element lives on the document root and cannot see a CSS-module-scoped name.
`Screen`'s content column carries `view-transition-name: phase-column`, which lifts it out of the root snapshot, so the printed sheet cross-fades in place while only the column travels — up from below on the way in, off over the top on the way out.
`GameProvider` starts the transition, and only for an action that actually changes phase: it asks the reducer what the action will do first, which is exact because the reducer is pure.
It does not start one while the page is hidden, and it applies the action anyway if the browser has not called back in 200ms — a hidden document gets no rendering opportunities, and a round must never be lost to one.

## Gotchas, long form

`<Countdown>` owns the whole clock token — label, digits and the burning-down brass ring — because it is the only component that re-renders per tick.
The ring's `stroke-dashoffset` is **negative**, which is what makes the gap open at twelve o'clock and grow clockwise; a positive one eats the ring the other way round.
Its geometry is the one set of real numbers in `tokens.ts` (`ring`), because the circumference has to be computed in JS and SVG's `r` is not dependable as a CSS property.

Write an animation as `animation: var(--animation-*)`, never as a bare keyframe name.
CSS Modules rewrites an animation name it finds in a module file to a scoped one; the keyframes are global, so a bare name resolves to nothing and the animation silently does not run while the element still looks correct at rest.
The gestures are whole `animation` shorthands in `tokens.css`, and a name inside `var()` is not rewritten.

`<Countdown>`'s `onExpire` must be referentially stable, or the tick effect re-subscribes every render.
`DiscussionScreen` wraps it in `useCallback`.

Interpolating with a variable named `count` triggers i18next pluralisation.
Use a different name (`current`, `total`) unless plural forms are wanted — `players.needMore` and `players.spyHint` do want them and carry `_one`/`_other`.

CSS uses `100dvh`, not `100vh`, and pads with `env(safe-area-inset-*)`; `index.html` sets `viewport-fit=cover` to make that meaningful.

Text that swaps in place (the reveal hint, the setup error line, the roster hint) has a reserved `min-height` (`--size-line-reserved`) so nothing shifts underneath it.

A piece that is disabled reads `--cut` and `--muted` from the surface it sits on, not from itself: `Screen` sets one pair for the lid and the board, and `Insert` overrides them for pieces punched from the lifted insert.

Player names go up to 24 characters.
The card's name plate steps through three display sizes rather than breaking a name mid-word, and a roster tile ellipsizes.
