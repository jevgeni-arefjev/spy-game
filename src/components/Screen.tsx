import type { ReactNode } from 'react'
import { cx } from '../lib/classNames'
import styles from './Screen.module.css'

type ScreenProps = {
  children: ReactNode
  /** Vertically centre the content — for the full-screen, single-message moments. */
  centered?: boolean
}

/**
 * The one layout shell every phase renders into: safe-area padding, a capped
 * content column, and identical metrics across phases so nothing shifts when
 * the state machine advances.
 */
export function Screen({ children, centered = false }: ScreenProps) {
  return (
    <main className={styles.screen}>
      <div className={cx(styles.content, centered && styles.centered)}>{children}</div>
    </main>
  )
}
