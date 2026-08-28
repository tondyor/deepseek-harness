type Theme = 'light' | 'dark'
type Tab = 'session' | 'cordis' | 'plan'

export class PreviewStore {
  theme: Theme = 'light'
  model = 'deepseek-chat'
  activeId = 's1'
  activeTitle = '迁移 vite.config 到 pnpm workspace'
  status = 'выполняется · вызов инструмента'
  rightOpen = true
  rightTab: Tab = 'session'

  private listeners = new Set<() => void>()

  subscribe(fn: () => void): () => void {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  private emit(): void { for (const fn of this.listeners) fn() }

  toggleTheme(): void {
    this.theme = this.theme === 'light' ? 'dark' : 'light'
    this.emit()
  }

  setModel(id: string): void {
    this.model = id
    this.emit()
  }

  select(id: string, title: string): void {
    this.activeId = id
    this.activeTitle = title
    this.emit()
  }

  newSession(): void {
    this.activeId = `tmp-${Date.now()}`
    this.activeTitle = '新会话'
    this.emit()
  }

  toggleRight(): void {
    this.rightOpen = !this.rightOpen
    this.emit()
  }

  setRightTab(tab: Tab): void {
    this.rightTab = tab
    this.rightOpen = true
    this.emit()
  }
}
