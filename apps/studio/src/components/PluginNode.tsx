import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { CatalogPlugin } from '../types'

interface PluginNodeData {
  plugin: CatalogPlugin
  config: Record<string, unknown>
  enabled: boolean
  plane: 'host' | 'agent'
  isCustom?: boolean
}

function PluginNode({ data, selected }: NodeProps & { data: PluginNodeData }) {
  const { plugin, config, enabled, plane, isCustom } = data

  const summaryParts: string[] = []
  if (plugin.fields.length > 0) {
    for (const f of plugin.fields.slice(0, 2)) {
      const v = config[f.key]
      if (v !== undefined && v !== '' && v !== null) {
        summaryParts.push(`${f.label}: ${String(v).slice(0, 16)}`)
      }
    }
  }

  const roleColors: Record<string, string> = {
    core: 'var(--role-core)',
    tool: 'var(--role-tool)',
    capability: 'var(--role-capability)',
    policy: 'var(--role-policy)',
    storage: 'var(--role-storage)',
  }

  return (
    <div className={`plugin-node ${plane} ${enabled ? 'enabled' : 'disabled'} ${selected ? 'selected' : ''} ${isCustom ? 'custom' : ''}`}>
      <Handle type="target" position={Position.Top} className="handle" />
      <div className="node-header">
        <span className="node-label">{plugin.label}</span>
        <span className="node-role" style={{ background: roleColors[plugin.role] || 'var(--bg-elevated)' }}>
          {plugin.role}
        </span>
      </div>
      {summaryParts.length > 0 && (
        <div className="node-summary">{summaryParts.join(' · ')}</div>
      )}
      {summaryParts.length === 0 && (
        <div className="node-summary muted">{plugin.summary}</div>
      )}
      <Handle type="source" position={Position.Bottom} className="handle" />
    </div>
  )
}

export default memo(PluginNode)
