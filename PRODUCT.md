# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The player group is three to twelve people in the same room, sharing one phone that gets passed around.
No accounts, no second device, no network between players.

Two audiences matter equally and every surface must serve both:

- **First-timers** who have never played this or any hidden-role game and are learning the rules in the moment, mid-gathering, with other people waiting.
- **Party-game regulars** who already know Spyfall, Werewolf and the like and reach for this when they want a faster, lower-setup option.

The occasion is a casual social gathering: a table after dinner, pre-drinks, a road trip, a lull between other activities.
Ages and attention spans vary within a single session.

## Product Purpose

Spy runs one short round of a hidden-role word game on a single shared phone.
One player is secretly the spy; everyone else sees the same secret word.
The spy sees only a one-word adjective clue and has to blend in.
The group talks for five minutes, then the phone says "Time's up" and the round is over.

Success is a group that picks the game up cold, plays a full round without anyone re-reading instructions or asking how it works, and immediately starts another.
The product succeeds when it feels like part of the evening, not a piece of software the evening had to stop for.

## Positioning

Spy does not claim a defensible mechanic over other hidden-role games.
Its intent is a specific impression: a game that looks fun and authentic, has an unmistakable game-night vibe, is obvious to navigate, and whose rules are understood without being read.

The honest description of how it works, which future work must not blur:

- Everything happens on one phone passed hand to hand; there is no lobby, pairing, or per-player device.
- There is no voting, scoring, or elimination in the app. The round ends at the timer and the group settles the accusation among themselves. This is deliberate and adding any of it needs the owner's sign-off.
- The spy is not blind. Each topic runs on one binary adjective axis (for example fast / slow, loud / quiet) and the spy's card shows one side of that axis as its only clue.
- Topic selection and the player roster persist between rounds and stay editable. "Play again" returns to the topics screen; "Exit" returns home; neither clears the roster, the topics, or the spy count.

## Operating Context

A round is a fixed linear flow: `home -> topics -> players -> reveal -> discussion -> ended`.

- **Home**: a single button to start.
- **Topics**: the group includes or excludes named word sets (at least one, up to all). The secret word is drawn from the union of the included sets.
- **Players**: names are added (three minimum, twelve maximum) and the spy count is set with a stepper, clamped to one through the current player count.
- **Reveal**: the phone is passed to each player in turn. A handoff screen names who is next, then a face-down card they tap to see their role, then "Got it" to advance. A card can never be revealed twice, including across a reload.
- **Discussion**: a five-minute countdown with pause / resume and an early "End round". The timer is deadline-based, so locking the phone or backgrounding the browser does not lose or drift time.
- **Ended**: "Time's up", then "Play again" or "Exit".

The whole session is written to `localStorage`, so a reload mid-reveal or mid-timer returns the group to exactly where they were, except that a face-up card comes back face-down on purpose.

The app is used in portrait on a phone held by whoever is currently "it", often in a room that is loud, dim, or moving.
It must assume it will be backgrounded, locked, and reloaded during a single round.

## Capabilities and Constraints

- Mobile-first web app, designed for a 360px-wide portrait viewport. Built on Vite + React + TypeScript with no router, no state library, and no UI kit; rendering is driven entirely by the current phase.
- Runs fully offline after first load. No backend, no analytics, no per-player networking.
- A native shell (Capacitor) is a planned later packaging step. It does not change the design language: this stays a mobile web app and should not be pulled toward iOS or Android platform conventions. Platform stays `web`.
- All persistence goes through one storage seam that swallows failures, so private mode or a full quota degrades the session rather than breaking it. Stored state is validated on boot and discarded whole if inconsistent; it is never repaired.
- Randomness (which player is the spy, which word) and the clock are never read inside the state machine; they are drawn at the dispatch site so the machine stays pure and StrictMode-safe.
- Fully localized. Every user-facing string resolves through `t()`; state stores word and topic ids, never translated text, so the language can change mid-round. English and Russian ship today; a locale is added as JSON files with no code change.
- Singular and plural forms exist for every count-bearing string because the spy count is genuinely variable (one or more).
- The gzipped production build is tracked as a budget (around 72 kB total today) and printed on every build.

Key domain terms, to be used consistently: **spy** and **civilian** (the two roles); **roster** (the ordered list of player names); **topic** (a named word set on one binary adjective axis); **hint** / **adjective** (the spy's single clue); **spy count** (how many spies this round, runtime state); **reveal** (the pass-and-tap role handoff); **round** (one full flow from topics to ended).

## Brand Commitments

- The product name is "Spy".
- The one-line framing is "One phone. One spy." (and its plural, "One phone. N spies.").
- Voice in the shipped copy is terse, plain, and calm: short imperatives ("Keep it to yourself.", "Find the spy."), no exclamation, no theming or spy-movie pastiche in the words themselves. New copy should match that register.
- No logo or wordmark exists yet beyond `public/favicon.svg`. There is no fixed palette or type commitment; the visual world is open.

## Evidence on Hand

- The content set: five topics (Locations, Professions, Food & Drink, Entertainment, Travel), each a list of words tagged to one of two adjectives, plus the ten adjective clues, all in English and Russian. Source of truth is `src/game/topics.ts` with display strings in `src/i18n/locales/<code>/`.
- No customers, testimonials, reviews, press, install numbers, or usage data exist. Future work must not invent any.
- No marketing site, app store listing, screenshots, or promotional copy exist yet.

## Product Principles

1. **The evening should not have to stop for the app.** Cold pickup, no instruction screen anyone has to read, no step that makes the group wait on whoever holds the phone.
2. **Serve the newcomer and the regular in the same screen.** Clear enough to play blind, lean enough that a fifth round does not feel padded.
3. **Survive real conditions.** Loud rooms, dim light, one-handed use, the phone getting locked, the tab getting backgrounded, an accidental reload; none of these may lose the round or leak a role.
4. **The app hosts, it does not judge.** It deals roles and runs the clock. Voting, scoring, and elimination stay with the people at the table unless the owner decides otherwise.
5. **One phone, no dependencies.** Offline, no accounts, no second device; anything that assumes connectivity or a server is out of scope.

## Accessibility & Inclusion

No formal conformance standard has been set.
Established product-specific needs: full localization including languages read at different lengths; legibility and target sizes that hold up in a dim, moving room for a wide age range; and a flow that is understandable without audio and without prior knowledge of the genre.
