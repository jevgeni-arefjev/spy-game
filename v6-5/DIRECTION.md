# v6-5 - Night Lid / Wallpaper

## Thesis

The wallpaper stops being a drawing and becomes a sheet: v6-4's brass vine, replaced by the photographed stock it was imitating.
This is [v6-4 Bloom](../v6-4/DIRECTION.md) with one thing changed - the stock is now a raster sheet rather than a 144 px SVG repeat.
Everything else - palette, type, pieces, the circle avatars, the die-cut spy, the countdown ring, the card - is v6-4 unchanged.

## The sheet

`wallpaper.png` at the repo root, a 941x1672 aubergine sheet carrying a scrolling brass vine with five-petal blossoms, tulips, leaves and curls.
It is inlined as a WebP data URI (q82, ~136 KB) rather than referenced by path, because the comparison page loads each mockup through `iframe.srcdoc`, where a relative `url()` has no document to resolve against.

It is laid down once at `background-size:cover`, not tiled.
A phone frame is 360x780 and the sheet is 941x1672, so cover crops a little off the sides and the eye never meets a seam - the repeat inside the photograph does the work a CSS tile would have done, and does it with the paper's own weave, ink bleed and fall-off, none of which a flat SVG can carry.

## Two stops, one sheet

The lid and the board are the same sheet under different washes, stacked as a flat `linear-gradient` above the image in the same `background-image` list.

- Lid: `rgba(26,13,41,.20)` - the deep-lid tone at a fifth, just enough to sit the brass back down under the foil type.
- Board: `rgba(10,5,18,.52)` - the board-edge tone at half, which drops the sheet a full stop so the play surface still reads as the inside of the box rather than its cover.

That preserves v6-4's relationship between the two surfaces without keeping two copies of the artwork.
The `.phone::before` vignette still sits above everything at `z-index:3`, so the corners fall off exactly as before.

## What did not change

The fibre-noise layer stays gone, as in v6-4 - the photograph has its own grain.
`--lid` and `--board` remain the surface `background`, so the sheet has something correct underneath it if the data URI ever fails to decode.
No piece, no token and no layout rule was touched.
