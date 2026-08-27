import { describe, it, expect } from 'vitest'
import { msLeft } from './timer'
import type { TimerState } from './types'

const running = (endsAt: number): TimerState => ({
  endsAt,
  remainingMs: 300_000,
  running: true,
})

const paused = (remainingMs: number): TimerState => ({
  endsAt: null,
  remainingMs,
  running: false,
})

describe('msLeft while running', () => {
  it('counts down from the absolute deadline, ignoring stored remainingMs', () => {
    expect(msLeft(running(100_000), 40_000)).toBe(60_000)
    expect(msLeft(running(100_000), 99_000)).toBe(1_000)
  })

  it('clamps to zero once the deadline has passed', () => {
    expect(msLeft(running(100_000), 100_000)).toBe(0)
    expect(msLeft(running(100_000), 250_000)).toBe(0)
  })

  it('falls back to remainingMs if endsAt is somehow null', () => {
    expect(msLeft({ endsAt: null, remainingMs: 12_345, running: true }, 0)).toBe(12_345)
  })

  it('tracks the deadline exactly across a spread of now values', () => {
    const endsAt = 1_000_000
    for (const now of [0, 250, 999_000, 999_999, 1_000_000, 1_000_001, 2_000_000]) {
      expect(msLeft(running(endsAt), now)).toBe(Math.max(0, endsAt - now))
    }
  })

  it('never returns a negative number', () => {
    for (const now of [1e6, 1e9, Number.MAX_SAFE_INTEGER]) {
      expect(msLeft(running(500), now)).toBeGreaterThanOrEqual(0)
    }
  })
})

describe('msLeft while paused', () => {
  it('returns the frozen remainder regardless of now', () => {
    expect(msLeft(paused(90_000), 0)).toBe(90_000)
    expect(msLeft(paused(90_000), 10_000_000)).toBe(90_000)
  })

  it('clamps a negative remainder to zero', () => {
    expect(msLeft(paused(-5_000), 0)).toBe(0)
  })

  it('returns zero for an exhausted timer', () => {
    expect(msLeft(paused(0), 0)).toBe(0)
  })
})
