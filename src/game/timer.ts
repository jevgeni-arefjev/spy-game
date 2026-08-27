import type { TimerState } from './types'

/**
 * Milliseconds left on the clock, whether it is running or paused.
 *
 * While running this is always recomputed from the absolute deadline, which is
 * what makes the timer immune to throttled intervals, a locked screen or a
 * page reload. Nothing anywhere accumulates ticks.
 */
export function msLeft(timer: TimerState, now: number): number {
  if (!timer.running || timer.endsAt === null) {
    return Math.max(0, timer.remainingMs)
  }
  return Math.max(0, timer.endsAt - now)
}
