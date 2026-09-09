# v6 - Night Lid

## Thesis

This is v2's box, in the deluxe edition, in the room the game is actually played in.
The lid is aubergine board instead of matte teal, hot-foil stamped in brass instead of printed in tomato and mustard, and linen-embossed instead of left plain - but it is the same object, with the same die-cut pieces, the same 4 px of visible board thickness, the same type, and the same seven layouts.
The remix is a material swap, not a new idea: v2 asked what a board-game box feels like on a table at noon, and v6 asks what the collector's printing of it looks like at eleven at night with the lights down.
The one thing v6 adds that v2 has no equivalent for is the box art - the spy, punched out as a token - and the clock's foil ring burning down.

## Palette

Lid aubergine `#241238` is the ground of Home, Discussion and Ended - the outside of the box.
Near-black plum `#150c22` is the ground of Topics, Players, Handoff and Card - the punchboard and the table it sits on - and `#0a0512` is its cut edge.
Violet-plum `#33204d` is the printed insert lifted off that board, `#3e2a5c` is a piece lifted off the insert, `#1d1230` is every piece's bottom edge, and `#241636` is a recess sunk into the insert (the roster rack, the printed rules).
Brass foil `#e8b34a` is the only accent mass in the build: the one primary piece per screen, the second impression behind the two display titles, the rule under them, every live count and clock digit, the ring around the clock, the card back's print, and the focus ring on every ground.
Its cut edge is `#a97a20` and `#b98d33` is the outline of a thin printed piece.
Deep plum `#1a0d29` is the ink brass is stamped with, at 9.7:1 on the foil.
Ember `#e0503c` is held back for exactly three jobs - the spy's card face, the spy's hatband, and the caret - with `#ff7d69` as the error ink at 6.0:1 on the insert.
Violet `#6b46a8` is the stock a punched topic token is cut from.
Text is `#f2eaf7` at 12.3:1 on the insert and 14.8:1 on the lid, `#c3aed8` for secondary at 7.1:1 and 8.5:1, and `#a08bb8` for the placeholder and for a piece that was never punched, at 4.7:1.
No colour is used outside this list.

## Type

Unchanged from v2, because the brief pins it.
Rammetto One, the display face, does exactly three jobs the box would print large - the screen titles, the secret word, and the clock - and also carries the live counts ("3 / 5", "6 / 12", the spy value), which read as printed numerals rather than as UI text.
Rubik carries everything else: 800 at 30 px for the handoff line, 700 at 20 px for piece labels, 600 at 15-17 px for topic and roster names, 400 at 14-20 px for body and hints, and 600 at 12-13 px with 0.14em tracking for the uppercase printed labels.
Both faces have real fallback stacks, and the clock and counts are set with tabular numerals so digits do not jitter as time runs down.
"Spy" is set at 112 px and "Time's up" at 60 px, each with a second impression in brass offset 5 px down and right, drawn as a real second text layer - foil misregistered against the white ink, not a blurred shadow.

## Materials

Every ground carries three layers instead of v2's one.
A die-cut token motif repeats at 84 px in brass at 11.5% on the lid and 7.5% on the board, and a linen weave repeats at 8 px in brass at 3.8% and 3.2%.
Both sit at `z-index: -1` inside the screen, so they are printed into the box stock and every piece placed on it covers them.
There is no grain layer over the frame: a turbulence tile was tried across the whole phone and read as sensor noise on a dark ground rather than as paper, so the surface is left clean and the weave carries the texture on its own.
A vignette closes the frame: light falls off from 28% down the screen to the corners, which is how a box lid actually photographs.
The insert is a separate sheet lifted off the board with a 3 px bottom edge and an offset shadow, filling the frame from the safe-area top to just above the action block.
The card back is a brass diamond-and-corner-dot repeat on lid aubergine, framed by a 2 px brass hairline inside a 9 px aubergine margin, with a brass-ruled plate in the middle bearing the player's name.
Every shadow carries a real offset and blur and is neutral, not tinted.

## Controls and states

A piece is a rounded rectangle with a 4 px darker bottom edge that reads as board thickness, plus an offset shadow; pressing it moves the top down 2 px and shrinks the edge to 2 px, so it sinks into the table.
Disabled means the piece was never punched: fill and thickness vanish and a 2 px dashed die-cut line stays in the sheet, with muted-but-legible text.
The secondary "Back" is distinguished from that by a solid 2 px brass-dim outline - a thin printed piece, not an uncut one.
Topics are punch tokens drawn as SVG: excluded shows the dashed cut line still in the sheet; included is a violet disc with a brass printed ring and centre dot, punched out, raised, carrying its own shadow.
When only one topic is left included, that row stays punched and raised but is disabled and drops its press response, so the state stays honest instead of pretending to be excluded.
Roster entries are name tiles in a recess cut into the insert, sized to hold the full twelve that "6 / 12" claims.
The stepper is a `role="group"` labelled "Spies" with two 44 px round die-cut buttons, each disabling at its bound.
Focus is a 3 px brass ring at 3 px offset on every ground; selection is brass on plum ink; the caret is ember; the rack's scrollbar is violet on the board's cut edge.

## The box art

Home carries a 208 px die-cut token: a shoulders-up bust in a fedora, cropped by the punch circle, drawn as flat board shapes outlined in brass.
The face is in shadow under the brim and gives up nothing but two brass eye-slivers; the hatband is the one place ember appears outside the spy's own card.
A brass ring printed at 90% of the token's radius sits behind the figure, the same ring the topic tokens carry and the same ring the clock burns down - one motif at three scales.
The handoff mark reuses the token small, next to a card and an ember arrow: card, to spy, to the next pair of hands.

## Signature interaction

The clock's foil ring.
The token is a 220 px violet-plum disc with 6 px of board thickness showing beneath it, and the ring is stroked into its face 5 px inside the rim.
It is a full circle at 5:00; the gap opens at twelve o'clock and grows clockwise as the round burns down, gliding between seconds on a one-second linear transition so it never appears to tick.
The card flip is inherited from v2 unchanged: 550 ms of exponential ease-out on a `preserve-3d` wrapper, and it stays turned, because a revealed card cannot be un-revealed.
Under `prefers-reduced-motion` the flip collapses to an instant state change and the ring stops gliding; both still change state.

## Honest risk

Three purples separated by small value steps is a narrow band to build legibility in, and the insert only reads as lifted off the board because of its shadow and its bottom edge - on a phone in bright sunlight that separation will be the first thing to go.
Ember is used so sparingly that the spy card arrives as the loudest thing in the whole build, which is right on the reveal and could be read as a tell by anyone watching the holder's screen from across the table - the same hazard v2's mustard card carries, made worse by a stronger colour.
The brass is doing a lot of jobs at once: primary action, foil title, every numeral, the clock ring, and the card back print.
That is one coherent material rather than five accents, but it also means the Topics screen has a brass "Continue" competing with a brass "3 / 5" and three brass token rings, and there is no second accent left to break a tie with.
Rammetto One is a single-weight display face with wide letterforms, so any locale with longer strings than English - Russian ships today - needs the title sizes checked, and "Hot-air balloon" is already close to the card's usable width at 34 px.
Finally, this is a remix by construction: it inherits v2's honest risk that the kraft-and-heavy-display-face box is familiar territory, and trades it for a different familiarity, since dark purple with gold is where "premium edition" lives for every publisher.
