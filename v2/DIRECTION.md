# v2 - Box Lid

## Thesis

The app is the board-game box that is already on the table, not an interface about a board game.
Every surface is a real material from that box: the matte teal lid, the kraft punchboard sheet, the cream printed insert that sits in the tray, and the deck of cards.
Every control is a die-cut piece with 4 px of visible cardboard thickness that sinks when you press it, so the screen behaves the way the object would.
This refuses both the flat pastel party app and the dark spy-noir thriller, and it commits fully rather than gesturing at the idea: there are no gradients anywhere except a low-opacity paper fibre, and no effect that a print run could not produce.
A first-timer already knows how to hold this; a regular sees a box worth bringing out again.

## Palette

Lid teal `#0e5e5c` is the ground of Home, Discussion and Ended - the outside of the box.
Its darker cut edge is `#073635`, and pale teal `#bcd8d2` / `#b3d0cb` carry secondary and disabled text on that ground at 5.0:1 and 4.6:1.
Kraft cardboard `#c9a97e` is the ground of Topics, Players, Handoff and Card - the punchboard and the table.
Kraft's cut edge is `#a8875c`.
Cream `#f4ead6` is the printed insert and the card stock, with `#fdf6e6` for pieces lifted off it, `#d9c39a` for their bottom edge, and `#e7dbc0` for the sheet's printed rules.
Tomato `#d9432f` is the one primary piece per screen and the spot-varnish offset behind the title; its edge is `#a72d1d` and its darker ink `#a92d1c` carries error text on cream at 5.7:1.
Mustard `#e8b62c` is the spy card face, the short rule under the two display titles, and the focus ring on teal grounds; its edge is `#b98a12`.
Ink `#2a2018` is body text on light grounds at 13:1, `#4a3826` is secondary text (5.0:1 on kraft, 9.4:1 on cream), `#7a6248` is disabled text on cream and the input placeholder, and `#4f3b27` is disabled text on kraft.
No colour is used outside this list, and no gradient appears anywhere.

## Type

Rammetto One, the display face, is reserved for exactly three jobs the box would print large: the screen titles, the secret word, and the clock.
It also carries the live counts ("3 / 5", "6 / 12", the spy value), which read as printed numerals on the sheet rather than as UI text.
Rubik carries everything else: 800 at 30 px for the handoff line, 700 at 20 px for piece labels, 600 at 15-17 px for topic and roster names, 400 at 14-20 px for body and hints, and 600 at 12-13 px with 0.14em tracking for the uppercase printed labels ("INCLUDED", "PLAYERS", "PLAYER 3 OF 6", "TIME LEFT", "YOUR WORD").
Both faces have real fallback stacks and the clock and counts are set with tabular numerals so digits do not jitter as time runs down.
"Spy" is set at 112 px and "Time's up" at 60 px, each with a second impression in tomato offset 5 px down and right - a misregistered spot varnish, drawn as a real second text layer, not a blurred shadow.

## Materials

The kraft and teal grounds carry a single fine paper fibre: one inline SVG feTurbulence tile, desaturated, multiplied at 9% opacity across the whole frame.
The lid also carries a faint repeat of the die-cut token motif at 7.5% - the punch pattern printed into the box art.
The cream insert is a separate sheet lifted off the kraft with a 3 px bottom edge and an offset drop shadow; it fills the frame from the safe-area top to just above the action block, so the setup screens read as a tray with an insert in it.
The card back is an inline SVG repeat - teal diamonds and corner dots on cream, centred so it bleeds under a 9 px cream margin - with a teal-ruled plate printed in the middle bearing the player's name.
Every drop shadow carries a real offset and blur and is neutral rather than tinted; nothing in the build uses a zero-offset halo.

## Controls and states

A piece is a rounded rectangle with a 4 px darker bottom edge that reads as board thickness, plus an offset drop shadow.
Pressing it translates the piece 2 px down and shrinks the edge to 2 px, so the top moves and the bottom stays put - it sinks into the table.
Disabled means the piece was never punched: the fill and thickness disappear and a 2 px dashed die-cut outline remains in the sheet, with muted-but-legible text (4.6:1 on kraft, 4.8:1 on cream).
The secondary "Back" piece is distinguished from that by a solid 2 px outline rather than a dashed one - a thin printed piece, not an uncut one.
Topics are punch tokens drawn as SVG: excluded shows the dashed cut line still in the sheet, included shows a solid teal disc with a cream printed ring, punched out, raised, and carrying its own offset shadow.
When only one topic is left included, that row stays punched and raised but is disabled and drops its press response, so the state stays honest instead of pretending to be excluded.
Roster entries are name tiles in a kraft rack, each a cream piece with a 4 px edge and a 32 x 44 px remove control; the rack is sized to hold the full twelve, which is what "6 / 12" claims.
The stepper is a `role="group"` labelled "Spies" with two 44 px round die-cut buttons, and each disables at its bound.
Focus rings are drawn from the palette and switch per surface: mustard on teal, near-black ink on kraft and cream, at 3 px with a 3 px offset.
Selection is mustard on ink, and the name field's caret is tomato.

## Signature interaction

The card flip.
The face-down card is a real printed card back at 296 x 408 px; tapping rotates it on a `preserve-3d` wrapper through 550 ms of an exponential ease-out, and it stays turned - a second tap does nothing, because a revealed card cannot be un-revealed.
The civilian face is cream with a teal printed rule and the word in Rammetto One; the spy face is mustard with an ink rule and the hint in the same face, so the two roles are told apart by material before a single word is read.
Under `prefers-reduced-motion` the rotation collapses to an instant state change and the card still turns.
Switching the demo role always returns the card face-down first, so no role is ever swapped in place.

## Honest risk

This is the most familiar of the five directions, and the direction contract says so.
Codenames, Ticket to Ride and every modern euro box already live in kraft, teal and a heavy display face, so the world is legible in one glance but not surprising - and a group that owns those games may read this as an imitation of their shelf rather than as its own thing.
The two long-copy screens (Topics, Players) put a lot of cream in the frame, and the insert filling the frame means the kraft ground is only visible as a margin on those two screens, which slightly weakens the "box with a tray in it" reading.
Rammetto One is a single-weight display face with wide letterforms, so any locale with longer strings than English - Russian ships today - will need the title sizes checked, and "Hot-air balloon" is already close to the card's usable width at 34 px.
