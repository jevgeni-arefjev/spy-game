# Mockup harness contract (shared by v1 … v5)

Every version is a static, self-contained mockup of the whole Spy flow in one visual world.
The five versions are compared side by side in a browser artifact, so they must share this contract exactly.
The world is free; the content, the frames and the message API are not.

## Files per version

- `vN/index.html`: one file, inline `<style>` and `<script>`. The only external requests allowed are Google Fonts (`fonts.googleapis.com` stylesheet link plus `fonts.gstatic.com` preconnect). No images fetched from the network; any texture or drawn asset is inline SVG or a data URI. No frameworks, no CDN scripts.
- `vN/DIRECTION.md`: the direction in prose for a human reader: thesis, palette (with hex values), type (faces and what each is used for), materials, controls and states, the signature interaction, honest risk. Written after the build, from what was built.

Sentences in Markdown each go on their own line.

## The seven frames

The app has six phases, and the reveal phase has two sub-screens, so a version renders seven frames, in this order, with these exact `data-screen` ids:

| id | phase | what it shows |
|---|---|---|
| `home` | home | title, tagline, one primary button |
| `topics` | topics | title, subtitle, "Included 3 / 5", five toggles, Continue, Back |
| `players` | players | title, subtitle, name input + Add, spy stepper, roster 6 / 12, hint line, Start game, Back |
| `handoff` | reveal (handoff step) | progress line, "Pass the phone to Priya", "I'm Priya" |
| `card` | reveal (card step) | progress line, the face-down card, the hint line, "Got it" (disabled until revealed) |
| `discussion` | discussion | title, "Time left" label, the clock, hint, Pause, End round |
| `ended` | ended | "Time's up", subtitle, Play again, Exit |

Each frame is a `<section class="phone" data-screen="…">` containing the screen at exactly **360 × 780 CSS px** (portrait, `overflow: hidden`; a list that would scroll on a real phone scrolls inside its own region). The screen fills the frame; do not draw a device bezel, notch or status bar. The comparison page draws the bezel.

Design for a real 360-wide phone: touch targets at least 44 px tall, safe-area padding at top and bottom (24 px top, 28 px bottom is a fair stand-in), the primary action reachable by a thumb in the lower third.

## Two display modes

**Strip mode** (default when `vN/index.html` is opened directly): a page header naming the version and its direction in one line, then the seven frames laid out in a wrapping row on a neutral ground with a small caption under each (`Home`, `Topics`, `Players`, `Handoff`, `Card`, `Discussion`, `Ended`). Above the `card` frame a small out-of-frame control toggles the demo role: `Civilian` / `Spy`. The page chrome is neutral and quiet; it belongs to the mockup, not to the world, and must never compete with the frames.

**Single mode**: exactly one frame is shown at `0,0` with no page chrome, no caption, no header, `html, body { margin: 0; background: transparent; overflow: hidden }`, and the body sized to 360 × 780. Enter single mode from the URL hash on load (`#screen=card`) or from a message.

## Message API

The comparison page embeds each version in an iframe and drives it with `postMessage`. Listen on `window` for `message` events whose `data` is an object with `type`:

- `{ type: 'spy:show', screen: 'home' | 'topics' | 'players' | 'handoff' | 'card' | 'discussion' | 'ended' | 'all' }`. Any single id enters single mode showing that frame; `'all'` returns to strip mode.
- `{ type: 'spy:role', role: 'civilian' | 'spy' }`. Sets which face the card shows when revealed. If the card is currently revealed, reset it to face-down first so no role is ever shown by swapping in place.
- `{ type: 'spy:reset' }`. Returns every frame to its initial state: card face-down, timer at 03:47 and running, topics and roster as in the demo data, no error shown.

Also honor the hash on load (`#screen=…`, `#role=spy`), and post `{ type: 'spy:ready', version: 'vN' }` to `window.parent` once fonts have loaded (`document.fonts.ready`) so the comparison page can fade the frame in.

## Demo data (identical in all five versions)

