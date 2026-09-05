import { useMemo } from 'react';
import { useStudio, store } from '../store';
import { CATALOG } from '../catalog';

const ROLE_LABEL: Record<string, string> = {
  core: 'ядро',
  tool: 'tool',
  capability: 'capability',
  policy: 'policy',
  storage: 'storage',
};

export default function CompositionPanel() {
  const state = useStudio();

  const active = useMemo(() => {
    const ml: typeof CATALOG = [];
    for (const p of CATALOG) {
      if (state.rows[p.id]?.enabled) ml.push(p);
    }
    const host = ml.filter((p) => !['tool', 'capability'].includes(p.role));
    const agent = ml.filter((p) => ['tool', 'capability'].includes(p.role));
    return { host, agent };
  }, [state.rows]);

  return (
    <main className="panel composition">
      <div className="panel-head">
        <h3>Композиция</h3>
        <span className="sub">
          {active.host.length + active.agent.length} строк · host-plane + agent-plane
        </span>
      </div>
      <div className="comp-scroll">
        <Section
          title="Host plane"
          hint="Процесс-синглтоны: реестры, спин-сервисы, политики"
          items={active.host}
          selected={state.selected}
        />
        <Section
          title="Agent plane"
          hint="Что агент вносит: tools и per-session capabilities"
          items={active.agent}
          selected={state.selected}
        />

        {state.customs.length > 0 && (
          <div className="comp-section">
            <div className="comp-section-label">Custom rows</div>
            {state.customs.map((c) => (
              <div
                key={c.id}
                className={`comp-item custom ${state.selected === c.id ? 'sel' : ''} ${!c.enabled ? 'off' : ''}`}
                onClick={() => store.select(c.id)}
              >
                <span className="role">custom</span>
                <span className="cname">{c.name || c.id}</span>
                <button
                  className="mini-del"
                  title="Удалить"
                  onClick={(e) => {
                    e.stopPropagation();
                    store.removeCustom(c.id);
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="comp-add">
          <button
            className="btn ghost"
            onClick={() => store.addCustom('my-plugin')}
          >
            + Добавить свой плагин
          </button>
        </div>
      </div>
    </main>
  );
}

function Section({
  title,
  hint,
  items,
  selected,
}: {
  title: string;
  hint: string;
  items: typeof CATALOG;
  selected: string | null;
}) {
  return (
    <div className="comp-section">
      <div className="comp-section-label">
        {title}
        <span className="plane-hint">{hint}</span>
      </div>
      {items.map((p) => {
        const row = store.getSnapshot().rows[p.id];
        return (
          <div
            key={p.id}
            className={`comp-item ${selected === p.id ? 'sel' : ''}`}
            onClick={() => store.select(p.id)}
          >
            <span className={`role ${p.role}`}>{ROLE_LABEL[p.role] ?? p.role}</span>
            <span className="cname">{p.name}</span>
            {p.fields.length > 0 && (
              <span className="chips">
                {p.fields.map((f) => (
                  <span key={f.key} className="chip" title={`${f.label}: ${String(row.config[f.key] ?? '')}`}>
                    {f.label}={String(row.config[f.key] ?? '')}
                  </span>
                ))}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}