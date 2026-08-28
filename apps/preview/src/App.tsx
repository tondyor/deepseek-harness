import React from 'react'
import './styles.css'
import './layout.css'
import './sidebar.css'
import './topbar.css'
import './chat.css'
import './rightbar.css'

import { Sidebar } from './components/Sidebar'
import { TopBar } from './components/TopBar'
import { ChatArea } from './components/ChatArea'
import { RightPanel } from './components/RightPanel'
import { PreviewStore } from './store'

export function App(): React.ReactElement {
  const store = React.useMemo(() => new PreviewStore(), [])

  React.useEffect(() => {
    document.documentElement.dataset.theme = store.theme
  }, [store.theme])

  return (
    <div className="app">
      <Sidebar store={store} />
      <div className="center">
        <TopBar store={store} />
        <ChatArea store={store} />
      </div>
      <RightPanel store={store} />
    </div>
  )
}
