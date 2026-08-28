import React from 'react'
import type { PreviewStore } from '../store'

interface Props { store: PreviewStore }

const TABS = [
  { id: 'session', label: 'Сессия' },
  { id: 'cordis', label: 'Плагины' },
  { id: 'plan', label: 'План' },
] as const

const TIMELINE = [
  { ico: '◆', name: 'turn/start', ago: '1.2 с назад' },
  { ico: '→', name: 'agent/pre-step', ago: '1.1 с назад' },
  { ico: '⊙', name: 'llm/stream', ago: '0.9 с назад' },
  { ico: '↳', name: 'tool/call fs.read', ago: '0.8 с назад' },
  { ico: '↳', name: 'tool/result', ago: '0.4 с назад' },
  { ico: '⊙', name: 'llm/stream', ago: '0.3 с назад' },
  { ico: '↳', name: 'tool/call fs.edit', ago: '0.1 с назад' },
  { ico: '●', name: 'tools/execute', ago: 'сейчас' },
]

const PLUGINS = [
  { initials: 'FS', name: '@deepseek-ai/dsh-fs-local', ver: '0.1.0-rc.5', diff: '+12' },
  { initials: 'BA', name: '@deepseek-ai/dsh-tool-bash', ver: '0.1.0-rc.5', diff: '+4' },
  { initials: 'GP', name: '@deepseek-ai/dsh-goal-round-driver', ver: '0.1.0-rc.5', diff: '+0' },
  { initials: 'SB', name: '@deepseek-ai/dsh-skill-filesystem', ver: '0.1.0-rc.5', diff: '+0' },
  { initials: 'TP', name: '@deepseek-ai/dsh-tool-todo', ver: '0.1.0-rc.5', diff: '+0' },
  { initials: 'CT', name: '@deepseek-ai/dsh-compaction-tool-pruner', ver: '0.1.0-rc.5', diff: '+0' },
  { initials: 'SC', name: '@deepseek-ai/dsh-session', ver: '0.1.0-rc.5', diff: '+0' },
  { initials: 'AG', name: '@deepseek-ai/dsh-agent', ver: '0.1.0-rc.5', diff: '+0' },
  { initials: 'LL', name: '@deepseek-ai/dsh-llm', ver: '0.1.0-rc.5', diff: '+0' },
  { initials: 'SY', name: '@deepseek-ai/dsh-system-prompt', ver: '0.1.0-rc.5', diff: '+0' },
  { initials: 'PR', name: '@deepseek-ai/dsh-persona', ver: '0.1.0-rc.5', diff: '+0' },
  { initials: 'ST', name: '@deepseek-ai/dsh-storage', ver: '0.1.0-rc.5', diff: '+0' },
]

export function RightPanel({ store }: Props): React.ReactElement {
  if (!store.rightOpen) return <aside className="rightbar" style={{ display: 'none' }} />

  return (
    <aside className="rightbar">
      <div className="right-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={store.rightTab === t.id ? 'active' : ''}
            onClick={() => store.setRightTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {store.rightTab === 'session' && (
        <>
          <div className="right-section">
            <h4>Сессия</h4>
            <div className="kv">
              <div className="k">session id</div>
              <div className="v">sess_8a4f2c1d…</div>
              <div className="k">профиль</div>
              <div className="v pill">web · standard</div>
              <div className="k">модель</div>
              <div className="v">deepseek-chat</div>
              <div className="k">запущена</div>
              <div className="v">2 мин назад</div>
            </div>
          </div>

          <div className="right-section">
            <h4>Расход токенов</h4>
            <div className="bar">
              <span style={{ width: 30 }}>контекст</span>
              <div className="track"><div className="fill" style={{ width: '14%' }} /></div>
              <span className="val">2.1k / 128k</span>
            </div>
            <div className="bar">
              <span style={{ width: 30 }}>вывод</span>
              <div className="track"><div className="fill" style={{ width: '3%' }} /></div>
              <span className="val">412 / 8k</span>
            </div>
            <div className="bar">
              <span style={{ width: 30 }}>кэш</span>
              <div className="track"><div className="fill" style={{ width: '40%' }} /></div>
              <span className="val">попадание 78%</span>
            </div>
          </div>

          <div className="right-section">
            <h4>Поток событий</h4>
            <div className="timeline">
              {TIMELINE.map((t, i) => (
                <div key={i} className="tl-item">
                  <span className="ico">{t.ico}</span>
                  <span className="name">{t.name}</span>
                  <span className="ago">{t.ago}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {store.rightTab === 'cordis' && (
        <div className="right-section">
          <h4>Загруженные плагины ({PLUGINS.length})</h4>
          {PLUGINS.map((p) => (
            <div key={p.name} className="plugin-card">
              <div className="pico">{p.initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="pname" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                <div className="pver">{p.ver}</div>
              </div>
              {p.diff !== '+0' && <span className="pdiff">{p.diff}</span>}
            </div>
          ))}
        </div>
      )}

      {store.rightTab === 'plan' && (
        <div className="right-section">
          <h4>Режим планирования</h4>
          <div className="kv">
            <div className="k">цель</div>
            <div className="v" style={{ fontFamily: 'var(--dsw-font-family)' }}>Включить cleanUrls и вынести shiki в отдельный chunk в vite.config</div>
            <div className="k">шаги</div>
            <div className="v" style={{ fontFamily: 'var(--dsw-font-family)' }}>3 / 5</div>
          </div>
          <ol style={{ margin: '10px 0 0 0', padding: '0 0 0 18px', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            <li>Прочитать apps/web/vite.config.ts</li>
            <li>Включить cleanUrls</li>
            <li><b>Вынести shiki в chunk highlight</b> (выполняется)</li>
            <li>pnpm --filter @deepseek-ai/dsh-web-frontend build</li>
            <li>Воспроизвести snapshot</li>
          </ol>
        </div>
      )}
    </aside>
  )
}
