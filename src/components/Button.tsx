import type { ButtonHTMLAttributes } from 'react'
import { cx } from '../lib/classNames'
import styles from './Button.module.css'

/**
 * The four pieces the box is punched with. `primary` is brass foil and is the
 * only one of them that carries a screen's main action; `quiet` is board with
 * foil lettering; `panel` is board with paper lettering; `ghost` is a scored
 * line rather than a punched piece.
 */
export type ButtonVariant = 'primary' | 'panel' | 'quiet' | 'ghost'
export type ButtonSize = 'md' | 'lg'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      className={cx(
        styles.piece,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        className,
      )}
    />
  )
}
