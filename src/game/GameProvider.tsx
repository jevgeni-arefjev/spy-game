import { useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef } from 'react'
import type { Action } from './types'
import type { ReactNode } from 'react'
import { startViewTransition } from '../lib/viewTransition'
import { PERSIST_DEBOUNCE_MS } from './config'
import { GameContext } from './GameContext'
import { loadState, saveState } from './persistence'
import { reducer } from './reducer'

type GameProviderProps = {
  children: ReactNode
}

/**
 * Two backstops, not schedules. A view transition hands control of when the
 * state actually changes to the browser, and a party game may never let that
 * cost it a round: `START` is how long the browser gets to call back before
 * the action is applied without a transition, and `COMMIT` is how long the
 * transition is then held open waiting for React to paint. Both land within a
 * frame when the page is on screen; these exist for when it is not.
 */
const TRANSITION_START_TIMEOUT_MS = 200
const TRANSITION_COMMIT_TIMEOUT_MS = 300

export function GameProvider({ children }: GameProviderProps) {
  const [state, dispatch] = useReducer(reducer, null, loadState)

  const pendingState = useRef(state)
  pendingState.current = state

  // Debounced write, so a burst of taps costs one serialisation.
  useEffect(() => {
    const handle = window.setTimeout(() => {
      saveState(state)
    }, PERSIST_DEBOUNCE_MS)
    return () => window.clearTimeout(handle)
  }, [state])

  // A backgrounded mobile browser may never run the timeout above, so flush
  // the moment the page is hidden.
  useEffect(() => {
    const flush = () => saveState(pendingState.current)
    window.addEventListener('pagehide', flush)
    document.addEventListener('visibilitychange', flush)
    return () => {
      window.removeEventListener('pagehide', flush)
      document.removeEventListener('visibilitychange', flush)
    }
  }, [])

  /** Set while a phase transition is waiting for the new phase to be painted. */
  const commitTransition = useRef<(() => void) | null>(null)

  // Layout, not passive: the transition is released the moment the new phase
  // is in the DOM, before the browser has had a chance to paint it half-done.
  useLayoutEffect(() => {
    const commit = commitTransition.current
    if (commit === null) return
    commitTransition.current = null
    commit()
  }, [state])

  /**
   * Every action goes through here, and the ones that change phase go through
   * a view transition on the way.
   *
   * Asking the reducer what an action will do before dispatching it is free
   * and cannot diverge from the dispatch below, because the reducer is pure
   * and every draw it needs is already in the action's payload. It is also the
   * only way to know that `reveal/done` on the last player is a phase change
   * and on every other player is not.
   */
  const dispatchAction = useCallback((action: Action) => {
    const current = pendingState.current
    const changesPhase = reducer(current, action).phase !== current.phase

    // One transition at a time, and none at all while the page is off screen:
    // a hidden document gets no rendering opportunities, so the browser would
    // have nowhere to run the update. The round ending on a pocketed phone is
    // the case that matters, and it must land the moment it is dispatched.
    if (
      !changesPhase ||
      commitTransition.current !== null ||
      document.visibilityState !== 'visible'
    ) {
      dispatch(action)
      return
    }

    let applied = false
    const apply = () => {
      if (applied) return
      applied = true
      dispatch(action)
    }

    const started = startViewTransition(
      () =>
        new Promise<void>((resolve) => {
          commitTransition.current = resolve
          window.setTimeout(() => {
            if (commitTransition.current !== resolve) return
            commitTransition.current = null
            resolve()
          }, TRANSITION_COMMIT_TIMEOUT_MS)
          apply()
        }),
    )

    if (!started) {
      apply()
      return
    }

    // The browser runs the update on a rendering opportunity, which is not
    // guaranteed to come. If it does not, the phase changes without the
    // transition rather than not at all.
    window.setTimeout(apply, TRANSITION_START_TIMEOUT_MS)
  }, [])

  const value = useMemo(
    () => ({ state, dispatch: dispatchAction }),
    [state, dispatchAction],
  )

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}
