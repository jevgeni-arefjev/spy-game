import { useTranslation } from 'react-i18next'
import { cx } from '../lib/classNames'
import styles from './RoleCard.module.css'

type RoleCardProps = {
  playerName: string
  isSpy: boolean
  /** Key into the `words` namespace. Ignored for the spy, who never sees it. */
  wordId: string
  revealed: boolean
  onReveal: () => void
}

/**
 * A single face-down card that flips on tap. The flip is a CSS 3D transform,
 * so it only ever animates `transform`.
 */
export function RoleCard({
  playerName,
  isSpy,
  wordId,
  revealed,
  onReveal,
}: RoleCardProps) {
  const { t } = useTranslation()

  return (
    <button
      type="button"
      className={cx(styles.card, revealed && styles.revealed)}
      onClick={onReveal}
      disabled={revealed}
      aria-label={t('reveal.cardLabel', { name: playerName })}
    >
      <span className={styles.inner}>
        <span className={cx(styles.face, styles.back)}>
          <span className={styles.backName}>{playerName}</span>
          <span className={styles.backHint}>{t('reveal.tapToReveal')}</span>
        </span>

        <span className={cx(styles.face, styles.front, isSpy && styles.spyFace)}>
          {isSpy ? (
            <>
              <span className={styles.frontLabel}>{t('role.spy.title')}</span>
              <span className={styles.frontHint}>{t('role.spy.hint')}</span>
            </>
          ) : (
            <>
              <span className={styles.frontLabel}>{t('role.civilian.title')}</span>
              <span className={styles.word}>{t(wordId, { ns: 'words' })}</span>
              <span className={styles.frontHint}>{t('role.civilian.hint')}</span>
            </>
          )}
        </span>
      </span>
    </button>
  )
}
