import { useTranslation } from 'react-i18next'
import { Button } from '../components/Button'
import { Screen } from '../components/Screen'
import { SPY_COUNT } from '../game/config'
import { useGame } from '../game/useGame'
import styles from './HomeScreen.module.css'

export function HomeScreen() {
  const { t } = useTranslation()
  const { dispatch } = useGame()

  return (
    <Screen centered>
      <div className={styles.headline}>
        <h1 className={styles.title}>{t('app.title')}</h1>
        <p className={styles.tagline}>{t('app.tagline', { count: SPY_COUNT })}</p>
      </div>

      <div className={styles.actions}>
        <Button size="lg" fullWidth onClick={() => dispatch({ type: 'game/open' })}>
          {t('home.play')}
        </Button>
      </div>
    </Screen>
  )
}
