import { cx } from '../lib/classNames'
import { useFitToWidth } from './useFitToWidth'
import styles from './FoilTitle.module.css'

type FoilTitleProps = {
  children: string
  className?: string
}

/**
 * A display title stamped a second time in brass, slightly out of register,
 * with the foil rule that follows it on both lid screens.
 *
 * The title is one line, always: the size the screen's CSS gives it is the
 * largest it is ever stamped at, and `useFitToWidth` steps it down when the
 * word is longer than the plate - "Шпион" on a narrow phone.
 */
export function FoilTitle({ children, className }: FoilTitleProps) {
  const ref = useFitToWidth<HTMLHeadingElement>(children)

  return (
    <div className={styles.block}>
      <h1 ref={ref} className={cx(styles.title, className)} data-text={children}>
        {children}
      </h1>
      <div className={styles.rule} />
    </div>
  )
}
