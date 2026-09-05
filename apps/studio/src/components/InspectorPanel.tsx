import { useStudio, store } from '../store';
import { byId } from '../catalog';

export default function InspectorPanel() {
  const state = useStudio();

  const isCustom = state.customs.some((c) => c.id === state.selected);
  const custom = state.customs.find((c) => c.id === state.selected);
  const plugin = !isCustom && state.selected ? byId.get(state.selected) : null;

  if (isCustom && custom) {
    return (
      <aside className="panel inspector">
        <div className="panel-head">
          <h3>Инспектор</h3>
          <span className="sub">custom row</span>
        </div>
        <div className="insp-scroll">
          <Field label="id" value={custom.id} readOnly />
          <Field
            label="name"
            value={custom.name}
            onChange={(v) => store.setCustomName(custom.id, v)}
          />
          <div className="fld">
            <span className="fld-label">enabled</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={custom.enabled}
                onChange={() => store.toggleCustom(custom.id)}
              />
              <span className="slider" />
            </label>
          </div>
          <div className="fld">
            <span className="fld-label">config (YAML строка)</span>
            <textarea
              className="mono"
              rows={12}
              value={custom.configText}
              onChange={(e) => store.setCustomText(custom.id, e.target.value)}
              placeholder={'config:\n  key: value'}
            />
          </div>
          <button
            className="btn danger"
            onClick={() => store.removeCustom(custom.id)}
          >
            Удалить строку
          </button>
        </div>
      </aside>
    );
  }

  if (!plugin) {
    return (
      <aside className="panel inspector">
        <div className="panel-head">
          <h3>Инспектор</h3>
        </div>
        <div className="insp-scroll empty">
          <p>
            Выберите плагин в каталоге или композиции, чтобы настроить его
            параметры. Значения собираются в <code>cordis.patch.yml</code>.
          </p>
          <dl>
            <dt>Host plane</dt>
            <dd>Реестры и спин-сервисы процесса — доступает их каждая сессия.</dd>
            <dt>Agent plane</dt>
            <dd>Tools и per-session capabilities, что агент вносит в реестры.</dd>
          </dl>
        </div>
      </aside>
    );
  }

  const row = state.rows[plugin.id];

  return (
    <aside className="panel inspector">
      <div className="panel-head">
        <h3>Инспектор</h3>
        <span className="sub">{plugin.group}</span>
      </div>
      <div className="insp-scroll">
        <div className="insp-title">{plugin.name}</div>
        <p className="insp-sum">{plugin.summary}</p>

        <div className="fld">
          <span className="fld-label">enabled</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={row.enabled}
              onChange={() => store.toggle(plugin.id)}
            />
            <span className="slider" />
          </label>
        </div>

        <hr className="sep" />

        {plugin.fields.length === 0 ? (
          <p className="muted">Плагин без настраиваемых полей.</p>
        ) : (
          plugin.fields.map((f) => {
            const val = row.config[f.key];
            return (
              <div key={f.key} className="field-group">
                <FieldRow field={f} value={val} pluginId={plugin.id} />
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}

function Field({
  label,
  value,
  onChange,
  readOnly,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="fld">
      <span className="fld-label">{label}</span>
      <input
        className="mono"
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}

function FieldRow({
  field,
  value,
  pluginId,
}: {
  field: import('../types').Field;
  value: unknown;
  pluginId: string;
}) {
  const set = (v: unknown) => store.setConfig(pluginId, field.key, v);

  if (field.kind === 'boolean') {
    return (
      <div className="fld">
        <span className="fld-label">{field.label}</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => set(e.target.checked)}
          />
          <span className="slider" />
        </label>
        {field.hint && <span className="hint">{field.hint}</span>}
      </div>
    );
  }

  if (field.kind === 'number') {
    return (
      <div className="fld">
        <span className="fld-label">{field.label}</span>
        <input
          className="mono"
          type="number"
          value={Number(value ?? 0)}
          onChange={(e) => set(Number(e.target.value))}
        />
        {field.hint && <span className="hint">{field.hint}</span>}
      </div>
    );
  }

  if (field.kind === 'select') {
    return (
      <div className="fld">
        <span className="fld-label">{field.label}</span>
        <select
          className="mono"
          value={String(value ?? '')}
          onChange={(e) => set(e.target.value)}
        >
          {(field.options ?? []).map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        {field.hint && <span className="hint">{field.hint}</span>}
      </div>
    );
  }

  if (field.kind === 'multiline') {
    return (
      <div className="fld">
        <span className="fld-label">{field.label}</span>
        <textarea
          className="mono"
          rows={6}
          value={String(value ?? '')}
          onChange={(e) => set(e.target.value)}
        />
        {field.hint && <span className="hint">{field.hint}</span>}
      </div>
    );
  }

  if (field.kind === 'stringlist') {
    const list = Array.isArray(value) ? (value as string[]) : [];
    return (
      <div className="fld">
        <span className="fld-label">{field.label}</span>
        {list.map((item, i) => (
          <div key={i} className="list-row">
            <input
              className="mono"
              value={item}
              onChange={(e) => {
                const next = [...list];
                next[i] = e.target.value;
                set(next);
              }}
            />
            <button
              className="mini-del"
              onClick={() => set(list.filter((_, j) => j !== i))}
            >
              ×
            </button>
          </div>
        ))}
        <button className="btn ghost" onClick={() => set([...list, ''])}>
          + добавить
        </button>
        {field.hint && <span className="hint">{field.hint}</span>}
      </div>
    );
  }

  return (
    <div className="fld">
      <span className="fld-label">{field.label}</span>
      <input
        className="mono"
        value={String(value ?? '')}
        onChange={(e) => set(e.target.value)}
      />
      {field.hint && <span className="hint">{field.hint}</span>}
    </div>
  );
}