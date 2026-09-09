---
name: Spy
description: A pass-and-play hidden-role party game, printed as a deluxe board-game box and played after dark.
colors:
  lid: "#241238"
  lid-deep: "#1a0d29"
  board: "#150c22"
  board-edge: "#0a0512"
  panel: "#33204d"
  panel-raised: "#3e2a5c"
  panel-sunk: "#241636"
  panel-edge: "#1d1230"
  token: "#6b46a8"
  token-edge: "#472c72"
  foil: "#e8b34a"
  foil-dim: "#b98d33"
  foil-edge: "#a97a20"
  ember: "#e0503c"
  ember-lit: "#ff7d69"
  ember-edge: "#a5321f"
  paper: "#f2eaf7"
  paper-muted: "#c3aed8"
  paper-dim: "#a08bb8"
typography:
  display:
    fontFamily: "Rammetto One, Rubik Variable, system-ui, sans-serif"
    fontSize: "7rem"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Rammetto One, Rubik Variable, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "0em"
  title:
    fontFamily: "Rubik Variable, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.005em"
  body:
    fontFamily: "Rubik Variable, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "0em"
  label:
    fontFamily: "Rubik Variable, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.14em"
rounded:
  xs: "0.3125rem"
  sm: "0.5625rem"
  md: "0.625rem"
  lg: "0.75rem"
  xl: "0.875rem"
  2xl: "1rem"
  circle: "50%"
spacing:
  1: "0.25rem"
  2: "0.5rem"
  3: "0.75rem"
  4: "1rem"
  5: "1.25rem"
  6: "1.5rem"
  7: "1.75rem"
  8: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.foil}"
    textColor: "{colors.lid-deep}"
    rounded: "{rounded.xl}"
    height: "3.75rem"
    padding: "0 1.25rem"
    typography: "{typography.title}"
  button-primary-active:
    backgroundColor: "{colors.foil}"
    textColor: "{colors.lid-deep}"
  button-panel:
    backgroundColor: "{colors.panel-raised}"
    textColor: "{colors.paper}"
    rounded: "{rounded.xl}"
    height: "2.875rem"
    padding: "0 1.25rem"
  button-quiet:
    backgroundColor: "{colors.panel-raised}"
    textColor: "{colors.foil}"
    rounded: "{rounded.xl}"
    height: "2.875rem"
    padding: "0 1.25rem"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    rounded: "{rounded.xl}"
    height: "2.875rem"
    padding: "0 1.25rem"
  button-disabled:
    backgroundColor: "transparent"
    textColor: "{colors.paper-muted}"
    rounded: "{rounded.xl}"
  insert:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: "1.25rem"
  input-text:
    backgroundColor: "{colors.panel-edge}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    height: "3rem"
    padding: "0 0.75rem"
  card-back:
    backgroundColor: "{colors.lid}"
    textColor: "{colors.foil}"
    rounded: "{rounded.2xl}"
    width: "18.5rem"
  card-face-civilian:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.paper}"
    rounded: "{rounded.2xl}"
  card-face-spy:
    backgroundColor: "{colors.ember}"
    textColor: "{colors.lid-deep}"
    rounded: "{rounded.2xl}"
  chip-player:
    backgroundColor: "{colors.panel-raised}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    height: "2.75rem"
    padding: "0 0.25rem 0 0.75rem"
---

# Design System: Spy

## Overview

**Creative North Star: "The Parlour After Dark"**

The wallpaper is the world; the box is what is open on the table in front of it.
Spy is played on one phone passed around a room after dinner, and the screen is dressed as that room: a photographed aubergine sheet carrying a brass vine of blossoms and tulips, lit warmly and falling off toward the edges, with a deluxe board-game box printed on top of it.
The lid of that box is home, discussion and the end of the round.
The punchboard inside it is where the setup and the reveal happen.

Nothing on screen is a rectangle with a fill.
Every interactive surface is a piece die-cut from board — it has thickness, it casts a shadow down and to the right, and it sinks into the sheet when pressed — or it is the dashed die line marking a piece that was never punched out.
Depth is not decoration here; it is the entire grammar of what can be touched.

The world is committed to a single dark setting.
There is no light theme and no `prefers-color-scheme` block: a lit version of this would be a different product, not a different setting.
The anti-reference is the flat dark app — a near-black ground with a saturated accent and floating rounded rectangles — which is precisely what the box, the foil and the weave exist to refuse.

**Key Characteristics:**

