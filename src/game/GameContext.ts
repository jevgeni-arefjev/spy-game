import { createContext } from 'react'
import type { Dispatch } from 'react'
import type { Action, GameState } from './types'

export type GameContextValue = {
  state: GameState
  dispatch: Dispatch<Action>
}

export const GameContext = createContext<GameContextValue | null>(null)
