import { memo } from 'react'
import { BaseEdge, getSmoothStepPath, type EdgeProps } from '@xyflow/react'

function DependencyEdge(props: EdgeProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    targetX: props.targetX,
    targetY: props.targetY,
    sourcePosition: props.sourcePosition,
    targetPosition: props.targetPosition,
    borderRadius: 8,
  })

  return (
    <BaseEdge
      path={edgePath}
      markerEnd={props.markerEnd}
      style={{
        stroke: 'var(--edge-color)',
        strokeWidth: 1.5,
        strokeDasharray: '6 3',
        opacity: 0.6,
      }}
    />
  )
}

export default memo(DependencyEdge)