- One photographed sheet under two washes carries every screen; there is no second background.
- Brass hot foil is the only primary action colour, and the only accent mass.
- Board thickness (4px) and a real light direction, never a centred glow.
- Display type is stamped twice, five pixels out of register, the way a foil press lands.
- Ember appears as a surface exactly once in the whole app: the spy's card.

## Colors

Three aubergine-to-plum stocks in a narrow value band, lifted by one warm metal and one hot signal colour.
That band is deliberately tight — it is the inside of a box, not a set of app surfaces — and legibility is bought with paper-toned text rather than with more contrast between grounds.

### Primary

- **Brass Foil** (`{colors.foil}`): the single accent mass. Every primary action, every live count, the clock digits, the countdown ring, the focus ring, the die-cut rings on the tokens, and the second impression under a display title. Nothing else in the world is this warm.
- **Unlit Brass** (`{colors.foil-dim}`): the scored outline of a ghost piece, where a full foil face would out-shout the primary action beside it.
- **Brass Die Edge** (`{colors.foil-edge}`): the 4px bottom edge under a foil piece — the thickness of the board it was cut from.

### Secondary

- **Ember** (`{colors.ember}`): the spy card's face, and nothing else as a surface anywhere in the app. Seeing it is the reveal.
- **Lit Ember** (`{colors.ember-lit}`): error ink and the text caret. The one place the eye is meant to be pulled to a problem.
- **Ember Die Edge** (`{colors.ember-edge}`): reserved for an ember piece's thickness.

### Tertiary

- **Punched Violet** (`{colors.token}`): the stock a token is punched out of — the disc beside an included topic, the roster scrollbar thumb.
- **Violet Die Edge** (`{colors.token-edge}`): its cut edge.

### Neutral

- **Lid Aubergine** (`{colors.lid}`) and **Deep Lid** (`{colors.lid-deep}`): the cover of the box. Lid is the ground for home, discussion and ended; deep lid is the ink that sits on brass and the stock behind a die-cut token.
- **Punchboard** (`{colors.board}`) and **Board Edge** (`{colors.board-edge}`): the inside of the box. Board grounds topics, players and the reveal; board edge is what shows past the printed sheet on a window wider than a phone, and the shadow line above a sunk rack.
- **Insert Plum** (`{colors.panel}`), **Raised Insert** (`{colors.panel-raised}`), **Sunk Insert** (`{colors.panel-sunk}`), **Insert Edge** (`{colors.panel-edge}`): the printed insert lifted off the punchboard, the pieces punched from it, the recess they sit in, and their thickness.
- **Paper** (`{colors.paper}`), **Muted Paper** (`{colors.paper-muted}`), **Dim Paper** (`{colors.paper-dim}`): everything printed on the stock. Paper is body and display text; muted paper is secondary text and the label on a piece that was never punched out; dim paper is a placeholder, or that same unpunched label when it sits on the lighter insert rather than on the board.

### Named Rules

**The One Metal Rule.**
Brass is the only primary action colour and the only accent mass.
If a screen has two brass pieces, one of them is wrong.

**The Ember Reserve Rule.**
Ember is a surface exactly once in the app — the spy's card — and ink everywhere else it appears.
Using it for a button, a badge, or a highlight spends the reveal.

**The Contextual Die Line Rule.**
An unpunched piece reads `--cut` and `--muted` from the surface it sits on, never from itself.
On the lid and the board that pair is brass-at-half and muted paper; on the lifted insert it is paper-at-45%-and dim paper.
A piece that hardcodes its own disabled colours will be wrong on one of the two.

## Typography

**Display Font:** Rammetto One (self-hosted; falls through to Rubik Variable, then system-ui)
**Body Font:** Rubik Variable, 300–900 (self-hosted; falls through to system-ui)

**Character:** Rammetto is a single-weight, fat, slightly rounded slab-ish sans — a printed box lid's lettering rather than a UI face.
Rubik carries every word the player actually reads, at 400 through 800, and its wide apertures survive a dim room and a phone held at arm's length.
Neither is loaded from a font CDN: the app must work offline after first load and from `file://` inside the planned native shell.

### Hierarchy

- **Display** (800, `{typography.display.fontSize}` on home, 3.75rem on ended, line-height 1.05): the wordmark and "Time's up", both stamped twice — see the Second Impression rule.
- **Headline** (800, `{typography.headline.fontSize}`): a screen's own title on the insert, the name on a card's plate, and the word or hint on a revealed face (2.125rem).
- **Title** (700, `{typography.title.fontSize}`): the label on a die-cut piece. The `md` piece drops to 600 at 1.0625rem.
- **Body** (400, `{typography.body.fontSize}`, line-height 1.45): subtitles, hints, the roster's empty state. Measures are capped at `17.5rem` / `18.25rem` with `text-wrap: balance`, because every one of these is one or two lines, not a paragraph.
- **Label** (600, `{typography.label.fontSize}`, uppercase): printed labels — `INCLUDED`, `PLAYERS`, `TIME LEFT`, `PLAYER 3 OF 6`, and a card's `YOUR WORD` / `YOU ARE THE SPY`. Tracking runs from 0.13em on the progress line to 0.18em inside the clock.

