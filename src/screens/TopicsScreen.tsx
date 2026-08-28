import { useTranslation } from 'react-i18next'
import { Button } from '../components/Button'
import { Screen } from '../components/Screen'
import { TOPICS } from '../game/topics'
import { useGame } from '../game/useGame'
import styles from './TopicsScreen.module.css'

export function TopicsScreen() {
  const { t } = useTranslation()
  const { state, dispatch } = useGame()

  const selectedCount = state.topicIds.length

  return (
    <Screen>
      <header className={styles.header}>
        <h1 className={styles.title}>{t('topics.title')}</h1>
        <p className={styles.subtitle}>{t('topics.subtitle')}</p>
      </header>

      <section className={styles.list}>
        <h2 className={styles.heading}>
          <span>{t('topics.heading')}</span>
          <span className={styles.count}>
            {t('topics.count', { current: selectedCount, total: TOPICS.length })}
          </span>
        </h2>

        <ul className={styles.options}>
          {TOPICS.map((topic) => {
            const included = state.topicIds.includes(topic.id)
            return (
              <li key={topic.id}>
                <Button
                  fullWidth
                  variant={included ? 'primary' : 'secondary'}
                  aria-pressed={included}
                  disabled={included && selectedCount === 1}
                  onClick={() => dispatch({ type: 'topics/toggle', id: topic.id })}
                >
                  {t(topic.id, { ns: 'topics' })}
                </Button>
              </li>
            )
          })}
        </ul>
      </section>

      <footer className={styles.footer}>
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
      </footer>
    </Screen>
  )
}
