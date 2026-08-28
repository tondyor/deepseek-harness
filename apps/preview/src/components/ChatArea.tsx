import React from 'react'
import type { PreviewStore } from '../store'

interface Props { store: PreviewStore }

interface Message {
  id: string
  role: 'user' | 'assistant'
  who: string
  body: React.ReactNode
  tool?: { name: string; status: 'running' | 'done'; args: React.ReactNode }
  typing?: boolean
}

const SCRIPTED: Message[] = [
  {
    id: 'm1', role: 'user', who: 'Вы',
    body: (
      <>
        В <code>apps/web/vite.config.ts</code> включи <code>cleanUrls: true</code> и вынеси <code>shiki</code> из <code>manualChunks</code> в отдельный vendor-chunk.
      </>
    ),
  },
  {
    id: 'm2', role: 'assistant', who: 'DeepSeek-V3.1', body: 'Хорошо, сначала прочитаю текущий конфиг:',
    tool: {
      name: 'fs.read',
      status: 'done',
      args: (
        <>
          <span className="k">path</span>=<span style={{ color: 'var(--text-secondary)' }}>"apps/web/vite.config.ts"</span>
        </>
      ),
    },
  },
  {
    id: 'm3', role: 'assistant', who: 'DeepSeek-V3.1',
    body: (
      <>
        Сейчас в vendor-chunk входят <code>shiki</code>, <code>mdast-util-*</code> и <code>katex</code> — это тяжёлые зависимости, которые workspace импортирует напрямую. Сделаю две вещи:
        {'\n\n'}
        1. Включу <code>cleanUrls</code>, чтобы <code>/guide/quickstart</code> отдавался без <code>.html</code>.
        {'\n'}
        2. Вынесу <code>shiki</code> из <code>vendor</code> chunk в отдельный <code>highlight</code> — он подгружается только при рендере markdown.
      </>
    ),
    tool: {
      name: 'fs.edit',
      status: 'running',
      args: (
        <>
          <span className="k">path</span>=<span style={{ color: 'var(--text-secondary)' }}>"apps/web/vite.config.ts"</span>{' '}
          <span className="k">old</span>=<span style={{ color: 'var(--text-secondary)' }}>"cleanUrls: false"</span>{' '}
          <span className="k">new</span>=<span style={{ color: 'var(--text-secondary)' }}>"cleanUrls: true"</span>
        </>
      ),
    },
  },
  {
    id: 'm4', role: 'assistant', who: 'DeepSeek-V3.1',
    body: '…записываю патч, применяю',
    typing: true,
  },
]

export function ChatArea({ store }: Props): React.ReactElement {
  return (
    <main className="chat">
      <div className="chat-scroll">
        <div className="chat-inner">
          <div className="turn-meta">
            <span className="chip">шаг 4 · выполняется вызов инструмента</span>
          </div>

          {SCRIPTED.map((m) => (
            <div key={m.id} className={`msg ${m.role}`}>
              <div className="avatar">{m.role === 'user' ? 'U' : 'D'}</div>
              <div className="body">
                <div className="who">
                  {m.who}
                  <span className="role">{m.role === 'user' ? 'пользователь' : 'ассистент'}</span>
                </div>
                <div className="text">{m.body}</div>
                {m.tool && (
                  <div className="tool-call">
                    <div className="head">
                      <span className="icon">●</span>
                      <span className="name">{m.tool.name}</span>
                      <span className="badge">
                        {m.tool.status === 'done' ? 'готово' : 'выполняется'}
                      </span>
                    </div>
                    <div className="body args">{m.tool.args}</div>
                  </div>
                )}
                {m.typing && (
                  <div className="typing"><span /><span /><span /></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="composer-wrap">
        <div className="composer">
          <div className="ph">Опишите задачу или вставьте код / сообщение об ошибке…</div>
          <div className="row">
            <span className="chip">@files</span>
            <span className="chip">@bash</span>
            <span className="chip">/plan</span>
            <span className="chip">/model</span>
            <button className="send" aria-label="Отправить">↑</button>
          </div>
        </div>
        <div className="footnote">
          DeepSeek Harness · вызовы инструментов проходят подтверждение. Enter — отправить, Shift+Enter — перенос строки.
        </div>
      </div>
    </main>
  )
}
