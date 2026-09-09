import type { ReactNode } from 'react'
import { cx } from '../lib/classNames'
import styles from './Screen.module.css'

/**
 * Which printed ground the phase sits on. The lid is the cover of the box —
 * home, discussion, ended; the board is the punchboard inside it, where the
 * setup and the reveal happen.
 */
export type ScreenSurface = 'lid' | 'board'

type ScreenProps = {
  children: ReactNode
  surface: ScreenSurface
  /** Wider gutters, for screens whose content is not held in an insert. */
  wide?: boolean
}

/**
 * The one layout shell every phase renders into: the printed stock, the
 * vignette that makes it read as an object, safe-area padding and a capped
 * content column with identical metrics across phases, so nothing shifts when
 * the state machine advances.
 */
export function Screen({ children, surface, wide = false }: ScreenProps) {
  return (
    <main className={cx(styles.screen, styles[surface])}>
      <div className={cx(styles.content, wide && styles.wide)}>{children}</div>
    </main>
  )
}
