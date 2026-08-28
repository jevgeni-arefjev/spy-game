import { SPY_COUNT } from './config'
import { pickSample } from './random'
import { wordIdsForTopics } from './topics'
import { pickWordId } from './words'
import type { Player, RoundSetup } from './types'

/**
 * Draw the random part of a round: who the spies are and which word the
 * civilians share. The word is drawn from the union of the selected topics.
 * Called at the dispatch site, never inside the reducer, so the reducer stays
 * pure and replayable.
 */
export function createRoundSetup(
  players: readonly Player[],
  topicIds: readonly string[],
  previousWordId: string | null,
): RoundSetup {
  return {
    spyIds: pickSample(players, SPY_COUNT).map((player) => player.id),
    wordId: pickWordId(wordIdsForTopics(topicIds), previousWordId),
  }
}