- Roster, in order: Mia, Theo, Priya, Jonas, Aiko, Sam. Six players, maximum twelve.
- Spy count: 1.
- Topics, in order, with included state: Locations (included), Professions (excluded), Food & Drink (included), Entertainment (excluded), Travel (included). So "3 / 5".
- The reveal is at player 3 of 6: Priya.
- The word is **Hot-air balloon** (topic Travel). Its adjective axis is fast / slow and the spy's hint is **Slow**.
- The clock reads **03:47** and is running.

## Exact copy

Every visible string below is the shipped English locale, interpolated with the demo data. Use them verbatim, including punctuation. Do not add taglines, instructions, jokes, spy-movie pastiche or any string that is not on this list. Decorative text that is part of a world's material (a cue number, a product code, a printed label such as "TIME LEFT" reusing a listed string) is allowed only when it carries real information from the demo data or the state, never invented claims.

Home
- `Spy`
- `One phone. One spy.`
- `Play Spy`

Topics
- `Topics`
- `Pick which sets of words can come up. Keep at least one.`
- `Included` and `3 / 5` (updates live as toggles change)
- `Locations`, `Professions`, `Food & Drink`, `Entertainment`, `Travel`
- `Continue`
- `Back`

Players
- `Players`
- `Pass the phone around. One of you is the spy.`
- input placeholder `Add a player`; visually hidden label `Player name`
- `Add`
- `Spies` with a stepper: minus button (aria-label `Fewer spies`), the value `1`, plus button (aria-label `More spies`)
- `Players` and `6 / 12` (heading of the roster, updates live)
- roster rows with a remove control (aria-label `Remove Mia` etc.)
- `No players yet.` when the roster is empty
- error line (reserved height, empty by default): `Type a name first.` / `Someone already has that name.` / `That's the maximum of 12 players.`
- hint line: `1 of you will secretly be the spy.` when ready (3+ players); otherwise `Add 1 more player to start.` / `Add 2 more players to start.` / `Add 3 more players to start.`
- `Start game` (disabled when fewer than 3 players)
- `Back`

Handoff
- `Player 3 of 6`
- `Pass the phone to Priya`
- `I'm Priya`

Card
- `Player 3 of 6`
- card back: `Priya` and `Tap to reveal`; the card's accessible name is `Priya's card — tap to reveal`
- civilian face: `Your word` then `Hot-air balloon`
- spy face: `You are the spy` then `Hint: Slow`
- hint line under the card: `Tap to reveal` before, `Keep it to yourself.` after (reserved height so nothing shifts)
- `Got it` (disabled until revealed)

Discussion
- `Discussion`
- `Time left` while running, `Paused` while paused
- the clock `03:47` in `MM:SS`, zero-padded
- `Take turns describing the word. Find the spy.`
- `Pause` / `Resume`
- `End round`

Ended
- `Time's up`
- `Decide together who the spy was.`
- `Play again`
- `Exit`

## Behaviour that must work in the mockup

- Topic toggles flip included / excluded and update the count. When only one topic is included, that one is disabled so it cannot be excluded (`aria-pressed` on every toggle).
- Add player validates: empty → `Type a name first.`; case-insensitive duplicate → `Someone already has that name.`; twelve players → `That's the maximum of 12 players.`. Remove works. The hint line and the Start button follow the roster size. The spy stepper clamps to `1 … players.length` and disables at the bounds.
- The card flips once on tap, stays flipped (there is no going back), enables `Got it`, and swaps the hint line. `Got it` in the mockup returns the card to face-down after a short delay, so the demo can be repeated.
- The clock counts down from 03:47 once per second; Pause / Resume works and swaps the label. `End round` freezes it. Nothing navigates between frames.
- Keyboard focus is visible and styled from the world's palette, never the browser default. Focus rings, text selection and the caret are themed.
- `prefers-reduced-motion` disables the flip animation and any continuous motion; the state change still happens.

## Verifying a version

Headless Chrome is available. From the repo root:

```
google-chrome --headless=new --hide-scrollbars --window-size=360,780 --force-device-scale-factor=2 \
  --screenshot=/path/to/out/card.png "file://$PWD/vN/index.html#screen=card"
```

Capture all seven single frames plus one strip capture at `--window-size=1600,1000` in one batch, open each image once, fix everything in one batch, confirm with at most one more round, and stop.