Numerals in any live count — the clock, `3 / 5`, `6 / 12`, the spy stepper — are set in the display face, in brass, with `font-variant-numeric: tabular-nums`, so nothing jitters between seconds or between players.
Counts written as `n / m` carry `word-spacing: 0.16em` so the slash reads as print rather than as a fraction.

### Named Rules

**The Second Impression Rule.**
A display title on the lid is stamped a second time in brass, offset 5px down and right, drawn from `data-text` on a `::before` behind the live text.
The visible string stays one text node, so selection and screen readers are unaffected.
This is the wordmark treatment; it does not apply to insert titles.

**The One-Weight Display Rule.**
Display type asks for weight 800 with `font-synthesis: none`.
Rammetto ships a single 400 and renders it unchanged; Cyrillic, which Rammetto does not cover, falls through to Rubik's variable axis at 800.
Neither face is ever faux-bolded.
Known gap: the Russian locale therefore does not get the display face at all.
Sourcing or commissioning a Cyrillic-covering display face is open work.

## Layout

One column, designed at 360px portrait and capped at `24.5rem`, centred on anything wider.
The printed sheet is full-bleed behind it at `background-size: cover`; the column never stretches the artwork.

Every phase renders into the same shell, so nothing shifts when the state machine advances: safe-area padding (`1.5rem` top, `1.75rem` bottom, plus `env(safe-area-inset-*)`), a `1rem` gutter, or `1.5rem` on the screens whose content is not held in an insert (home, reveal, discussion, ended).

The column is pinned to `100dvh` rather than allowed to grow past it.
A roster too long for the screen scrolls inside its own rack, so the action at the thumb is never pushed below the fold; if even the minimum layout will not fit — a very short window — the column itself scrolls rather than clipping.

The vertical grammar is always the same three bands: a fixed header (a title, or the uppercase progress line), a `flex: 1` middle, and a stacked action block at the thumb.
The primary action is the bottom-most full-width piece at `3.75rem`; anything secondary sits under it at `2.875rem`.

Spacing runs on a 4px scale (`{spacing.1}` through `{spacing.8}`).
Text that swaps in place — the reveal hint, the setup error line, the roster hint — carries a reserved `1.125rem` so nothing under it moves.

### Named Rules

**The Thumb Rule.**
Every screen's primary action is the last element in the column, full width, at `3.75rem`.
Nothing is ever placed below it.

## Elevation & Depth

Depth here is physical, not atmospheric.
The world is lit from the upper left, so every shadow carries a real offset down and to the right; a centred, zero-offset glow belongs to a different system.
Pieces have board thickness rendered as a `border-bottom` in the stock's own darker tone, and pressing one translates it 2px down while the edge collapses from 4px to 2px — the piece sinks into the sheet rather than scaling.

Above all of it, one radial vignette sits at `z-index: 3` over every screen, so the frame reads as an object with light falling off its corners rather than as a page.
Under all of it, the printed sheet sits at `z-index: -1` inside the surface, beneath every piece printed on it.

### Shadow Vocabulary

- **Piece** (`box-shadow: 2px 6px 13px rgb(0 0 0 / 55%)`): a punched piece lying on the sheet.
- **Piece pressed** (`box-shadow: 1px 3px 7px rgb(0 0 0 / 45%)`): the same piece, sunk. Also the resting shadow of a small tile or stepper punch.
- **Insert** (`box-shadow: 2px 7px 18px rgb(0 0 0 / 55%)`): the printed insert lifted off the punchboard.
- **Panel** (`box-shadow: 3px 10px 22px rgb(0 0 0 / 62%)`): the handoff panel, the heaviest printed piece in the app.
- **Token** (`box-shadow: 3px 12px 24px rgb(0 0 0 / 62%)`): under the clock token's board edge.
- **Mark / peek / card / punch** (`drop-shadow(…)`): four `filter` shadows for the things with a real silhouette — the box-art token, the leaning spy, the card, and a punched disc — because a box-shadow would trace their bounding box instead of their edge.

### Named Rules

**The Punched-Or-Not Rule.**
An interactive surface is either a piece punched from the board — 4px bottom edge, offset shadow, sinks 2px when pressed — or the dashed die line it would have been cut along.
There is no third state, and "disabled" is always the second one.

