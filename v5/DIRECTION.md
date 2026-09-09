# v5 - Cyclorama

## Thesis

The round is a lighting cue sequence on a cyclorama.
It opens in blackout, the light rises through every phase, and "Time's up" is full white day.
Colour here is light on a curved wall, not print, so every ground is a horizon: a band with a firm lower edge and a smooth falloff upward.
It refuses the printed-paper world and the neon-glow world both, and it refuses cards and containers: content is held in horizontal bands stacked dark to light.

## Palette (hex)

- Cyc black `#050507` - the depthless wall before any light; the ground of every dark phase.
- Cobalt `#1435c8`, lit `#2b52f0`, high `#3f63ff` - the night band and every lit control.
- Cobalt line `#6f8cff` - the hairline at the horizon in blackout and night.
- Rose `#ff5aa0`, deep `#d1356f`, line `#ff96c8` - first light gathering above the cobalt on handoff and card, and the spy face.
- Amber `#ffb36b`, high `#ffc98f`, line `#ffd096` - dawn blooming on the discussion screen and the pause band.
- Day `#f4f2ee` with ink `#0a0a0c` - the white wash of the ended screen, still carrying a cobalt line at the foot.
- Dim type `#c9d2ea` and dimmer `#8fa6ff` on dark grounds; `#55544f` on the day ground.
- Beam `#ffe3b8` - the focus ring on every control.

Five phases, five grounds, one system: a `--h` horizon height, a hairline at the junction, a wall band above with a hard lower edge, a floor spill below.
Only the light changes between phases.

## Type

Saira 700 sets the title, the headings, the clock at 84 px with tabular figures, the word on the card at 32 px, and every band label.
Saira 400 to 500 sets subtitles, roster names and hint lines.
Saira Stencil One sets the cue label on every screen (`LX 001 BLACKOUT`, `LX 127 NIGHT`, `LX 263 FIRST LIGHT`, `LX 389 DAWN`, `LX 512 DAY`), the small state words beside controls (`HOLD`, `BLACKOUT`), the counts and the progress line, all at 11 to 13 px, tracked, in the phase's own light colour.
The cue number rises through the round, so the label is wayfinding, not ornament.

## Materials

Every ground is built from layered linear gradients off one horizon line, with one radial gradient for the rose gathering on first light.
There are no diagonal washes, no decorative gradients and no shadows except the drop under the card.
Headlines stand on the horizon: "Spy", "Pass the phone to Priya", the clock and "Time's up" all sit with their baseline on the line, and their subtitle sits just below it in the floor spill.
Rows and controls are bands: full-width strips with a hairline top edge, lit from their bottom edge when active.

## Controls and states

The primary action is a fully lit cobalt band, 60 px tall, full width, white type.
On the discussion screen the pause band is lit amber with dark type and the state word `HOLD`; End round is a black band with `BLACKOUT` beside it.
Secondary actions are unlit bands with a hairline top edge; disabled bands drop to dim type on a darker unlit ground.
Included topics are bands lit from below with a white lamp strip at the right; excluded ones are unlit with an outlined lamp, so state is never colour alone.
The roster is a stack of bands with a drawn remove cross; the stepper is a band with the value between two keys.
The error line and the hint line reserve their height.
Focus is a beam-coloured 2 px ring inset on every control; selection is cobalt with white type; the caret is rose.

## Signature interaction

The face-down card is a black silhouette on the lit cyc with a hairline edge.
Tapping raises light inside the card from its bottom edge, a masked gradient translating up over 900 ms on an exponential ease-out, until the word stands white against cobalt, or the spy's hint against rose.
The back fades as the light rises; the face rises 12 px into place behind it.
`prefers-reduced-motion` collapses every transition to an instant swap and the state change still happens.

## Honest risk

Gradients are the material here, and they only earn their place while they behave like light with a horizon and a falloff; a lazy edit turns the wall into a wallpaper.
The day wash on the ended screen is bright in a dim room on purpose, and some groups will find that jump harsh.
The dark phases carry a lot of empty wall by design; the composition relies on the horizon to feel intentional rather than unfinished.
White type on rose and amber bands needs care; the build darkens the ground under text and uses dark type on the amber band.
