import { useTranslation } from 'react-i18next'
import { Button } from '../components/Button'
import { CountRow } from '../components/CountRow'
import { Insert } from '../components/Insert'
import { Screen } from '../components/Screen'
import { TOPICS } from '../game/topics'
import { useGame } from '../game/useGame'
import styles from './TopicsScreen.module.css'

/**
 * The punch mark next to a topic: a scored circle while the topic is excluded,
 * the token itself once it has been pushed out of the sheet. Both states ship
 * in the same SVG and CSS decides which one is showing, so toggling a topic
 * never swaps a node.
 */
function Punch() {
  return (
    <svg className={styles.punch} viewBox="0 0 42 42" aria-hidden="true">
      <circle
        className={styles.cutLine}
        cx="21"
        cy="21"
        r="18"
        strokeWidth="2"
        strokeDasharray="5 4"
      />
      <g className={styles.punched}>
        <circle className={styles.disc} cx="21" cy="21" r="18" />
        <circle className={styles.discRing} cx="21" cy="21" r="11" strokeWidth="2.4" />
        <circle className={styles.discPip} cx="21" cy="21" r="4" />
      </g>
    </svg>
  )
}

export function TopicsScreen() {
  const { t } = useTranslation()
  const { state, dispatch } = useGame()

  const selectedCount = state.topicIds.length

  return (
    <Screen surface="board">
      <Insert title={t('topics.title')} subtitle={t('topics.subtitle')}>
        <CountRow
          className={styles.count}
          label={t('topics.heading')}
          value={t('topics.count', { current: selectedCount, total: TOPICS.length })}
        />

        <ul className={styles.list}>
          {TOPICS.map((topic) => {
            const included = state.topicIds.includes(topic.id)
            return (
              <li key={topic.id}>
                <button
                  type="button"
                  className={styles.topic}
                  aria-pressed={included}
                  disabled={included && selectedCount === 1}
                  onClick={() => dispatch({ type: 'topics/toggle', id: topic.id })}
                >
                  <Punch />
                  <span className={styles.name}>{t(topic.id, { ns: 'topics' })}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </Insert>

      <div className={styles.actions}>
        <Button size="lg" fullWidth onClick={() => dispatch({ type: 'topics/confirm' })}>
          {t('topics.continue')}
        </Button>
        <Button
          fullWidth
          variant="ghost"
          onClick={() => dispatch({ type: 'topics/back' })}
        >
          {t('back')}
        </Button>
      </div>
    </Screen>
  )
}
