# v1 - Passed Note

## Thesis

The secret is a note passed under the table, and the app is the exercise book it was torn from.
Every word a player reads or writes is pencil or ballpoint on ruled paper; the only printed matter is the small stationery labels the book came with.
Nothing is a card, panel, or container except the one folded note that carries the secret - whitespace and scale do all the structuring instead.
This refuses both of the category's ruts at once: there is no noir dossier with stamps and redaction, and no pastel party app with confetti and rounded tiles.
It reads as something the group made rather than something the group installed.

## Palette (hex)

- Paper `#f7f3ea` - warm white, the ground of every frame.
- Note paper `#fefcf6` - the folded note is a fresher, whiter sheet than the page it lies on, which is how it separates without a border.
- Feint rule `rgba(122, 156, 196, .46)` - the pale-blue ruling, repeated every 22 px.
- Margin line `rgba(198, 84, 74, .62)` - one red rule at 40 px from the left, full height; all content starts to its right.
- Graphite `#2a2a2e` - every handwritten word. 14.4:1 on paper.
- Graphite secondary `#55555e` - subtitles and hint lines. 6.7:1.
- Graphite tertiary `#6d6d76` - printed stationery labels, placeholder, disabled labels. 4.7:1.
- Ballpoint `#1d3fbd` - the pen. It draws every control box, circles the included topics, underlines the input, and fills the primary action. 7.6:1 on paper, and paper knocked out of it is the same 7.6:1.
- Ballpoint deep `#16309a` - the same pen pressed harder, for outlined-box labels and the spy's hint.
- Error `#a2372c` - red pen. 6.1:1.
- Page-edge shade `rgba(122, 98, 58, .17)` - an inset shadow on all four sides so the sheet has thickness.

There is no second accent and no dark mode.
The scene is a lit room and a lit phone held flat on a table; a dark theme would turn the paper into a screen again.

## Type

Caveat 400-700 is the hand.
It sets the app title at 104 px, screen headings at 44-52 px, the secret word at 40 px, the clock at 104 px, player names at 27 px, topic names at 31 px, every button label, the subtitles and the hint lines.
If a person would have written it, it is Caveat.

Schibsted Grotesk 600 is the printed matter of the exercise book, and it appears at exactly one size: 10.5 px, uppercase, 0.14em tracked.
It sets `Included`, `Spies`, `Players`, `Time left` / `Paused`, `Player 3 of 6`, and the `Your word` / `You are the spy` label on the note.
Those are the labels a stationer printed, not the ones a player wrote, and keeping them tiny is what lets the handwriting be enormous.

Hierarchy is scale contrast alone - there is no weight ladder, no colour-coded heading, and no eyebrow above anything.
The ratio between the smallest printed label and the largest hand is roughly 1:10.

## Materials

The paper is built from four stacked layers inside each frame, in this order: a repeating linear-gradient ruling every 22 px, a 1.5 px red margin rule at x=40, the content, a four-sided inset edge shade, and a grain wash.
The grain is an inline `feTurbulence` SVG rendered to a data URI, tiled at 170 px, multiplied at 16 % opacity - enough tooth to kill the flatness of a CSS background, cheap enough to cost nothing.

Display-size handwriting runs through a real SVG filter: `feTurbulence` at `baseFrequency="0.035 0.07"` into an `feDisplacementMap` at scale 1.7.
It roughens the letter edges the way graphite catches on paper tooth, and because displacement is deterministic per pixel the clock digits do not shimmer while they tick.
It is applied only at display sizes, where the distortion reads as texture rather than as blur.

Every drawn line in the interface is a generated SVG path, not a CSS border.
Boxes are four corner points jittered by up to 2.3 px, joined by quadratic segments that bow up to 2.6 px off true, with the pen overshooting the start corner on outlined boxes the way a hand does.
Topic circles are 72-point ellipses modulated by three sine harmonics with random phase, opened at the top-left and overshot at the end so the stroke crosses itself.
Underlines and the input rule are the same wobble applied to a straight run.
All of it is seeded by a per-element `mulberry32`, so the ink is stable across re-renders, resizes and screenshots - it looks hand-drawn without being different every frame.

