import { useMemo, useState } from 'react';
import { useStudio, store } from '../store';
import { CATALOG, GROUPS, groupOrder } from '../catalog';

export default function CatalogPanel() {
  const state = useStudio();
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return CATALOG;
    return CATALOG.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.summary.toLowerCase().includes(term) ||
        p.id.toLowerCase().includes(term),
    );
  }, [q]);

  const groups = groupOrder
    .map((g) => ({ key: g, label: GROUPS[g], items: filtered.filter((p) => p.group === g) }))
    .filter((g) => g.items.length > 0);

  return (
    <aside className="panel catalog">
      <div className="panel-head">
        <h3>Каталог</h3>
        <input
          className="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Поиск плагина…"
        />
      </div>
      <div className="catalog-scroll">
        {groups.map((g) => (
          <div key={g.key} className="cat-group">
            <div className="cat-group-label">{g.label}</div>
            {g.items.map((p) => {
              const row = state.rows[p.id];
              const active = !!row?.enabled;
              return (
                <button
                  key={p.id}
                  className={`cat-item ${active ? 'on' : ''}`}
                  onClick={() => {
                    store.select(p.id);
                  }}
                >
                  <label
                    className="switch"
                    onClick={(e) => {
                      e.stopPropagation();
                      store.toggle(p.id);
                    }}
                  >
                    <input type="checkbox" checked={active} readOnly />
                    <span className="slider" />
                  </label>
                  <div className="cat-item-body">
                    <div className="cat-item-name">{p.name}</div>
                    <div className="cat-item-sum">{p.summary}</div>
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </aside>
  );
}