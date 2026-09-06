import { useCallback, useEffect, useMemo, type MouseEvent as ReactMouseEvent, type DragEvent as ReactDragEvent } from 'react'
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  type Node,
  type OnNodesChange,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { useStudio } from '../store'
import { buildNodes, buildEdges } from '../canvas-utils'
import { catalogMap } from '../catalog'
import PluginNode from './PluginNode'
import SwimLaneGroup from './SwimLaneGroup'
import DependencyEdge from './DependencyEdge'

const nodeTypes = { plugin: PluginNode, swimlane: SwimLaneGroup }
const edgeTypes = { dependency: DependencyEdge }

export default function CanvasView() {
  const profile = useStudio((s) => s.profile)
  const selectNode = useStudio((s) => s.selectNode)
  const setNodePosition = useStudio((s) => s.setNodePosition)
  const togglePlugin = useStudio((s) => s.togglePlugin)

  const initialNodes = useMemo(() => buildNodes(profile), [profile])
  const initialEdges = useMemo(() => buildEdges(profile), [profile])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // Sync nodes when profile changes
  useEffect(() => {
    setNodes(buildNodes(profile))
    setEdges(buildEdges(profile))
  }, [profile, setNodes, setEdges])

  const onNodeClick = useCallback((_: ReactMouseEvent, node: Node) => {
    if (node.type === 'plugin') {
      selectNode(node.id)
    }
  }, [selectNode])

  const onPaneClick = useCallback(() => {
    selectNode(null)
  }, [selectNode])

  const onNodesChangeHandler: OnNodesChange = useCallback((changes) => {
    onNodesChange(changes)
    for (const change of changes) {
      if (change.type === 'position' && change.position && change.id) {
        setNodePosition(change.id, change.position)
      }
    }
  }, [onNodesChange, setNodePosition])

  const onDrop = useCallback((e: ReactDragEvent) => {
    e.preventDefault()
    const pluginId = e.dataTransfer.getData('application/dsh-plugin')
    if (pluginId && catalogMap.has(pluginId)) {
      const row = useStudio.getState().profile.rows[pluginId]
      if (row && !row.enabled) {
        togglePlugin(pluginId)
      }
      selectNode(pluginId)
    }
  }, [togglePlugin, selectNode])

  const onDragOver = useCallback((e: ReactDragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }, [])

  return (
    <div className="canvas-container" onDrop={onDrop} onDragOver={onDragOver}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChangeHandler}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={2}
        defaultEdgeOptions={{
          type: 'dependency',
          animated: true,
          style: { stroke: 'var(--edge-color)', strokeWidth: 1.5 },
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        <Controls position="bottom-left" />
        <MiniMap
          position="bottom-right"
          nodeColor={(node) => {
            if (node.type === 'swimlane') return node.data.plane === 'host' ? '#1e3a5f' : '#1a4731'
            return node.data.plane === 'host' ? '#4d93f8' : '#22c55e'
          }}
          maskColor="rgba(0,0,0,0.1)"
          style={{ background: 'var(--bg-elevated)' }}
        />
      </ReactFlow>
    </div>
  )
}
