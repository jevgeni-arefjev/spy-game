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
