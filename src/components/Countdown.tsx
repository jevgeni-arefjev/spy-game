import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TICK_INTERVAL_MS } from '../game/config'
import styles from './Countdown.module.css'

type CountdownProps = {
  /** Absolute deadline while running; null while paused. */
  endsAt: number | null
  /** Milliseconds left; authoritative while paused. */
  remainingMs: number
  running: boolean
  /** Called once the clock reaches zero. Must be referentially stable. */
  onExpire: () => void
}

function currentMs(endsAt: number | null, remainingMs: number, running: boolean): number {
  if (!running || endsAt === null) return Math.max(0, remainingMs)
  return Math.max(0, endsAt - Date.now())
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

/**
 * The only component that re-renders on every tick.
 *
 * It never accumulates ticks: each frame reads `Date.now()` against the stored
 * deadline, so backgrounding the browser, locking the phone or reloading the
 * page all resolve to the same remaining time.
 */
export function Countdown({ endsAt, remainingMs, running, onExpire }: CountdownProps) {
  const { t } = useTranslation()
  const [ms, setMs] = useState(() => currentMs(endsAt, remainingMs, running))

  useEffect(() => {
    if (!running || endsAt === null) {
      setMs(Math.max(0, remainingMs))
      return
    }

    const tick = () => setMs(Math.max(0, endsAt - Date.now()))
    tick()

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
  }, [endsAt, remainingMs, running])

  useEffect(() => {
    if (ms <= 0) onExpire()
  }, [ms, onExpire])

  const totalSeconds = Math.ceil(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return (
    <span className={styles.clock} role="timer" aria-live="off">
      {t('discussion.clock', { minutes: pad(minutes), seconds: pad(seconds) })}
    </span>
  )
}
