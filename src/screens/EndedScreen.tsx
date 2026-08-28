import { useTranslation } from 'react-i18next'
import { Button } from '../components/Button'
import { Screen } from '../components/Screen'
import { SPY_COUNT } from '../game/config'
import { useGame } from '../game/useGame'
import styles from './EndedScreen.module.css'

export function EndedScreen() {
  const { t } = useTranslation()
  const { dispatch } = useGame()

  return (
    <Screen centered>
      <div className={styles.headline}>
        <h1 className={styles.title}>{t('ended.title')}</h1>
        <p className={styles.subtitle}>{t('ended.subtitle', { count: SPY_COUNT })}</p>
      </div>

      <div className={styles.actions}>
        <Button size="lg" fullWidth onClick={() => dispatch({ type: 'game/playAgain' })}>
          {t('ended.playAgain')}
        </Button>
        <Button fullWidth variant="ghost" onClick={() => dispatch({ type: 'game/exit' })}>
          {t('ended.exit')}
        </Button>
      </div>
    </Screen>
  )
}
