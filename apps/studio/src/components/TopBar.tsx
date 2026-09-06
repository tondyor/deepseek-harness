import { useStudio } from '../store'
import { serializeToYaml } from '../serialize'

export default function TopBar() {
  const profile = useStudio((s) => s.profile)
  const setYamlModalOpen = useStudio((s) => s.setYamlModalOpen)
  const setImportModalOpen = useStudio((s) => s.setImportModalOpen)
  const setPresetModalOpen = useStudio((s) => s.setPresetModalOpen)
  const resetAll = useStudio((s) => s.resetAll)
  const undo = useStudio((s) => s.undo)
  const redo = useStudio((s) => s.redo)

  const enabledCount = Object.values(profile.rows).filter((r) => r.enabled).length
    + profile.customs.filter((c) => c.enabled).length

  function handleCopy() {
    const yaml = serializeToYaml(profile)
    navigator.clipboard.writeText(yaml).catch(() => setYamlModalOpen(true))
  }

  function handleDownload() {
    const yaml = serializeToYaml(profile)
    const blob = new Blob([yaml], { type: 'application/x-yaml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${profile.name || 'harness'}.cordis.yml`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <header className="topbar">
      <div className="brand">
        <span className="logo">DS</span>
        <span className="brand-title">Harness Studio</span>
      </div>

      <input
        className="profile-input"
        value={profile.name}
        onChange={(e) => useStudio.getState().setProfileName(e.target.value)}
        placeholder="profile name"
      />

      <div className="topbar-stats">
        <span className="stat-num">{enabledCount}</span>
        <span className="stat-label">plugins</span>
      </div>

      <div className="topbar-actions">
        <button className="btn" onClick={undo} title="Undo (Ctrl+Z)">↩</button>
        <button className="btn" onClick={redo} title="Redo (Ctrl+Shift+Z)">↪</button>
        <span className="divider" />
        <button className="btn" onClick={() => setPresetModalOpen(true)}>Presets</button>
        <button className="btn" onClick={resetAll}>Reset</button>
        <button className="btn" onClick={() => setImportModalOpen(true)}>Import</button>
        <button className="btn" onClick={() => setYamlModalOpen(true)}>YAML</button>
        <button className="btn" onClick={handleCopy}>Copy</button>
        <button className="btn primary" onClick={handleDownload}>Download</button>
      </div>
    </header>
  )
}
