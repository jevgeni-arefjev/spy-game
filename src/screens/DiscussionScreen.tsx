import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../components/Button'
import { Countdown } from '../components/Countdown'
import { Screen } from '../components/Screen'
import { useGame } from '../game/useGame'
import styles from './DiscussionScreen.module.css'

export function DiscussionScreen() {
  const { t } = useTranslation()
  const { state, dispatch } = useGame()
  const { timer } = state

  // Stable so the ticking <Countdown> never re-subscribes.
  const handleExpire = useCallback(() => {
    dispatch({ type: 'round/end' })
  }, [dispatch])

  const toggle = () => {
    dispatch({ type: timer.running ? 'timer/pause' : 'timer/resume', now: Date.now() })
  }

  return (
    <Screen surface="lid" wide>
      <h1 className={styles.title}>{t('discussion.title')}</h1>

      <div className={styles.middle}>
        <Countdown timer={timer} onExpire={handleExpire} />
        <p className={styles.hint}>{t('discussion.hint', { count: state.spyCount })}</p>
      </div>

      <div className={styles.actions}>
        <Button size="lg" fullWidth onClick={toggle}>
          {timer.running ? t('discussion.pause') : t('discussion.resume')}
        </Button>
        <Button
          fullWidth
          variant="panel"
          onClick={() => dispatch({ type: 'round/end' })}
        >
          {t('discussion.endRound')}
        </Button>
      </div>
    </Screen>
  )
}
