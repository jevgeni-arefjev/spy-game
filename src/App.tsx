import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useGame } from './game/useGame'
import { syncThemeColor } from './lib/themeColor'
import { DiscussionScreen } from './screens/DiscussionScreen'
import { EndedScreen } from './screens/EndedScreen'
import { RevealScreen } from './screens/RevealScreen'
import { SetupScreen } from './screens/SetupScreen'

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
    case 'setup':
      return <SetupScreen />
    case 'reveal':
      return <RevealScreen />
    case 'discussion':
      return <DiscussionScreen />
    case 'ended':
      return <EndedScreen />
  }
}

export default App
