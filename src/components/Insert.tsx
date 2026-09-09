import type { ReactNode } from 'react'
import styles from './Insert.module.css'

type InsertProps = {
  title: string
  subtitle: string
  children: ReactNode
}

/**
 * The setup screens' shared surface. Topics and Players are the same printed
 * insert with different things punched into it, so the heading block, the
 * stock and the die-line context live here once.
 */
export function Insert({ title, subtitle, children }: InsertProps) {
  return (
    <div className={styles.insert}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.subtitle}>{subtitle}</p>
      {children}
    </div>
  )
}
