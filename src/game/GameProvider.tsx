import { useEffect, useMemo, useReducer, useRef } from 'react'
import type { ReactNode } from 'react'
import { PERSIST_DEBOUNCE_MS } from './config'
import { GameContext } from './GameContext'
import { loadState, saveState } from './persistence'
import { reducer } from './reducer'

type GameProviderProps = {
  children: ReactNode
}

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

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch])

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}
