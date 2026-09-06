import { useMemo, useState } from 'react'
import { useStudio } from '../store'
import { serializeToYaml } from '../serialize'

export default function YamlModal() {
  const open = useStudio((s) => s.yamlModalOpen)
  const setOpen = useStudio((s) => s.setYamlModalOpen)
  const profile = useStudio((s) => s.profile)

  const yaml = useMemo(() => serializeToYaml(profile), [profile])
  const [copied, setCopied] = useState(false)

  if (!open) return null

  function handleCopy() {
    navigator.clipboard.writeText(yaml).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  function handleDownload() {
    const blob = new Blob([yaml], { type: 'application/x-yaml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${profile.name || 'harness'}.cordis.yml`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="modal-backdrop" onClick={() => setOpen(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>cordis.patch.yml</h3>
          <div className="modal-actions">
            <button className="btn" onClick={handleCopy}>{copied ? 'Copied ✓' : 'Copy'}</button>
            <button className="btn primary" onClick={handleDownload}>Download</button>
            <button className="btn ghost" onClick={() => setOpen(false)}>Close</button>
          </div>
        </div>
        <pre className="yaml-view">{yaml}</pre>
      </div>
    </div>
  )
}
