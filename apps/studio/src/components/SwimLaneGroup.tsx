import { memo } from 'react'
import { type NodeProps } from '@xyflow/react'

interface SwimLaneData {
  label: string
  plane: 'host' | 'agent'
}

function SwimLaneGroup({ data }: NodeProps & { data: SwimLaneData }) {
  const { label, plane } = data
  return (
    <div className={`swim-lane ${plane}`}>
      <div className="swim-lane-label">{label}</div>
    </div>
  )
}

export default memo(SwimLaneGroup)
