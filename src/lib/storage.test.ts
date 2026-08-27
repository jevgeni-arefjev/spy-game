import { afterEach, describe, it, expect, vi } from 'vitest'
import * as storage from './storage'

class FakeStorage {
  private store = new Map<string, string>()
  get length() {
    return this.store.size
  }
  key(i: number) {
    return [...this.store.keys()][i] ?? null
  }
  getItem(k: string) {
    return this.store.has(k) ? (this.store.get(k) as string) : null
  }
  setItem(k: string, v: string) {
    this.store.set(k, String(v))
  }
  removeItem(k: string) {
    this.store.delete(k)
  }
  clear() {
    this.store.clear()
  }
  /** Reach past the module seam for corrupt-value tests. */
  raw() {
    return this.store
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
  // Tests that redefine the accessor directly clean up here.
  if (Object.getOwnPropertyDescriptor(globalThis, 'localStorage')) {
    delete (globalThis as { localStorage?: unknown }).localStorage
  }
})

describe('with a working backend', () => {
  it('round-trips JSON-serialisable values', () => {
    vi.stubGlobal('localStorage', new FakeStorage())
    const value = { a: 1, b: ['x', 'y'], c: null }
    storage.set('k', value)
    expect(storage.get('k')).toEqual(value)
  })

  it('returns null for a missing key', () => {
    vi.stubGlobal('localStorage', new FakeStorage())
    expect(storage.get('absent')).toBeNull()
  })

  it('returns null for a corrupt stored value instead of throwing', () => {
    const fake = new FakeStorage()
    vi.stubGlobal('localStorage', fake)
    fake.raw().set('k', '{ not json')
    expect(storage.get('k')).toBeNull()
  })

  it('clears a key', () => {
    vi.stubGlobal('localStorage', new FakeStorage())
    storage.set('k', 1)
    storage.clear('k')
    expect(storage.get('k')).toBeNull()
  })
})

describe('with a hostile backend', () => {
  it('swallows a throwing setItem (private mode / quota)', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => {
        throw new DOMException('QuotaExceededError')
      },
      removeItem: () => {},
    })
    expect(() => storage.set('k', { big: 'payload' })).not.toThrow()
  })

  it('returns null when getItem throws', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('nope')
      },
      setItem: () => {},
      removeItem: () => {},
    })
    expect(storage.get('k')).toBeNull()
  })

  it('swallows a throwing removeItem', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {
        throw new Error('nope')
      },
    })
    expect(() => storage.clear('k')).not.toThrow()
  })

  it('treats a throwing localStorage accessor as no storage', () => {
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      get() {
        throw new Error('access denied')
      },
    })
    expect(storage.get('k')).toBeNull()
    expect(() => storage.set('k', 1)).not.toThrow()
    expect(() => storage.clear('k')).not.toThrow()
  })
})

describe('with no backend at all', () => {
  it('degrades to null / no-op', () => {
    vi.stubGlobal('localStorage', undefined)
    expect(storage.get('k')).toBeNull()
    expect(() => storage.set('k', 1)).not.toThrow()
    expect(() => storage.clear('k')).not.toThrow()
  })
})
