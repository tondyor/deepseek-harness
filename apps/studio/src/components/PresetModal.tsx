import { useStudio } from '../store'
import { PRESETS } from '../presets'

export default function PresetModal() {
  const open = useStudio((s) => s.presetModalOpen)
  const setOpen = useStudio((s) => s.setPresetModalOpen)
  const loadProfile = useStudio((s) => s.loadProfile)

  if (!open) return null

  return (
    <div className="modal-backdrop" onClick={() => setOpen(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Choose Preset</h3>
          <button className="btn ghost" onClick={() => setOpen(false)}>Close</button>
        </div>
        <div className="preset-grid">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              className="preset-card"
              onClick={() => {
                loadProfile(preset.profile)
                setOpen(false)
              }}
            >
              <div className="preset-icon">{preset.icon}</div>
              <div className="preset-name">{preset.name}</div>
              <div className="preset-desc">{preset.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
