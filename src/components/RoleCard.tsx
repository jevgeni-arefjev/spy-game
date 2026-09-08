import { useTranslation } from 'react-i18next'
import { hintIdForWord } from '../game/words'
import { cx } from '../lib/classNames'
import styles from './RoleCard.module.css'

type RoleCardProps = {
  playerName: string
  isSpy: boolean
  /**
   * Key into the `words` namespace. The spy never sees the word itself, but
   * their hint adjective is derived from it.
   */
  wordId: string
  /** Spies this round — drives the "other players are spies too" plural. */
  spyCount: number
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
  spyCount,
  revealed,
  onReveal,
}: RoleCardProps) {
  const { t } = useTranslation()
  const hintId = hintIdForWord(wordId)

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
              {hintId !== null && (
                <span className={styles.frontHint}>
                  {t('role.spy.hint', {
                    count: spyCount,
                    adjective: t(hintId, { ns: 'hints' }),
                  })}
                </span>
              )}
            </>
          ) : (
            <>
              <span className={styles.frontLabel}>{t('role.civilian.title')}</span>
              <span className={styles.word}>{t(wordId, { ns: 'words' })}</span>
            </>
          )}
        </span>
      </span>
    </button>
  )
}
