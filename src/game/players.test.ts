import { describe, it, expect } from 'vitest'
import { validatePlayerName } from './players'
import { MAX_PLAYERS } from './config'
import type { Player } from './types'

function roster(names: string[]): Player[] {
  return names.map((name, i) => ({ id: `p${i}`, name }))
}

describe('validatePlayerName', () => {
  it('trims surrounding whitespace and accepts the result', () => {
    expect(validatePlayerName('  Ada  ', [])).toEqual({ ok: true, name: 'Ada' })
    expect(validatePlayerName('Grace\t', [])).toEqual({ ok: true, name: 'Grace' })
  })

  it('rejects empty and whitespace-only names', () => {
    for (const raw of ['', '   ', '\t', '\n ']) {
      expect(validatePlayerName(raw, [])).toEqual({ ok: false, error: 'empty' })
    }
  })

  it('rejects duplicates case-insensitively and after trimming', () => {
    const players = roster(['Ada'])
    for (const raw of ['Ada', 'ada', 'ADA', '  aDa  ']) {
      expect(validatePlayerName(raw, players)).toEqual({
        ok: false,
        error: 'duplicate',
      })
    }
  })

  it('accepts a distinct name against a populated roster', () => {
    expect(validatePlayerName('Bob', roster(['Ada', 'Eve']))).toEqual({
      ok: true,
      name: 'Bob',
    })
  })

  it('reports a full roster, and emptiness still wins over fullness', () => {
    const full = roster(Array.from({ length: MAX_PLAYERS }, (_, i) => `P${i}`))
    expect(validatePlayerName('Newcomer', full)).toEqual({ ok: false, error: 'full' })
    expect(validatePlayerName('P0', full)).toEqual({ ok: false, error: 'full' })
    expect(validatePlayerName('   ', full)).toEqual({ ok: false, error: 'empty' })
  })

  it('does not treat a roster of MAX_PLAYERS - 1 as full', () => {
    const nearlyFull = roster(Array.from({ length: MAX_PLAYERS - 1 }, (_, i) => `P${i}`))
    expect(validatePlayerName('Newcomer', nearlyFull)).toEqual({
      ok: true,
      name: 'Newcomer',
    })
  })
})
