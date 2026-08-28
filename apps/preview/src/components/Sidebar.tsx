import React from 'react'
import { PreviewStore } from './store'

interface Props { store: PreviewStore }

const SESSION_GROUPS = [
  {
    label: 'Сегодня',
    items: [
      { id: 's1', title: 'Перенести vite.config в pnpm-workspace', live: true },
      { id: 's2', title: 'Добавить property-тесты на fast-check для typert-генератора' },
      { id: 's3', title: 'Расследовать race на cancellation в agent-loop' },
    ],
  },
  {
    label: 'Вчера',
    items: [
      { id: 's4', title: 'Рефакторинг конвейера делегации subagent' },
      { id: 's5', title: 'Бенчмарк параметров сжатия session-log' },
    ],
  },
  {
    label: 'На этой неделе',
    items: [
      { id: 's6', title: 'Черновик release notes для cordis 1.6' },
      { id: 's7', title: 'Изоляция shell provider в песочнице' },
    ],
  },
]

export function Sidebar({ store }: Props): React.ReactElement {
  return (
    <aside className="sidebar">
      <div className="sb-brand">
        <div className="logo">DS</div>
        <span>DeepSeek Harness</span>
        <span className="tag">Превью</span>
      </div>

      <button className="sb-new" onClick={() => store.newSession()}>
        <span aria-hidden>＋</span>
        <span>Новая сессия</span>
        <span className="kbd">⌘N</span>
      </button>

      <div className="sb-search">
        <span aria-hidden>⌕</span>
        <span>Поиск по сессиям…</span>
      </div>

      <div style={{ overflowY: 'auto', flex: 1, paddingBottom: 8 }}>
        {SESSION_GROUPS.map((group) => (
          <div key={group.label}>
            <div className="sb-group-label">{group.label}</div>
            <div className="sb-list">
              {group.items.map((item) => (
                <div
                  key={item.id}
                  className={[
                    'sb-item',
                    item.live ? 'live' : '',
                    store.activeId === item.id ? 'active' : '',
                  ].join(' ').trim()}
                  onClick={() => store.select(item.id, item.title)}
                >
                  <span className="dot" />
                  <span className="title">{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="sb-footer">
        <div className="avatar">A</div>
        <div className="who">
          <div className="name">anon-user-7f3a</div>
          <div className="sub">
            <span className="pill">pro</span>
            <span>локально · SQLite</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
