import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import spyPeek from '../assets/spy-peek.webp'
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
    <Screen surface="board" wide>
      <p className={styles.progress}>
        {t('reveal.progress', {
          current: state.revealIndex + 1,
          total: state.players.length,
        })}
      </p>

      {isCardStep ? (
        <>
          <div className={styles.middle}>
            <RoleCard
              playerName={player.name}
              isSpy={state.spyIds.includes(player.id)}
              wordId={state.wordId}
              spyCount={state.spyCount}
              revealed={revealed}
              onReveal={() => setRevealedFor(player.id)}
            />
            <p className={styles.hint}>
              {revealed ? t('reveal.keepItSecret') : t('reveal.tapToReveal')}
            </p>
          </div>

          <Button
            size="lg"
            fullWidth
            disabled={!revealed}
            onClick={() => dispatch({ type: 'reveal/done', now: Date.now() })}
          >
            {t('reveal.gotIt')}
          </Button>
        </>
      ) : (
        <>
          <div className={styles.middle}>
            <div className={styles.panel}>
              <img className={styles.peek} src={spyPeek} alt="" width="451" height="456" />
              <h1 className={styles.passTo}>
                {t('reveal.passTo', { name: player.name })}
              </h1>
            </div>
          </div>

          <Button
            size="lg"
            fullWidth
            onClick={() => dispatch({ type: 'reveal/confirmHandoff' })}
          >
            {t('reveal.confirm', { name: player.name })}
          </Button>
        </>
      )}
    </Screen>
  )
}
