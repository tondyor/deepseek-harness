import React from 'react'
import type { PreviewStore } from '../store'

interface Props { store: PreviewStore }

const MODELS = [
  { id: 'deepseek-chat', label: 'DeepSeek-V3.1', sub: 'чат · 128k' },
  { id: 'deepseek-reasoner', label: 'DeepSeek-R1', sub: 'рассуждения · 64k' },
  { id: 'mock', label: 'Mock (offline)', sub: 'эхо · ∞' },
]

export function TopBar({ store }: Props): React.ReactElement {
  const [modelOpen, setModelOpen] = React.useState(false)
  const current = MODELS.find((m) => m.id === store.model) ?? MODELS[0]

  return (
    <header className="topbar">
      <div className="title">{store.activeTitle}</div>
      <span className="status">
        <span className="pulse" />
        {store.status}
      </span>

      <div className="actions">
        <div style={{ position: 'relative' }}>
          <button
            className="model-pill"
            onClick={() => setModelOpen((v) => !v)}
            aria-label="Выбрать модель"
          >
            <span className="swatch" />
            <span>{current.label}</span>
            <span style={{ color: 'var(--text-tertiary)' }}>▾</span>
          </button>
          {modelOpen && (
            <div
              style={{
                position: 'absolute', top: 34, right: 0, zIndex: 20,
                background: 'var(--bg-app)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)',
                minWidth: 220, padding: 4,
              }}
            >
              {MODELS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => { store.setModel(m.id); setModelOpen(false) }}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                    width: '100%', padding: '6px 8px', borderRadius: 'var(--radius-sm)',
                    textAlign: 'left',
                    color: m.id === store.model ? 'var(--text-accent)' : 'var(--text-primary)',
                    background: m.id === store.model ? 'var(--bg-active)' : 'transparent',
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 500 }}>{m.label}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{m.sub}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="iconbtn" aria-label="Поделиться">⎘</button>
        <button className="iconbtn" aria-label="Панель инструментов" onClick={() => store.toggleRight()}>
          {store.rightOpen ? '▮▯' : '⚙'}
        </button>
        <button
          className="iconbtn"
          aria-label="Тема"
          onClick={() => store.toggleTheme()}
        >
          {store.theme === 'dark' ? '☾' : '☀'}
        </button>
      </div>
    </header>
  )
}
