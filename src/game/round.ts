import { pickRandom } from './random'
import { pickWordId } from './words'
import type { Player, RoundSetup } from './types'

/**
 * Draw the random part of a round: who the spy is and which word the
 * civilians share. Called at the dispatch site, never inside the reducer,
 * so the reducer stays pure and replayable.
 */
export function createRoundSetup(
  players: readonly Player[],
  previousWordId: string | null,
): RoundSetup {
  return {
    spyId: pickRandom(players).id,
    wordId: pickWordId(previousWordId),
  }
}
