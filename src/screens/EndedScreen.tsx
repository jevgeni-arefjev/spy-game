import { useTranslation } from 'react-i18next'
import spyglass from '../assets/spy-spyglass.webp'
import { Button } from '../components/Button'
import { FoilTitle } from '../components/FoilTitle'
import { Screen } from '../components/Screen'
import { useGame } from '../game/useGame'
import styles from './EndedScreen.module.css'

export function EndedScreen() {
  const { t } = useTranslation()
  const { dispatch } = useGame()

  return (
    <Screen surface="lid" wide>
      <div className={styles.middle}>
        <img className={styles.mark} src={spyglass} alt="" width="499" height="504" />
        <FoilTitle className={styles.title}>{t('ended.title')}</FoilTitle>
        <p className={styles.subtitle}>{t('ended.subtitle')}</p>
      </div>

      <div className={styles.actions}>
        <Button size="lg" fullWidth onClick={() => dispatch({ type: 'game/playAgain' })}>
          {t('ended.playAgain')}
        </Button>
        <Button
          fullWidth
          variant="panel"
          onClick={() => dispatch({ type: 'game/exit' })}
        >
          {t('ended.exit')}
        </Button>
      </div>
    </Screen>
  )
}