**The Light Direction Rule.**
Every shadow in the system offsets down and to the right.
A shadow with no offset is decoration and does not ship.

## Motion

Motion in this world is a pair of hands over a table, not a screen animating itself.
Two gestures carry all of it.

**A phase is a card dealt onto the pile.**
It comes up from below into its place over `420ms` on `cubic-bezier(0.16, 1, 0.3, 1)`, and the phase it replaces is lifted off over the top in `220ms` on a curve that accelerates away.
The printed sheet under both never moves: `Screen`'s content column carries its own `view-transition-name`, which lifts it out of the root snapshot, so the two washes cross-fade in place while only the columns travel.
The room stays still and what is on the table changes.

**Everything else is one piece settling.**
A mark rises `12px` into its place; the spy on home rises `26px` into the die-cut hole from behind its rim, clipped by the same circle the die cut; a punched token arrives at `0.86` scale rather than growing from nothing; the second foil impression comes down onto the first and lands `5px` out of register.
Each is a single gesture on a single element, between `240ms` and `560ms`, and each stops dead rather than easing out into nothing.

Press feedback is unchanged and is not part of this: a piece sinks `2px` in `120ms`, and the card's flip is still the player's own `550ms` turn.

### Named Rules

**The One Gesture Rule.**
A screen animates its subject and nothing else — the token on home, the panel and the spy on the handoff, the clock on discussion.
Buttons, titles and body copy arrive with the column they are printed on. A screen where every element has its own entrance is a screen with no subject.

**The Ground Does Not Move Rule.**
The wallpaper, the wash and the vignette are the room.
They cross-fade between phases and are never translated, scaled or parallaxed.

**The Gesture Token Rule.**
An animation is written as `animation: var(--animation-*)`, never as a bare keyframe name.
CSS Modules rewrites an animation name it finds in a module file to a scoped one, and the keyframes are global; a bare name silently resolves to nothing and the animation simply does not run.

**Reduced motion keeps the gesture and drops the travel.**
`prefers-reduced-motion` zeroes every distance token and shortens the arrivals; what is left is the cross-fade, so a state change is still legible.
It does not disable animation wholesale.

## Shapes

Radii are small and consistent with die-cut board: `{rounded.xs}` on a foil rule, `{rounded.sm}` on a name tile, `{rounded.md}` on the insert and the text field, `{rounded.lg}` on a topic row, `{rounded.xl}` on a piece, `{rounded.2xl}` on the card.
Nothing is a pill, and nothing is square.

The circle is reserved for things punched with a round die: the topic markers, the spy stepper's two buttons, the clock token, and the box-art token on home.
A circle in this world always means "punched out", which is why an excluded topic is a dashed circle and an included one is a filled disc with a brass ring and a pip.

