import { pickSample } from './random'
import { wordIdsForTopics } from './topics'
import { pickWordId } from './words'
import type { Player, RoundSetup } from './types'

/**
 * Draw the random part of a round: who the spies are and which word the
 * civilians share. `spyCount` comes from `GameState` (set on the Players
 * screen); the word is drawn from the union of the selected topics. Called at
 * the dispatch site, never inside the reducer, so the reducer stays pure and
 * replayable.
 */
export function createRoundSetup(
  players: readonly Player[],
  topicIds: readonly string[],
  previousWordId: string | null,
  spyCount: number,
): RoundSetup {
  return {
    spyIds: pickSample(players, spyCount).map((player) => player.id),
    wordId: pickWordId(wordIdsForTopics(topicIds), previousWordId),
  }
}
