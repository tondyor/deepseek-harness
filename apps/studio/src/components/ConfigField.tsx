import type { Field } from '../types'

interface Props {
  field: Field
  value: unknown
  onChange: (value: unknown) => void
}

export default function ConfigField({ field, value, onChange }: Props) {
  const v = value ?? ''

  if (field.kind === 'boolean') {
    return (
      <div className="field">
        <label className="field-label">{field.label}</label>
        <label className="switch">
          <input type="checkbox" checked={!!v} onChange={(e) => onChange(e.target.checked)} />
          <span className="slider" />
        </label>
        {field.hint && <span className="field-hint">{field.hint}</span>}
      </div>
    )
  }

  if (field.kind === 'select') {
    return (
      <div className="field">
        <label className="field-label">{field.label}</label>
        <select className="field-select" value={String(v)} onChange={(e) => onChange(e.target.value)}>
          <option value="">—</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        {field.hint && <span className="field-hint">{field.hint}</span>}
      </div>
    )
  }

  if (field.kind === 'multiline') {
    return (
      <div className="field">
        <label className="field-label">{field.label}</label>
        <textarea
          className="field-textarea"
          rows={4}
          value={String(v)}
          onChange={(e) => onChange(e.target.value)}
        />
        {field.hint && <span className="field-hint">{field.hint}</span>}
      </div>
    )
  }

  if (field.kind === 'stringlist') {
    const items = Array.isArray(v) ? v : []
    return (
      <div className="field">
        <label className="field-label">{field.label}</label>
        {items.map((item, i) => (
          <div key={i} className="list-row">
            <input
              className="field-input mono"
              value={String(item)}
              onChange={(e) => {
                const next = [...items]
                next[i] = e.target.value
                onChange(next)
              }}
            />
            <button
              className="btn-icon danger"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
            >
              ×
            </button>
          </div>
        ))}
        <button className="btn-ghost" onClick={() => onChange([...items, ''])}>
          + добавить
        </button>
        {field.hint && <span className="field-hint">{field.hint}</span>}
      </div>
    )
  }

  if (field.kind === 'number') {
    return (
      <div className="field">
        <label className="field-label">{field.label}</label>
        <input
          className="field-input mono"
          type="number"
          min={field.min}
          max={field.max}
          value={v === '' ? '' : Number(v)}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        />
        {field.hint && <span className="field-hint">{field.hint}</span>}
      </div>
    )
  }

  return (
    <div className="field">
      <label className="field-label">{field.label}</label>
      <input
        className="field-input mono"
        type="text"
        value={String(v)}
        onChange={(e) => onChange(e.target.value)}
      />
      {field.hint && <span className="field-hint">{field.hint}</span>}
    </div>
  )
}
