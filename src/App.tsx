import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useGame } from './game/useGame'
import { syncThemeColor } from './lib/themeColor'
import { DiscussionScreen } from './screens/DiscussionScreen'
import { EndedScreen } from './screens/EndedScreen'
import { HomeScreen } from './screens/HomeScreen'
import { PlayersScreen } from './screens/PlayersScreen'
import { RevealScreen } from './screens/RevealScreen'
import { TopicsScreen } from './screens/TopicsScreen'

/**
 * The whole app is one state machine. There is no router on purpose: phase
 * drives what renders, which keeps this working from a `file://` webview when
 * it gets wrapped in a native shell.
 */
function App() {
  const { t } = useTranslation()
  const { state } = useGame()

  useEffect(() => {
    document.title = t('app.title')
  }, [t])

  useEffect(syncThemeColor, [])

  switch (state.phase) {
    case 'home':
      return <HomeScreen />
    case 'topics':
      return <TopicsScreen />
    case 'players':
      return <PlayersScreen />
    case 'reveal':
      return <RevealScreen />
    case 'discussion':
      return <DiscussionScreen />
    case 'ended':
      return <EndedScreen />
  }
}

export default App
