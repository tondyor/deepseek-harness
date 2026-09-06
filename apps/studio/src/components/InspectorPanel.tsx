import { useStudio } from '../store'
import { catalogMap } from '../catalog'
import ConfigField from './ConfigField'

export default function InspectorPanel() {
  const selectedNodeId = useStudio((s) => s.selectedNodeId)
  const profile = useStudio((s) => s.profile)
  const togglePlugin = useStudio((s) => s.togglePlugin)
  const setConfig = useStudio((s) => s.setConfig)
  const resetPlugin = useStudio((s) => s.resetPlugin)
  const selectNode = useStudio((s) => s.selectNode)
  const removeCustom = useStudio((s) => s.removeCustom)
  const setCustomConfig = useStudio((s) => s.setCustomConfig)

  if (!selectedNodeId) {
    return (
      <aside className="panel inspector">
        <div className="panel-head">
          <h3>Inspector</h3>
        </div>
        <div className="inspector-empty">
          <p>Select a plugin on the canvas or palette to configure it.</p>
          <dl>
            <dt>Host Plane</dt>
            <dd>Process-global registries and services shared across all sessions.</dd>
            <dt>Agent Plane</dt>
            <dd>Per-session tools and capabilities the agent brings to conversations.</dd>
          </dl>
        </div>
      </aside>
    )
  }

  // Check catalog first
  const catalogPlugin = catalogMap.get(selectedNodeId)

  // Check customs
  const custom = profile.customs.find((c) => c.id === selectedNodeId)

  if (catalogPlugin) {
    const row = profile.rows[selectedNodeId]
    if (!row) return null

    return (
      <aside className="panel inspector">
        <div className="panel-head">
          <h3>Inspector</h3>
          <span className="head-badge">{catalogPlugin.group}</span>
        </div>
        <div className="inspector-scroll">
          <div className="inspector-title">{catalogPlugin.label}</div>
          <div className="inspector-npm">{catalogPlugin.npmName}</div>
          <p className="inspector-summary">{catalogPlugin.summary}</p>

          <div className="field">
            <label className="field-label">enabled</label>
            <label className="switch">
              <input
                type="checkbox"
                checked={row.enabled}
                onChange={() => togglePlugin(selectedNodeId)}
              />
              <span className="slider" />
            </label>
          </div>

          <hr className="sep" />

          {catalogPlugin.fields.length === 0 ? (
            <p className="muted">No configurable fields.</p>
          ) : (
            catalogPlugin.fields.map((field) => (
              <ConfigField
                key={field.key}
                field={field}
                value={row.config[field.key]}
                onChange={(v) => setConfig(selectedNodeId, field.key, v)}
              />
            ))
          )}

          <hr className="sep" />

          {catalogPlugin.dependencies && catalogPlugin.dependencies.length > 0 && (
            <div className="inspector-deps">
              <span className="deps-label">Dependencies</span>
              {catalogPlugin.dependencies.map((depId) => {
                const dep = catalogMap.get(depId)
                const depRow = profile.rows[depId]
                return (
                  <button
                    key={depId}
                    className="dep-link"
                    onClick={() => selectNode(depId)}
                  >
                    <span className={`dep-dot ${depRow?.enabled ? 'on' : ''}`} />
                    {dep?.label || depId}
                  </button>
                )
              })}
            </div>
          )}

          <button
            className="btn-ghost danger"
            onClick={() => resetPlugin(selectedNodeId)}
          >
            Reset to defaults
          </button>
        </div>
      </aside>
    )
  }

  if (custom) {
    return (
      <aside className="panel inspector">
        <div className="panel-head">
          <h3>Inspector</h3>
          <span className="head-badge">Custom</span>
        </div>
        <div className="inspector-scroll">
          <div className="inspector-title">{custom.label}</div>
          <p className="inspector-summary">User-defined plugin</p>

          <div className="field">
            <label className="field-label">enabled</label>
            <label className="switch">
              <input
                type="checkbox"
                checked={custom.enabled}
                onChange={() => {
                  const customs = profile.customs.map((c) =>
                    c.id === selectedNodeId ? { ...c, enabled: !c.enabled } : c
                  )
                  useStudio.setState((s) => { s.profile.customs = customs })
                }}
              />
              <span className="slider" />
            </label>
          </div>

          <div className="field">
            <label className="field-label">npm name</label>
            <input
              className="field-input mono"
              value={custom.npmName}
              onChange={(e) => {
                const customs = profile.customs.map((c) =>
                  c.id === selectedNodeId ? { ...c, npmName: e.target.value } : c
                )
                useStudio.setState((s) => { s.profile.customs = customs })
              }}
            />
          </div>

          <div className="field">
            <label className="field-label">plane</label>
            <select
              className="field-select"
              value={custom.plane}
              onChange={(e) => {
                const plane = e.target.value as 'host' | 'agent'
                const customs = profile.customs.map((c) =>
                  c.id === selectedNodeId ? { ...c, plane } : c
                )
                useStudio.setState((s) => { s.profile.customs = customs })
              }}
            >
              <option value="host">host</option>
              <option value="agent">agent</option>
            </select>
          </div>

          <div className="field">
            <label className="field-label">config (YAML)</label>
            <textarea
              className="field-textarea mono"
              rows={8}
              value={custom.configText}
              onChange={(e) => setCustomConfig(selectedNodeId, e.target.value)}
            />
          </div>

          <hr className="sep" />

          <button
            className="btn-ghost danger"
            onClick={() => removeCustom(selectedNodeId)}
          >
            Delete custom plugin
          </button>
        </div>
      </aside>
    )
  }

  return null
}
