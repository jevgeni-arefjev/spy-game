/**
 * Typed mirror of `tokens.css` for the places JS needs a token — inline
 * styles, canvas work, a `<meta name="theme-color">` update, animation code.
 *
 * Values are `var(--token)` references, not literals, so the CSS file stays
 * the only definition and a future theme keeps working.
 *
 * Keep this in sync with `tokens.css`; the names match one for one. The single
 * exception is `ring`, at the bottom, which carries real numbers — see its own
 * note for why.
 */

export const color = {
  bg: 'var(--color-bg)',
  lid: 'var(--color-lid)',
  lidDeep: 'var(--color-lid-deep)',
  board: 'var(--color-board)',
  boardEdge: 'var(--color-board-edge)',
  panel: 'var(--color-panel)',
  panelRaised: 'var(--color-panel-raised)',
  panelEdge: 'var(--color-panel-edge)',
  panelSunk: 'var(--color-panel-sunk)',
  token: 'var(--color-token)',
  tokenEdge: 'var(--color-token-edge)',
  foil: 'var(--color-foil)',
  foilDim: 'var(--color-foil-dim)',
  foilEdge: 'var(--color-foil-edge)',
  ember: 'var(--color-ember)',
  emberEdge: 'var(--color-ember-edge)',
  emberLit: 'var(--color-ember-lit)',
  ink: 'var(--color-ink)',
  text: 'var(--color-text)',
  textMuted: 'var(--color-text-muted)',
  textDim: 'var(--color-text-dim)',
  focusRing: 'var(--color-focus-ring)',
  selection: 'var(--color-selection)',
  caret: 'var(--color-caret)',
  cutLine: 'var(--color-cut-line)',
  cutLineInsert: 'var(--color-cut-line-insert)',
  ringTrack: 'var(--color-ring-track)',
  vignette: 'var(--color-vignette)',
  shadow: 'var(--color-shadow)',
  shadowStrong: 'var(--color-shadow-strong)',
  shadowDeep: 'var(--color-shadow-deep)',
} as const

export const wash = {
  lid: 'var(--wash-lid)',
  board: 'var(--wash-board)',
} as const

export const space = {
  0: 'var(--space-0)',
  1: 'var(--space-1)',
  2: 'var(--space-2)',
  3: 'var(--space-3)',
  4: 'var(--space-4)',
  5: 'var(--space-5)',
  6: 'var(--space-6)',
  7: 'var(--space-7)',
  8: 'var(--space-8)',
  10: 'var(--space-10)',
  12: 'var(--space-12)',
  16: 'var(--space-16)',
} as const

export const radius = {
  xs: 'var(--radius-xs)',
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  xl: 'var(--radius-xl)',
  '2xl': 'var(--radius-2xl)',
  circle: 'var(--radius-circle)',
} as const

export const borderWidth = {
  hairline: 'var(--border-width-hairline)',
  thick: 'var(--border-width-thick)',
  rule: 'var(--border-width-rule)',
  boardThickness: 'var(--board-thickness)',
  boardThicknessPressed: 'var(--board-thickness-pressed)',
} as const

export const fontFamily = {
  base: 'var(--font-family-base)',
  display: 'var(--font-family-display)',
} as const

export const fontSize = {
  '2xs': 'var(--font-size-2xs)',
  xs: 'var(--font-size-xs)',
  sm: 'var(--font-size-sm)',
  md: 'var(--font-size-md)',
  lg: 'var(--font-size-lg)',
  xl: 'var(--font-size-xl)',
  '2xl': 'var(--font-size-2xl)',
  '3xl': 'var(--font-size-3xl)',
  '4xl': 'var(--font-size-4xl)',
  '5xl': 'var(--font-size-5xl)',
  '6xl': 'var(--font-size-6xl)',
  '7xl': 'var(--font-size-7xl)',
  '8xl': 'var(--font-size-8xl)',
  '9xl': 'var(--font-size-9xl)',
  '10xl': 'var(--font-size-10xl)',
} as const

