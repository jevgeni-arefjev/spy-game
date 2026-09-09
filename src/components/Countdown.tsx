import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cx } from '../lib/classNames'
import { DISCUSSION_SECONDS, TICK_INTERVAL_MS } from '../game/config'
import { msLeft } from '../game/timer'
import type { TimerState } from '../game/types'
import { ring } from '../styles/tokens'
import styles from './Countdown.module.css'

type CountdownProps = {
  timer: TimerState
  /** Called once the clock reaches zero. Must be referentially stable. */
  onExpire: () => void
}

const RING_CIRCUMFERENCE = 2 * Math.PI * ring.radius

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

/**
 * The clock, drawn as the token it is printed on: label, digits, and the brass
 * ring around the rim that burns down with the round.
 *
 * This is the only component that re-renders on every tick, which is why the
 * whole token lives here rather than being assembled by the screen.
 *
 * It never accumulates ticks: each tick reads `Date.now()` against the stored
 * deadline, so backgrounding the browser, locking the phone or reloading the
 * page all resolve to the same remaining time — and to the same arc.
 */
export function Countdown({ timer, onExpire }: CountdownProps) {
  const { t } = useTranslation()
  const [ms, setMs] = useState(() => msLeft(timer, Date.now()))

  useEffect(() => {
    const tick = () => setMs(msLeft(timer, Date.now()))
    tick()

    if (!timer.running) return

    const handle = window.setInterval(tick, TICK_INTERVAL_MS)
    // A backgrounded tab throttles intervals; resync the instant we're back.
    const resync = () => {
      if (!document.hidden) tick()
    }
    document.addEventListener('visibilitychange', resync)

    return () => {
      window.clearInterval(handle)
      document.removeEventListener('visibilitychange', resync)
    }
  }, [timer])

  useEffect(() => {
    if (ms <= 0) onExpire()
  }, [ms, onExpire])

  const totalSeconds = Math.ceil(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  // The offset is negative so the gap opens at twelve o'clock and grows
  // clockwise; a positive one would eat the ring the other way round.
  const left = Math.min(1, Math.max(0, ms / (DISCUSSION_SECONDS * 1000)))
  const center = ring.size / 2

  return (
    <div className={cx(styles.token, !timer.running && styles.paused)}>
      <div className={styles.edge} />
      <div className={styles.face}>
        <p className={styles.label}>
          {timer.running ? t('discussion.timeLeft') : t('discussion.paused')}
        </p>
        <p className={styles.time} role="timer" aria-live="off">
          {t('discussion.clock', { minutes: pad(minutes), seconds: pad(seconds) })}
        </p>
      </div>
      <svg
        className={styles.ring}
        viewBox={`0 0 ${ring.size} ${ring.size}`}
        aria-hidden="true"
      >
        <circle className={styles.track} cx={center} cy={center} r={ring.radius} />
        <circle
          className={styles.arc}
          cx={center}
          cy={center}
          r={ring.radius}
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={-RING_CIRCUMFERENCE * (1 - left)}
        />
      </svg>
    </div>
  )
}
