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

  // What the name plate can hold at each display size, measured in Rammetto's
  // own width. Names longer than the first step step down rather than break.
  const nameSize =
    playerName.length > 17
      ? styles.nameLong
      : playerName.length > 12
        ? styles.nameMedium
        : undefined

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={cx(styles.card, revealed && styles.revealed)}
        onClick={onReveal}
        disabled={revealed}
        aria-label={t('reveal.cardLabel', { name: playerName })}
      >
        <span className={styles.inner}>
          <span className={cx(styles.face, styles.back)}>
            <span className={styles.plate}>
              <span className={cx(styles.name, nameSize)}>{playerName}</span>
              <span className={styles.tap}>{t('reveal.tapToReveal')}</span>
            </span>
          </span>

          <span className={cx(styles.face, styles.front, isSpy && styles.spyFace)}>
            {isSpy ? (
              <>
                <span className={styles.kind}>{t('role.spy.title')}</span>
                {hintId !== null && (
                  <span className={styles.big}>
                    {t('role.spy.hint', {
                      count: spyCount,
                      adjective: t(hintId, { ns: 'hints' }),
                    })}
                  </span>
                )}
              </>
            ) : (
              <>
                <span className={styles.kind}>{t('role.civilian.title')}</span>
                <span className={styles.big}>{t(wordId, { ns: 'words' })}</span>
              </>
            )}
          </span>
        </span>
      </button>
    </div>
  )
}
