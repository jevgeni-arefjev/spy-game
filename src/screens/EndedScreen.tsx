import { useTranslation } from 'react-i18next'
import { Button } from '../components/Button'
import { Screen } from '../components/Screen'
import { createRoundSetup } from '../game/round'
import { useGame } from '../game/useGame'
import styles from './EndedScreen.module.css'

export function EndedScreen() {
  const { t } = useTranslation()
  const { state, dispatch } = useGame()

  const handlePlayAgain = () => {
    dispatch({
      type: 'game/playAgain',
      round: createRoundSetup(state.players, state.wordId),
    })
  }

  return (
    <Screen centered>
      <div className={styles.headline}>
        <h1 className={styles.title}>{t('ended.title')}</h1>
        <p className={styles.subtitle}>{t('ended.subtitle')}</p>
      </div>

      <div className={styles.actions}>
        <Button size="lg" fullWidth onClick={handlePlayAgain}>
          {t('ended.playAgain')}
        </Button>
        <Button fullWidth variant="ghost" onClick={() => dispatch({ type: 'game/reset' })}>
          {t('ended.newGame')}
        </Button>
      </div>
    </Screen>
  )
}