export const lineHeight = {
  flat: 'var(--line-height-flat)',
  tight: 'var(--line-height-tight)',
  snug: 'var(--line-height-snug)',
  normal: 'var(--line-height-normal)',
} as const

export const fontWeight = {
  regular: 'var(--font-weight-regular)',
  medium: 'var(--font-weight-medium)',
  semibold: 'var(--font-weight-semibold)',
  bold: 'var(--font-weight-bold)',
  display: 'var(--font-weight-display)',
} as const

export const letterSpacing = {
  tight: 'var(--letter-spacing-tight)',
  normal: 'var(--letter-spacing-normal)',
  piece: 'var(--letter-spacing-piece)',
  loose: 'var(--letter-spacing-loose)',
  progress: 'var(--letter-spacing-progress)',
  label: 'var(--letter-spacing-label)',
  clock: 'var(--letter-spacing-clock)',
} as const

export const shadow = {
  none: 'var(--shadow-none)',
  piece: 'var(--shadow-piece)',
  piecePressed: 'var(--shadow-piece-pressed)',
  insert: 'var(--shadow-insert)',
  panel: 'var(--shadow-panel)',
  token: 'var(--shadow-token)',
} as const

export const dropShadow = {
  mark: 'var(--drop-shadow-mark)',
  peek: 'var(--drop-shadow-peek)',
  card: 'var(--drop-shadow-card)',
  punch: 'var(--drop-shadow-punch)',
} as const

export const zIndex = {
  stock: 'var(--z-stock)',
  base: 'var(--z-base)',
  content: 'var(--z-content)',
  vignette: 'var(--z-vignette)',
} as const

export const duration = {
  press: 'var(--duration-press)',
  flip: 'var(--duration-flip)',
  tick: 'var(--duration-tick)',
} as const

export const easing = {
  press: 'var(--ease-press)',
  flip: 'var(--ease-flip)',
  linear: 'var(--ease-linear)',
} as const

export const layout = {
  maxWidth: 'var(--layout-max-width)',
  gutter: 'var(--layout-gutter)',
  gutterWide: 'var(--layout-gutter-wide)',
  padTop: 'var(--layout-pad-top)',
  padBottom: 'var(--layout-pad-bottom)',
  touchTarget: 'var(--size-touch-target)',
  pieceLg: 'var(--size-piece-lg)',
  pieceMd: 'var(--size-piece-md)',
  field: 'var(--size-field)',
  punch: 'var(--size-punch)',
  topicRow: 'var(--size-topic-row)',
  addButton: 'var(--size-add-button)',
  stepperValue: 'var(--size-stepper-value)',
  rackMin: 'var(--size-rack-min)',
  lineReserved: 'var(--size-line-reserved)',
  foilRule: 'var(--size-foil-rule)',
  measureHint: 'var(--size-measure-hint)',
  measureSub: 'var(--size-measure-sub)',
  homeMark: 'var(--size-home-mark)',
  endedMark: 'var(--size-ended-mark)',
  peek: 'var(--size-peek)',
  clockToken: 'var(--size-clock-token)',
  cardWidth: 'var(--size-card-width)',
  cardAspectRatio: 'var(--card-aspect-ratio)',
  cardPerspective: 'var(--card-perspective)',
} as const

/**
 * The countdown ring's geometry, in the units of its own `viewBox` rather than
 * in page pixels.
 *
 * This is the one set of real numbers here: `<Countdown>` has to compute the
 * arc's circumference to drive `stroke-dashoffset`, and SVG's `r` is not
 * dependable as a CSS property across browsers. The stroke *is* a token
 * (`--ring-stroke`), because that one is applied from CSS.
 */
export const ring = {
  size: 244,
  radius: 105,
} as const

export const tokens = {
  color,
  wash,
  space,
  radius,
  borderWidth,
  fontFamily,
  fontSize,
  lineHeight,
  fontWeight,
  letterSpacing,
  shadow,
  dropShadow,
  zIndex,
  duration,
  easing,
  layout,
  ring,
} as const

export type Tokens = typeof tokens
export type ColorToken = keyof typeof color
export type SpaceToken = keyof typeof space
