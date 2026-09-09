import { useTranslation } from 'react-i18next'
import spyToken from '../assets/spy-token.webp'
import { Button } from '../components/Button'
import { FoilTitle } from '../components/FoilTitle'
import { Screen } from '../components/Screen'
import { useGame } from '../game/useGame'
import styles from './HomeScreen.module.css'

export function HomeScreen() {
  const { t } = useTranslation()
  const { state, dispatch } = useGame()

  return (
    <Screen surface="lid" wide>
      <div className={styles.middle}>
        <svg className={styles.token} viewBox="0 0 200 200" aria-hidden="true">
          <defs>
            <clipPath id="home-token-clip">
              <circle cx="100" cy="100" r="83" />
            </clipPath>
          </defs>
          <circle className={styles.tokenDisc} cx="100" cy="100" r="83" />
          <image
            href={spyToken}
            x="17"
            y="17"
            width="166"
            height="166"
            clipPath="url(#home-token-clip)"
            preserveAspectRatio="xMidYMid slice"
          />
          <circle className={styles.tokenRing} cx="100" cy="100" r="83" />
        </svg>

        <FoilTitle className={styles.title}>{t('app.title')}</FoilTitle>
        <p className={styles.tagline}>{t('app.tagline', { count: state.spyCount })}</p>
      </div>

      <Button size="lg" fullWidth onClick={() => dispatch({ type: 'game/open' })}>
        {t('home.play')}
      </Button>
    </Screen>
  )
}
