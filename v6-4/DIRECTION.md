# v6-4 - Night Lid / Bloom

## Thesis

The wallpaper the mansion room is actually papered in: a scrolling vine carrying blossoms and tulips, printed in brass on the aubergine stock.
This is [v6 Night Lid](../v6/DIRECTION.md) with two things changed - the pattern printed into the box stock, and the fibre noise, which is gone.
Everything else - palette, type, pieces, the die-cut spy, the countdown ring, the card - is v6 unchanged.

## The pattern

A 144 px repeat built from two interleaved stems.
Each stem is a full-width S-wave whose ends meet at the same height with the same tangent, so it runs on unbroken across tiles; the second is the first half-dropped by 72 px in both axes, which puts the two out of phase and stops the repeat reading as a row of arches.
Thirteen flowers hang off them: seven five-petal blossoms at four sizes, the largest on the crest and the smallest tucked into the inflection, and six tulips in plain profile - a three-lobed cup on a stem with one blade leaf - dropped into the gaps the blossoms leave.
Spiral curls and three-line sprays fill what is left, the way the reference wallpaper does, so no quarter of the tile reads as empty.
Nothing but the stems crosses a tile edge, so the only seams the eye could find are two curves that are C1-continuous through them.

## Ink

Two tones, both already in the palette, standing in for the reference's lilac-on-violet.
Brass `#e8b34a` draws every stem, curl, blossom and tulip; violet `#6b46a8` fills the leaves as the darker mass behind them.
Each tone is one flat value: the whole brass drawing is a single group carrying the opacity, at 13.5% on the lid, rather than a per-element opacity on each path.
That is the difference between one hue and several - where five petal outlines converge on a flower's centre, per-element alpha stacks and burns a brighter yellow core into every blossom, while group alpha composites the drawing once and every line in the repeat lands on exactly the same gold.
The petals carry no fill for the same reason.
Violet sits at 9.5% under it, and on the board - which carries the roster, the card and the punchboard - both drop to roughly 70% of their lid value, so the busiest screens get the quietest print.
All of it still sits over the same 8 px twill and at `z-index: -1` inside the stock, under every piece printed on it.

## The noise is gone

v6 covered the whole frame with a desaturated `feTurbulence` tile at 55% in `soft-light`.
On a near-black plum ground it read as sensor noise rather than as paper fibre, and it was the one layer that touched the card - the only surface in the build that is held close to a face and read in a hurry.
Removing it leaves the weave and the vignette to do the work, and the card back keeps v6's own clean print: the brass lozenge repeat on aubergine with a foil pip in each corner.
The same removal has been applied to v6, v6-1, v6-2 and v6-3, so the five variants stay a fair test of the pattern alone.

## Risk

This is the densest of the four stocks and the only one with a recognisable subject in it.
A vine with blossoms is read as decoration, not as material - it says drawing room, where the twill and the die-cut token said box - and on Home, where it sits behind a 112 px display title with nothing else on the lid, it is close to the loudest it can be before it competes.
A repeat this large also shows only two and a half columns across a 360 px phone, so the eye can find the tile if it looks for it; the half-drop is what keeps that from being obvious.
