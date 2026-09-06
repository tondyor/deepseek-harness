import type { DragEvent as ReactDragEvent } from 'react'
import { useStudio } from '../store'
import { CATALOG } from '../catalog'
import { GROUP_ORDER } from '../types'
import type { CatalogPlugin } from '../types'

export default function PalettePanel() {
  const searchQuery = useStudio((s) => s.searchQuery)
  const setSearchQuery = useStudio((s) => s.setSearchQuery)
  const collapsedGroups = useStudio((s) => s.collapsedGroups)
  const toggleGroup = useStudio((s) => s.toggleGroup)
  const rows = useStudio((s) => s.profile.rows)
  const togglePlugin = useStudio((s) => s.togglePlugin)
  const selectNode = useStudio((s) => s.selectNode)
  const addCustom = useStudio((s) => s.addCustom)

  const q = searchQuery.toLowerCase()
  const filtered = q
    ? CATALOG.filter((p) =>
        p.label.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q)
      )
    : CATALOG

  const grouped: Record<string, CatalogPlugin[]> = {}
  for (const g of GROUP_ORDER) grouped[g] = []
  for (const p of filtered) {
    if (!grouped[p.group]) grouped[p.group] = []
    grouped[p.group].push(p)
  }

  function onDragStart(e: ReactDragEvent, pluginId: string) {
    e.dataTransfer.setData('application/dsh-plugin', pluginId)
    e.dataTransfer.effectAllowed = 'copy'
  }

  return (
    <aside className="panel palette">
      <div className="panel-head">
        <h3>Palette</h3>
        <input
          className="search"
          placeholder="search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="palette-scroll">
        {GROUP_ORDER.map((group) => {
          const plugins = grouped[group]
          if (!plugins || plugins.length === 0) return null
          const collapsed = collapsedGroups[group]

          return (
            <div key={group} className="palette-group">
              <button
                className="group-header"
                onClick={() => toggleGroup(group)}
              >
                <span className="group-arrow">{collapsed ? '▸' : '▾'}</span>
                <span className="group-name">{group}</span>
                <span className="group-count">{plugins.length}</span>
              </button>
              {!collapsed && plugins.map((p) => {
                const row = rows[p.id]
                const enabled = row?.enabled ?? false
                return (
                  <div
                    key={p.id}
                    className={`palette-item ${enabled ? 'on' : ''}`}
                    draggable
                    onDragStart={(e) => onDragStart(e, p.id)}
                    onClick={() => selectNode(p.id)}
                  >
                    <label className="switch" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={() => togglePlugin(p.id)}
                      />
                      <span className="slider" />
                    </label>
                    <div className="palette-item-body">
                      <div className="palette-item-name">{p.label}</div>
                      <div className="palette-item-summary">{p.summary}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
        <div className="palette-add">
          <button className="btn-ghost" onClick={() => addCustom('agent')}>
            + Add Custom Plugin
          </button>
        </div>
      </div>
    </aside>
  )
}
