import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../components/Button'
import { RoleCard } from '../components/RoleCard'
import { Screen } from '../components/Screen'
import { useGame } from '../game/useGame'
import styles from './RevealScreen.module.css'

export function RevealScreen() {
  const { t } = useTranslation()
  const { state, dispatch } = useGame()

  /**
   * Which player's card is currently face-up. Tying it to a player id rather
   * than a boolean is what makes "no going back" free: once we advance, the
   * id no longer matches and the next card starts face-down.
   */
  const [revealedFor, setRevealedFor] = useState<string | null>(null)

  const player = state.players[state.revealIndex]
  if (player === undefined || state.wordId === null) return null

  const isCardStep = state.revealStep === 'card'
  const revealed = isCardStep && revealedFor === player.id

  return (
    <Screen centered>
      <p className={styles.progress}>
        {t('reveal.progress', {
          current: state.revealIndex + 1,
          total: state.players.length,
        })}
      </p>

      {isCardStep ? (
        <>
          <RoleCard
            playerName={player.name}
            isSpy={state.spyIds.includes(player.id)}
            wordId={state.wordId}
            revealed={revealed}
            onReveal={() => setRevealedFor(player.id)}
          />

          <div className={styles.actions}>
            <p className={styles.hint}>
              {revealed ? t('reveal.keepItSecret') : t('reveal.tapToReveal')}
            </p>
            <Button
              size="lg"
              fullWidth
              disabled={!revealed}
              onClick={() => dispatch({ type: 'reveal/done', now: Date.now() })}
            >
              {t('reveal.gotIt')}
            </Button>
          </div>
        </>
      ) : (
        <div className={styles.handoff}>
          <h1 className={styles.passTo}>
            {t('reveal.passTo', { name: player.name })}
          </h1>
          <p className={styles.hint}>{t('reveal.passHint')}</p>
          <Button
            size="lg"
            fullWidth
            onClick={() => dispatch({ type: 'reveal/confirmHandoff' })}
          >
            {t('reveal.confirm', { name: player.name })}
          </Button>
        </div>
      )}
    </Screen>
  )
}