Borders carry meaning rather than separation.
A solid 2px border is a scored line in the sheet (an excluded topic, a ghost piece); a dashed 2px border is a die line around a piece that was never punched out; a 3px brass border is a printed rule (the card's inner trim, the name plate).
There are no hairline dividers anywhere — where a rule is needed, it is a 2px `border-top` in the sunk insert tone.

## Components

### Buttons

Buttons are pieces, not surfaces. They are confident and physical: full width, heavy label, real thickness.

- **Shape:** die-cut corners (`{rounded.xl}`), 4px bottom edge in the face's own darker tone.
- **Primary** (`button-primary`): brass foil face, deep-lid ink label, 700 weight at 1.25rem, `3.75rem` tall at the thumb. One per screen.
- **Panel** (`button-panel`): raised-insert face, paper label. The second action on a lid screen — "End round", "Exit".
- **Quiet** (`button-quiet`): the same face with a foil label. For an action that must be reachable without claiming the screen — the roster's "Add".
- **Ghost** (`button-ghost`): no face at all, a 2px unlit-brass scored line, paper label, no shadow. "Back", on the setup screens.
- **Press:** `translateY(2px)`, edge collapses to 2px, shadow drops to `piece-pressed`, over 120ms `ease-out`.
- **Focus:** 3px brass outline at 3px offset, the same ring everywhere in the app.
- **Disabled** (`button-disabled`): the face, the thickness and the shadow are all removed and replaced by a 2px dashed die line in the surface's `--cut`, with the label in its `--muted`. It is not a dimmed button; it is a piece still attached to the sheet.

### Chips

- **Style** (`chip-player`): a roster name tile — raised-insert face, 4px bottom edge, `{rounded.sm}`, `2.75rem` tall, the name at 600/1rem, and a 2rem remove punch to its right.
- **State:** the remove control is muted paper at rest and lit ember on hover. Names longer than the tile ellipsize; the tile never wraps.

### Cards / Containers

- **Insert** (`insert`): the printed card of insert plum the setup screens are held in — `{rounded.md}`, a 3px bottom edge, `insert` shadow, `1.25rem` padding. It re-declares `--cut` and `--muted` for every piece punched from it.
- **Rack:** the roster's recess — sunk insert tone, a 3px board-edge `border-top` (a shadow line, not a border), `{rounded.md}`, its own scrollbar themed brass-violet on board edge.
- **Handoff panel:** insert plum, `{rounded.lg}`, `panel` shadow, with the spy leaning on its top-left edge from outside the box.

### Inputs / Fields

- **Style** (`input-text`): insert-edge ground — darker than the insert it sits in, so the field reads as recessed — with a 2px paper-at-45% border, `{rounded.md}`, `3rem` tall, 500 weight at 1rem.
- **Caret:** lit ember. The one browser surface that is deliberately not brass, because it marks where the player is typing rather than what they can press.
- **Placeholder:** dim paper at 400.
- **Focus:** the standard 3px brass ring.
- **Error:** the message prints in lit ember on a reserved `1.125rem` line below the field; the field itself is not restyled.

### The Card

The signature object. A `18.5rem` card at 296:408, flipped once by rotating an inner element 180° over 550ms on `cubic-bezier(.2,.85,.25,1)`, with `backface-visibility: hidden` on both faces so neither is ever composited over the other.

- **Back:** lid stock behind the box's own lozenge repeat (a 40px SVG tile — a brass diamond with a foil pip in each corner), a 9px lid-coloured trim, a 2px inset foil rule, and a foil-ruled plate carrying the player's name in display type. The name steps down through three display sizes rather than breaking mid-word.
- **Civilian face:** insert plum, a 3px brass rule inset 9px, the uppercase label in muted paper, the word in display type.
- **Spy face:** ember, and the same rule in deep-lid ink. Every mark on it — label, hint, rule — is ink, never paper.
- The flip runs once and does not reverse; the state machine, not the card, decides when the next one is dealt.

### The Clock Token

The other signature object, and the only component that re-renders per tick.
A `15.25rem` disc: an insert-edge board edge translated 6px down and shadowed, an insert-plum face carrying the uppercase label and the brass digits, and a 7px brass ring stroked around the rim.
The ring is a full circle at the start of the round; the gap opens at twelve o'clock and grows clockwise as the round burns down, gliding one second at a time (`stroke-dashoffset`, negative, `1s linear`).

## Do's and Don'ts

### Do:

- **Do** draw every interactive surface as a punched piece or a die line — the Punched-Or-Not Rule. A new control inherits its thickness, its press and its disabled treatment from `Button`, not from scratch.
- **Do** put every colour, size, radius, shadow and duration in `src/styles/tokens.css`. Component CSS contains no hex value, no font stack and no bare pixel value. The two exceptions are `public/favicon.svg` and `src/assets/card-back.svg`, which are standalone assets and cannot read the page's custom properties.
- **Do** let an unpunched piece read `--cut` and `--muted` from its surface, so it is correct on the lid, on the board and on the insert.
- **Do** theme the browser's own surfaces: text selection (brass on ink), the caret (lit ember), the roster scrollbar, and the focus ring. A default outline is a visible failure in this world.
- **Do** reserve height for any text that swaps in place, at `1.125rem`, so nothing under it moves.
- **Do** set every live count in the display face, in brass, with tabular numerals.
- **Do** self-host any new face and scope it with `unicode-range`. Nothing is fetched from a font CDN.

### Don't:

- **Don't** add a light theme or a `prefers-color-scheme` block. The world is one committed dark setting, and `color-scheme: dark` is declared once on `:root`.
- **Don't** use ember as a surface anywhere but the spy's card, or brass for anything but the single primary action and the accent marks listed under Colors.
- **Don't** ship a shadow without an offset, or a glow instead of a shadow.
- **Don't** put two brass pieces on one screen.
- **Don't** tile the wallpaper. It is a photograph, laid down once at `cover`; tiling it produces a seam the drawn version was built to avoid.
- **Don't** introduce a hairline divider, a pill radius, or a card-of-icon-plus-heading-plus-text grid. Structure comes from the insert, the rack and the pieces.
- **Don't** apply the Second Impression treatment to anything but a lid wordmark.
- **Don't** put an XML comment containing `--` inside an SVG asset; it makes the file invalid XML and a strict parser drops the whole tile with no error.
