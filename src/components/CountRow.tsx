import { cx } from '../lib/classNames'
import styles from './CountRow.module.css'

type CountRowProps = {
  label: string
  value: string
  className?: string
}

/** A printed label on the insert with its live count set against it. */
export function CountRow({ label, value, className }: CountRowProps) {
  return (
    <div className={cx(styles.row, className)}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </div>
  )
}
