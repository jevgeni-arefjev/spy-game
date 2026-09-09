import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../components/Button'
import { CountRow } from '../components/CountRow'
import { Insert } from '../components/Insert'
import { Screen } from '../components/Screen'
import {
  MAX_PLAYERS,
  MIN_PLAYERS,
  PLAYER_NAME_MAX_LENGTH,
} from '../game/config'
import { validatePlayerName } from '../game/players'
import type { PlayerNameError } from '../game/players'
import { createId } from '../game/random'
import { canStart } from '../game/reducer'
import { createRoundSetup } from '../game/round'
import { useGame } from '../game/useGame'
import styles from './PlayersScreen.module.css'

/** The three drawn marks this screen needs, all one stroke weight. */
function MinusIcon() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M3 9h12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M3 9h12M9 3v12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function RemoveIcon() {
  return (
    <svg viewBox="0 0 14 14" aria-hidden="true">
      <path
        d="M2 2l10 10M12 2L2 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function PlayersScreen() {
  const { t } = useTranslation()
  const { state, dispatch } = useGame()
  const [name, setName] = useState('')
  const [error, setError] = useState<PlayerNameError | null>(null)

  const players = state.players
  const ready = canStart(state)
  const missing = MIN_PLAYERS - players.length

  // A persisted session (or one edited by hand) can land here with more spies
  // than players; pull it back into range as soon as the screen shows.
  useEffect(() => {
    if (players.length >= 1 && state.spyCount > players.length) {
      dispatch({ type: 'spyCount/set', value: players.length })
    }
  }, [players.length, state.spyCount, dispatch])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const result = validatePlayerName(name, players)
    if (!result.ok) {
      setError(result.error)
      return
    }

    dispatch({ type: 'player/add', player: { id: createId(), name: result.name } })
    setName('')
    setError(null)
  }

  const handleStart = () => {
    dispatch({
      type: 'game/start',
      round: createRoundSetup(players, state.topicIds, state.wordId, state.spyCount),
    })
  }

  return (
    <Screen surface="board">
      <Insert
        title={t('players.title')}
        subtitle={t('players.subtitle', { count: state.spyCount })}
      >
        <form className={styles.addRow} onSubmit={handleSubmit} noValidate>
          <label className={styles.srOnly} htmlFor="player-name">
            {t('players.nameLabel')}
          </label>
          <input
            id="player-name"
            className={styles.input}
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              setError(null)
            }}
            placeholder={t('players.namePlaceholder')}
            maxLength={PLAYER_NAME_MAX_LENGTH}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="words"
            spellCheck={false}
            enterKeyHint="done"
          />
          <Button
            type="submit"
            variant="quiet"
            className={styles.addButton}
            disabled={players.length >= MAX_PLAYERS}
          >
            {t('players.addPlayer')}
          </Button>
        </form>

        <p className={styles.error} role="alert">
          {error === null ? '' : t(`players.errors.${error}`, { count: MAX_PLAYERS })}
        </p>

        <div className={styles.spies} role="group" aria-labelledby="spy-count-label">
          <span id="spy-count-label" className={styles.spiesLabel}>
            {t('players.spyCountLabel')}
          </span>
          <span className={styles.stepper}>
            <button
              type="button"
              className={styles.step}
              aria-label={t('players.fewerSpies')}
              disabled={state.spyCount <= 1}
              onClick={() =>
                dispatch({ type: 'spyCount/set', value: state.spyCount - 1 })
              }
            >
              <MinusIcon />
            </button>
            <span className={styles.stepValue} aria-live="polite">
              {state.spyCount}
            </span>
            <button
              type="button"
              className={styles.step}
              aria-label={t('players.moreSpies')}
              disabled={state.spyCount >= players.length}
              onClick={() =>
                dispatch({ type: 'spyCount/set', value: state.spyCount + 1 })
              }
            >
              <PlusIcon />
            </button>
          </span>
        </div>

        <CountRow
          className={styles.count}
          label={t('players.playersHeading')}
          value={t('players.playerCount', {
            current: players.length,
            max: MAX_PLAYERS,
          })}
        />

        <div className={styles.rack}>
          {players.length === 0 ? (
            <p className={styles.empty}>{t('players.emptyRoster')}</p>
          ) : (
            <ul className={styles.tiles}>
              {players.map((player) => (
                <li key={player.id} className={styles.tile}>
                  <span className={styles.playerName}>{player.name}</span>
                  <button
                    type="button"
                    className={styles.remove}
                    onClick={() => dispatch({ type: 'player/remove', id: player.id })}
                    aria-label={t('players.removePlayer', { name: player.name })}
                  >
                    <RemoveIcon />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className={styles.hint}>
          {ready
            ? t('players.spyHint', { count: state.spyCount })
            : t('players.needMore', { count: missing })}
        </p>
      </Insert>

      <div className={styles.actions}>
        <Button size="lg" fullWidth disabled={!ready} onClick={handleStart}>
          {t('players.start')}
        </Button>
        <Button
          fullWidth
          variant="ghost"
          onClick={() => dispatch({ type: 'players/back' })}
        >
          {t('back')}
        </Button>
      </div>
    </Screen>
  )
}
