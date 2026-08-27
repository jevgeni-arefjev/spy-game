import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../components/Button'
import { Countdown } from '../components/Countdown'
import { Screen } from '../components/Screen'
import { SPY_COUNT } from '../game/config'
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
    <Screen centered>
      <h1 className={styles.title}>{t('discussion.title')}</h1>

      <div className={styles.clockBlock}>
        <p className={styles.label}>
          {timer.running ? t('discussion.timeLeft') : t('discussion.paused')}
        </p>
        <Countdown timer={timer} onExpire={handleExpire} />
      </div>

      <p className={styles.hint}>{t('discussion.hint', { count: SPY_COUNT })}</p>

      <div className={styles.actions}>
        <Button size="lg" fullWidth variant="secondary" onClick={toggle}>
          {timer.running ? t('discussion.pause') : t('discussion.resume')}
        </Button>
        <Button
          fullWidth
          variant="danger"
          onClick={() => dispatch({ type: 'round/end' })}
        >
          {t('discussion.endRound')}
        </Button>
      </div>
    </Screen>
  )
}
