import { useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../components/Button'
import { Screen } from '../components/Screen'
import {
  MAX_PLAYERS,
  MIN_PLAYERS,
  PLAYER_NAME_MAX_LENGTH,
  SPY_COUNT,
} from '../game/config'
import { validatePlayerName } from '../game/players'
import type { PlayerNameError } from '../game/players'
import { createId } from '../game/random'
import { canStart } from '../game/reducer'
import { createRoundSetup } from '../game/round'
import { useGame } from '../game/useGame'
import styles from './SetupScreen.module.css'

export function SetupScreen() {
  const { t } = useTranslation()
  const { state, dispatch } = useGame()
  const [name, setName] = useState('')
  const [error, setError] = useState<PlayerNameError | null>(null)

  const players = state.players
  const ready = canStart(state)
  const missing = MIN_PLAYERS - players.length

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
    dispatch({ type: 'game/start', round: createRoundSetup(players, state.wordId) })
  }

  return (
    <Screen>
      <header className={styles.header}>
        <h1 className={styles.title}>{t('setup.title')}</h1>
        <p className={styles.subtitle}>{t('setup.subtitle')}</p>
      </header>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <label className={styles.srOnly} htmlFor="player-name">
          {t('setup.nameLabel')}
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
            placeholder={t('setup.namePlaceholder')}
            maxLength={PLAYER_NAME_MAX_LENGTH}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="words"
            spellCheck={false}
            enterKeyHint="done"
          />
          <Button type="submit" disabled={players.length >= MAX_PLAYERS}>
            {t('setup.addPlayer')}
          </Button>
        </div>
        <p className={styles.error} role="alert">
          {error === null ? '' : t(`setup.errors.${error}`, { count: MAX_PLAYERS })}
        </p>
      </form>

      <section className={styles.roster}>
        <h2 className={styles.rosterHeading}>
          <span>{t('setup.playersHeading')}</span>
          <span className={styles.count}>
            {t('setup.playerCount', { current: players.length, max: MAX_PLAYERS })}
          </span>
        </h2>

        {players.length === 0 ? (
          <p className={styles.empty}>{t('setup.emptyRoster')}</p>
        ) : (
          <ul className={styles.list}>
            {players.map((player) => (
              <li key={player.id} className={styles.item}>
                <span className={styles.playerName}>{player.name}</span>
                <button
                  type="button"
                  className={styles.remove}
                  onClick={() => dispatch({ type: 'player/remove', id: player.id })}
                  aria-label={t('setup.removePlayer', { name: player.name })}
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
            ? t('setup.spyHint', { count: SPY_COUNT })
            : t('setup.needMore', { count: missing })}
        </p>
        <Button size="lg" fullWidth disabled={!ready} onClick={handleStart}>
          {t('setup.start')}
        </Button>
      </footer>
    </Screen>
  )
}
