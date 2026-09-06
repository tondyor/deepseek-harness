import type { Node, Edge } from '@xyflow/react'
import { catalogMap } from './catalog'
import type { Profile } from './types'

const HOST_LANE_Y = 50
const AGENT_LANE_Y = 350
const NODE_W = 200
const NODE_H = 80
const GAP = 20

export function buildNodes(profile: Profile): Node[] {
  const nodes: Node[] = []

  // Swimlane groups
  nodes.push({
    id: 'host-lane',
    type: 'swimlane',
    position: { x: 0, y: 0 },
    data: { label: 'HOST PLANE', plane: 'host' },
    style: { width: 2000, height: 260 },
    draggable: false,
    selectable: false,
  })
  nodes.push({
    id: 'agent-lane',
    type: 'swimlane',
    position: { x: 0, y: AGENT_LANE_Y - 40 },
    data: { label: 'AGENT PLANE', plane: 'agent' },
    style: { width: 2000, height: 260 },
    draggable: false,
    selectable: false,
  })

  // Host plane nodes
  const hostPlugins = Object.entries(profile.rows)
    .filter(([id, row]) => {
      const cat = catalogMap.get(id)
      return cat?.plane === 'host' && row.enabled
    })
    .sort(([, a], [, b]) => (a.enabled === b.enabled ? 0 : a.enabled ? -1 : 1))

  hostPlugins.forEach(([id, row], i) => {
    const cat = catalogMap.get(id)!
    const savedPos = profile.nodePositions[id]
    nodes.push({
      id,
      type: 'plugin',
      position: savedPos || { x: 20 + i * (NODE_W + GAP), y: HOST_LANE_Y + 30 },
      data: {
        plugin: cat,
        config: row.config,
        enabled: row.enabled,
        plane: 'host',
      },
      parentId: 'host-lane',
      extent: 'parent',
      style: { width: NODE_W, height: NODE_H },
    })
  })

  // Agent plane nodes
  const agentPlugins = Object.entries(profile.rows)
    .filter(([id, row]) => {
      const cat = catalogMap.get(id)
      return cat?.plane === 'agent' && row.enabled
    })
    .sort(([, a], [, b]) => (a.enabled === b.enabled ? 0 : a.enabled ? -1 : 1))

  agentPlugins.forEach(([id, row], i) => {
    const cat = catalogMap.get(id)!
    const savedPos = profile.nodePositions[id]
    nodes.push({
      id,
      type: 'plugin',
      position: savedPos || { x: 20 + i * (NODE_W + GAP), y: AGENT_LANE_Y + 30 },
      data: {
        plugin: cat,
        config: row.config,
        enabled: row.enabled,
        plane: 'agent',
      },
      parentId: 'agent-lane',
      extent: 'parent',
      style: { width: NODE_W, height: NODE_H },
    })
  })

  // Custom nodes
  profile.customs.filter((c) => c.enabled).forEach((custom, i) => {
    const isHost = custom.plane === 'host'
    const laneY = isHost ? HOST_LANE_Y : AGENT_LANE_Y
    const laneId = isHost ? 'host-lane' : 'agent-lane'
    const existingCount = isHost ? hostPlugins.length : agentPlugins.length
    const savedPos = profile.nodePositions[custom.id]
    nodes.push({
      id: custom.id,
      type: 'plugin',
      position: savedPos || { x: 20 + (existingCount + i) * (NODE_W + GAP), y: laneY + 30 },
      data: {
        plugin: {
          id: custom.id,
          npmName: custom.npmName,
          label: custom.label,
          group: 'Custom',
          summary: 'User-defined plugin',
          role: 'capability' as const,
          plane: custom.plane,
          fields: [],
          defaults: {},
        },
        config: {},
        enabled: custom.enabled,
        plane: custom.plane,
        isCustom: true,
      },
      parentId: laneId,
      extent: 'parent',
      style: { width: NODE_W, height: NODE_H, borderStyle: 'dashed' },
    })
  })

  return nodes
}

export function buildEdges(profile: Profile): Edge[] {
  const edges: Edge[] = []

  for (const [id, row] of Object.entries(profile.rows)) {
    if (!row.enabled) continue
    const cat = catalogMap.get(id)
    if (!cat?.dependencies) continue

    for (const depId of cat.dependencies) {
      const depRow = profile.rows[depId]
      if (depRow?.enabled) {
        edges.push({
          id: `${id}->${depId}`,
          source: id,
          target: depId,
          type: 'dependency',
          animated: true,
          style: { stroke: 'var(--edge-color)', strokeWidth: 1.5 },
        })
      }
    }
  }

  return edges
}
