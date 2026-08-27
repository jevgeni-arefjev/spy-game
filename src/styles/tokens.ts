/**
 * Typed mirror of `tokens.css` for the places JS needs a token — inline
 * styles, canvas work, a `<meta name="theme-color">` update, animation code.
 *
 * Values are `var(--token)` references, not literals, so the CSS file stays
 * the only definition and themes keep working.
 *
 * Keep this in sync with `tokens.css`; the names match one for one.
 */

export const color = {
  bg: 'var(--color-bg)',
  bgGradientTop: 'var(--color-bg-gradient-top)',
  surface: 'var(--color-surface)',
  surfaceMuted: 'var(--color-surface-muted)',
  border: 'var(--color-border)',
  borderStrong: 'var(--color-border-strong)',
  text: 'var(--color-text)',
  textMuted: 'var(--color-text-muted)',
  textInverse: 'var(--color-text-inverse)',
  accent: 'var(--color-accent)',
  accentStrong: 'var(--color-accent-strong)',
  accentSoft: 'var(--color-accent-soft)',
  accentContrast: 'var(--color-accent-contrast)',
  danger: 'var(--color-danger)',
  dangerStrong: 'var(--color-danger-strong)',
  dangerContrast: 'var(--color-danger-contrast)',
  spy: 'var(--color-spy)',
  spySurface: 'var(--color-spy-surface)',
  spyText: 'var(--color-spy-text)',
  cardBack: 'var(--color-card-back)',
  cardBackPattern: 'var(--color-card-back-pattern)',
  cardBackText: 'var(--color-card-back-text)',
  cardFace: 'var(--color-card-face)',
  focusRing: 'var(--color-focus-ring)',
  scrim: 'var(--color-scrim)',
  shadow: 'var(--color-shadow)',
  shadowStrong: 'var(--color-shadow-strong)',
} as const

export const space = {
  0: 'var(--space-0)',
  1: 'var(--space-1)',
  2: 'var(--space-2)',
  3: 'var(--space-3)',
  4: 'var(--space-4)',
  5: 'var(--space-5)',
  6: 'var(--space-6)',
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
  pill: 'var(--radius-pill)',
} as const

export const borderWidth = {
  hairline: 'var(--border-width-hairline)',
  thick: 'var(--border-width-thick)',
} as const

export const fontFamily = {
  base: 'var(--font-family-base)',
  display: 'var(--font-family-display)',
  numeric: 'var(--font-family-numeric)',
} as const

export const fontSize = {
  xs: 'var(--font-size-xs)',
  sm: 'var(--font-size-sm)',
  md: 'var(--font-size-md)',
  lg: 'var(--font-size-lg)',
  xl: 'var(--font-size-xl)',
  '2xl': 'var(--font-size-2xl)',
  '3xl': 'var(--font-size-3xl)',
  '4xl': 'var(--font-size-4xl)',
  '5xl': 'var(--font-size-5xl)',
} as const

export const lineHeight = {
  tight: 'var(--line-height-tight)',
  snug: 'var(--line-height-snug)',
  normal: 'var(--line-height-normal)',
  relaxed: 'var(--line-height-relaxed)',
} as const

export const fontWeight = {
  regular: 'var(--font-weight-regular)',
  medium: 'var(--font-weight-medium)',
  semibold: 'var(--font-weight-semibold)',
  bold: 'var(--font-weight-bold)',
} as const

export const letterSpacing = {
  tight: 'var(--letter-spacing-tight)',
  normal: 'var(--letter-spacing-normal)',
  wide: 'var(--letter-spacing-wide)',
} as const

export const opacity = {
  disabled: 'var(--opacity-disabled)',
  subtle: 'var(--opacity-subtle)',
  soft: 'var(--opacity-soft)',
} as const

export const shadow = {
  none: 'var(--shadow-none)',
  sm: 'var(--shadow-sm)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
} as const

export const zIndex = {
  base: 'var(--z-base)',
  raised: 'var(--z-raised)',
  card: 'var(--z-card)',
  overlay: 'var(--z-overlay)',
  toast: 'var(--z-toast)',
} as const

export const duration = {
  instant: 'var(--duration-instant)',
  fast: 'var(--duration-fast)',
  base: 'var(--duration-base)',
  slow: 'var(--duration-slow)',
  flip: 'var(--duration-flip)',
} as const

export const scale = {
  press: 'var(--scale-press)',
  pressCard: 'var(--scale-press-card)',
} as const

export const easing = {
  standard: 'var(--ease-standard)',
  out: 'var(--ease-out)',
  in: 'var(--ease-in)',
} as const

export const layout = {
  maxWidth: 'var(--layout-max-width)',
  gutter: 'var(--layout-gutter)',
  touchTarget: 'var(--size-touch-target)',
  cardMaxWidth: 'var(--size-card-max-width)',
  cardAspectRatio: 'var(--card-aspect-ratio)',
  cardPerspective: 'var(--card-perspective)',
} as const

export const tokens = {
  color,
  space,
  radius,
  borderWidth,
  fontFamily,
  fontSize,
  lineHeight,
  fontWeight,
  letterSpacing,
  opacity,
  shadow,
  zIndex,
  duration,
  scale,
  easing,
  layout,
} as const

export type Tokens = typeof tokens
export type ColorToken = keyof typeof color
export type SpaceToken = keyof typeof space
