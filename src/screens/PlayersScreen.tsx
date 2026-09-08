import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../components/Button'
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
    <Screen>
      <header className={styles.header}>
        <h1 className={styles.title}>{t('players.title')}</h1>
        <p className={styles.subtitle}>
          {t('players.subtitle', { count: state.spyCount })}
        </p>
      </header>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <label className={styles.srOnly} htmlFor="player-name">
          {t('players.nameLabel')}
        </label>
        <div className={styles.inputRow}>
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
          <Button type="submit" disabled={players.length >= MAX_PLAYERS}>
            {t('players.addPlayer')}
          </Button>
        </div>
        <p className={styles.error} role="alert">
          {error === null ? '' : t(`players.errors.${error}`, { count: MAX_PLAYERS })}
        </p>
      </form>

      <div className={styles.spies}>
        <span id="spy-count-label" className={styles.spiesLabel}>
          {t('players.spyCountLabel')}
        </span>
        <div
          className={styles.stepper}
          role="group"
          aria-labelledby="spy-count-label"
        >
          <Button
            variant="secondary"
            aria-label={t('players.fewerSpies')}
            disabled={state.spyCount <= 1}
            onClick={() =>
              dispatch({ type: 'spyCount/set', value: state.spyCount - 1 })
            }
          >
            <span aria-hidden="true">&minus;</span>
          </Button>
          <span className={styles.stepperValue} aria-live="polite">
            {state.spyCount}
          </span>
          <Button
            variant="secondary"
            aria-label={t('players.moreSpies')}
            disabled={state.spyCount >= players.length}
            onClick={() =>
              dispatch({ type: 'spyCount/set', value: state.spyCount + 1 })
            }
          >
            <span aria-hidden="true">+</span>
          </Button>
        </div>
      </div>

      <section className={styles.roster}>
        <h2 className={styles.rosterHeading}>
          <span>{t('players.playersHeading')}</span>
          <span className={styles.count}>
            {t('players.playerCount', { current: players.length, max: MAX_PLAYERS })}
          </span>
        </h2>

        {players.length === 0 ? (
          <p className={styles.empty}>{t('players.emptyRoster')}</p>
        ) : (
          <ul className={styles.list}>
            {players.map((player) => (
              <li key={player.id} className={styles.item}>
                <span className={styles.playerName}>{player.name}</span>
                <button
                  type="button"
                  className={styles.remove}
                  onClick={() => dispatch({ type: 'player/remove', id: player.id })}
                  aria-label={t('players.removePlayer', { name: player.name })}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className={styles.footer}>
        <p className={styles.hint}>
          {ready
            ? t('players.spyHint', { count: state.spyCount })
            : t('players.needMore', { count: missing })}
        </p>
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
      </footer>
    </Screen>
  )
}
