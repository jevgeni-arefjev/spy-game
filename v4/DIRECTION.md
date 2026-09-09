# v4 - Sleeve

## Thesis

Every screen is a record sleeve: one enormous condensed word shouts through immaculate information noise.
The word that matters - SPY, TOPICS, PLAYERS, PRIYA, HOT-AIR BALLOON, 03:47, TIME'S UP - is measured to the full column width and never gives that width up; when something else needs room, the something else moves.
The noise around it is not decoration pretending to be data: every mark on the page is a fact the app actually holds, so the product code, the barcode and the pip strip change when the roster, the spy count or the topic selection change.
It refuses the noir dossier and it refuses the friendly rounded app.
A regular reads it as a club flyer for tonight; a first-timer reads the one huge word and the one magenta plate and knows what to do.

## Palette (hex)

Ground `#000000`, absolute, flat, no gradient anywhere.
Ink `#ffffff` for the shouting word, roster names and plate hairlines.
Magenta `#ff2d95` carries the primary action, the registration marks, the roundels, all live counts and the Cyrillic edge line.
Safety orange `#ff5a00` is reserved for two jobs only: the hazard diagonals and the keyboard focus ring, so orange always means "blocked or being aimed at".
Secondary ink is white at 72% (`rgba(255,255,255,.72)`) and placeholders at 60%, both above 7:1 on black; hairlines run at 42% and 24%, and the target grid is magenta at 13% with its crosses at 34%.
There is no gray in the palette - everything dim is white or magenta held back.

## Type

Sofia Sans Extra Condensed 900 is the shouting face, uppercase, tracking `-0.012em`, line-height `0.76`.
It is never set at a chosen size: a fit routine measures the glyph run and sets the size so the line fills the column exactly, which is why SPY lands near 240px and PLAYERS near 100px on the same 320px column.
Multi-line shouts fit per line, so TIME'S and UP each fill the width and land at different sizes on purpose.
Sofia Sans 600/700 in caps at 10-14px with 0.12em to 0.24em tracking does every other job: the product code, subtitles, labels, hints, errors, roster names and plate labels.
The clock and every count run tabular figures so digits do not shuffle as they tick.
Fallbacks are Archivo Narrow / Roboto Condensed / Arial Narrow for the condensed face and Inter / Helvetica Neue / Arial for the text face.

## Materials

Flat print only: no gradients, no shadows, no blur, no rounded corners, no border radius above zero anywhere in the file.
The noise layer is inline SVG - a 30px magenta hairline target grid with a cross every 90px, and four corner registration marks (crosshair in a circle) locked 6px into each corner.
The product-code strip reads `ROUND 01 · PLAYERS 06 · SPIES 01 · TOPICS 03/05` and rewrites itself whenever a name is added or removed, a spy is stepped, or a topic is toggled.
The barcode is drawn as rects from the roster itself: six bars per player, grouped, widths derived from the letters of the name, so adding Jonas visibly lengthens it.
Hazard diagonals appear twice - as one 5px structural strip under the code line on every frame, and as the disabled treatment, held at 34% orange over black so a blocked control recedes instead of shouting.
The second-language ornament is the shipped Russian locale, set vertically on the right edge: ШПИОН, ТЕМЫ, ИГРОКИ, ОБСУЖДЕНИЕ, ВРЕМЯ ВЫШЛО, taken verbatim from `src/i18n/locales/ru/common.json` and never invented.

## Controls and states

Controls are stamped plates, all rectangles, all hairline or solid.
The primary action is a solid magenta plate with black caps, 60px tall, full width, in the bottom third under the thumb.
Secondary is a white hairline plate at 46-52px; press inverts either plate - the magenta one flips to black on magenta, the hairline one flips to solid white on black.
Topic toggles carry `aria-pressed`; included gains a magenta registration roundel at the left, a magenta edge and a filled magenta square at the right, excluded drops to a hollow ring and a hairline square.
The last included topic is disabled so it cannot be excluded, and it takes the hazard mark on its square.
Disabled plates and the stepper at its bound take the hazard hatch with the label sitting on its own black patch so it stays legible.
The spy stepper is a `role="group"` labelled Spies, with drawn SVG minus and plus glyphs, clamped to 1 through the roster length.
Focus is a 2px orange ring at 2px offset, selection is black on magenta, the caret is magenta and the roster scrollbar is a 4px magenta thumb on black - no browser default survives.
Empty, error and hint lines all hold reserved height, so nothing under them shifts when the state changes.

## Signature interaction

The face-down card is a black sleeve with a white hairline edge, a barcode along the bottom, a registration target at its centre and the player's name stamped in the code slot with `03/06` beside it.
Tapping it slides an inner sleeve up from behind the outer one - `translateY(100%)` to `0` over 460ms on an exponential ease-out - with a 2px magenta edge leading it, and the word shouts as it lands.
That slide is the only continuous motion in the build; `prefers-reduced-motion` collapses it to an instant swap and the state change still happens.
The card never flips back: once revealed, Got it enables, the hint line swaps to "Keep it to yourself.", and the return to face-down happens only after the button is pressed.

## Honest risk

Sentence copy is set in caps, which is the world's rule and is the single thing most likely to slow a first-timer down; tracking, 12px size and a 1.5 line-height are what keep it readable, and a real test with a cold group would be the place to find out if that is enough.
The density is deliberately hostile - a grid, four registration marks, a code strip, a hazard rule and a Cyrillic edge line on every frame - and only the one-word discipline and the single magenta plate keep the screen navigable.
The shouting word is sized by a measure-and-fit script, so with JavaScript off the display type falls back to unfitted sizes; everything else still renders.
The disabled hazard hatch is still a loud object on a black screen, and on the Card frame the blocked Got it competes harder for attention than a disabled control ideally should.
Fitting each line independently means two-line shouts land at different sizes, which is right for TIME'S UP and would look wrong for a word that ever needed three lines.
