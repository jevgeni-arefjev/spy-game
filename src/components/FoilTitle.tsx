import { cx } from '../lib/classNames'
import styles from './FoilTitle.module.css'

type FoilTitleProps = {
  children: string
  className?: string
}

/**
 * A display title stamped a second time in brass, slightly out of register,
 * with the foil rule that follows it on both lid screens.
 */
export function FoilTitle({ children, className }: FoilTitleProps) {
  return (
    <div className={styles.block}>
      <h1 className={cx(styles.title, className)} data-text={children}>
        {children}
      </h1>
      <div className={styles.rule} />
    </div>
  )
}
