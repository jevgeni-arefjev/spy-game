import { useContext } from 'react'
import { GameContext } from './GameContext'
import type { GameContextValue } from './GameContext'

export function useGame(): GameContextValue {
  const value = useContext(GameContext)
  if (value === null) {
    throw new Error('useGame must be used inside <GameProvider>')
  }
  return value
}
