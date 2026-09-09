import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cx } from '../lib/classNames'
import { SUPPORTED_LOCALES, localeName, setLocale } from '../i18n'
import styles from './LanguagePicker.module.css'

/** The globe, drawn the way every other mark in the box is: stroked, not filled. */
function Globe() {
  return (
    <svg className={styles.globe} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="4" ry="9" />
      <path d="M3.6 9h16.8M3.6 15h16.8" />
    </svg>
  )
}

/**
 * The one place the language changes, and it lives on the lid only: once a
 * round is being set up the phone is being passed around, and a stray tap on a
 * corner must not relabel the game under whoever is holding it.
 *
 * The globe punch opens the list of shipped locales, each one a row punched
 * from the little insert the list is printed on - the same grammar as a topic,
 * so the language in play reads as the token pushed out of the sheet. The list
 * is built from `SUPPORTED_LOCALES`, so a new `locales/` folder appears in it
 * with no code change here.
 */
export function LanguagePicker() {
  const { i18n, t } = useTranslation()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const punchRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target
      if (target instanceof Node && rootRef.current?.contains(target) === true) return
      setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      punchRef.current?.focus()
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  if (SUPPORTED_LOCALES.length < 2) return null

  const choose = (locale: string) => {
    setLocale(locale)
    setOpen(false)
    punchRef.current?.focus()
  }

  return (
    <div className={styles.picker} ref={rootRef}>
      <button
        ref={punchRef}
        type="button"
        className={styles.punch}
        aria-label={t('language.label')}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
      >
        <Globe />
      </button>

      {open && (
        <ul className={styles.menu} aria-label={t('language.label')}>
          {SUPPORTED_LOCALES.map((locale) => {
            const current = locale === i18n.language
            return (
              <li key={locale}>
                <button
                  type="button"
                  lang={locale}
                  className={cx(styles.option, current && styles.chosen)}
                  aria-current={current}
                  onClick={() => choose(locale)}
                >
                  <span className={styles.pip} aria-hidden="true" />
                  {localeName(locale)}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