## Controls and states

The primary action is a ballpoint box filled solid, label knocked out in paper white, 56 px tall and the full column width.
Secondary actions that still need a target - `Add`, the two stepper buttons - are the same box left unfilled, 44 px.
Tertiary actions - `Back`, `Exit`, `End round` - are pencil words under a hand-drawn underline, 44 px of touch target with no box at all.

Every state is a hand mark, never a colour swap:

- Included topic: circled once in ballpoint.
- Excluded topic: no mark, and the name drops from graphite to graphite-secondary.
- The last included topic, which cannot be excluded: circled twice, the emphatic mark for "this one stays", and `disabled` with `aria-pressed="true"` held.
- Disabled `Start game`, `Got it`, and either end of the spy stepper: the box is redrawn in graphite instead of ballpoint and then pencil-hatched at 7 px, clipped to the drawn outline.
- Focus: a 2 px ballpoint ring at 3 px offset, on every control including the note. The text input additionally thickens its drawn rule from 1.8 to 3.4 px on focus-within.
- Selection is ballpoint with paper-white text; the caret is ballpoint; the roster's scrollbar is a ballpoint thumb on nothing.

The error line under the input is red pen at a reserved 22 px, so `Type a name first.` and `Someone already has that name.` arrive without moving the stepper.
The card hint line and the roster count are reserved the same way.

## Signature interaction

The face-down card is a note folded in half, lying on the page: a 288 x 340 area of which only the lower 170 px is occupied, by a whiter rectangle with a hard crease along its top edge, a shadow falling from that crease down the packet, and a drop shadow under it. `Priya` and `Tap to reveal` are written on the outside.

Tapping unfolds it for real.
The packet is a two-faced flap hinged at the crease with `transform-origin: top center`; it rotates `-180deg` about X over 620 ms on an exponential ease-out, swinging up to fill the empty half above.
Its back face carries `Your word`, its front face carried the name, and `backface-visibility` swaps them at the halfway point.
Underneath, the lower leaf - pushed 2 px back in Z so it can never fight the flap for paint order - is already holding `Hot-air balloon`.
The ruling of the two halves is phase-matched across the crease, so once open the note reads as one continuous sheet with a fold down the middle, the label sitting just above the crease and the word just below it.

It is transform and opacity only, it is the single authored motion in the build, and `prefers-reduced-motion` removes the transition while leaving the state change intact.
The reason it earns its place: unfolding is the gesture the product is actually asking for, and a note you have to open is a note you instinctively hold low.

## Honest risk

Caveat is a friendly, round hand.
It sells "game night" immediately and it sells "handwriting" immediately, but it is not a neutral face, and at 104 px it is closer to a marker than to a pencil - the graphite filter pulls it back toward pencil but does not fully get it there.
A group that wanted the game to feel sharp rather than warm would read this as too soft.

The whole direction rests on a single typeface doing almost all of the work.
If Caveat fails to load, the fallback stack is a step down in character in a way the other four directions would not suffer, because there is no second voice to carry the page.

The pages are very empty by design - Home is one word, one line, and one box on an otherwise blank sheet.
That is the raise from the type-specimen challenger and it is the reason the hierarchy works, but on a 780 px frame it can read as unfinished rather than as confident, and there is no cheap fix that does not put a container back on the page.

The hand-drawn ink is generated at layout time from measured element boxes.
That is what makes it look drawn rather than stroked, but it means the ink is one frame behind any layout change and has to be repainted on resize, on font load, and on mode switch.
In a real app that seam would need to be a component, not a sweep over the document.

Left-to-right ruled paper with a left margin rule is a culturally specific object, and this build hard-codes the margin on the left.
Russian ships today and is fine; a right-to-left locale would need the whole sheet mirrored, not just the text.
