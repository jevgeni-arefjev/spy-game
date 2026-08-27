import { SPY_COUNT } from './config'
import { pickSample } from './random'
import { pickWordId } from './words'
import type { Player, RoundSetup } from './types'

/**
 * Draw the random part of a round: who the spies are and which word the
 * civilians share. Called at the dispatch site, never inside the reducer,
 * so the reducer stays pure and replayable.
 */
export function createRoundSetup(
  players: readonly Player[],
  previousWordId: string | null,
): RoundSetup {
  return {
    spyIds: pickSample(players, SPY_COUNT).map((player) => player.id),
    wordId: pickWordId(previousWordId),
  }
}
