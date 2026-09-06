import { useState, useCallback, type DragEvent as ReactDragEvent } from 'react'
import { useStudio } from '../store'
import { parseYamlToProfile } from '../deserialize'

export default function ImportModal() {
  const open = useStudio((s) => s.importModalOpen)
  const setOpen = useStudio((s) => s.setImportModalOpen)
  const loadProfile = useStudio((s) => s.loadProfile)

  const [text, setText] = useState('')
  const [errors, setErrors] = useState<{ line?: number; message: string }[]>([])
  const [dragOver, setDragOver] = useState(false)

  const handleImport = useCallback(() => {
    const result = parseYamlToProfile(text)
    if (result.errors.length > 0) {
      setErrors(result.errors)
      return
    }
    if (result.profile) {
      loadProfile(result.profile)
      setText('')
      setErrors([])
      setOpen(false)
    }
  }, [text, loadProfile, setOpen])

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result
      if (typeof content === 'string') {
        setText(content)
        setErrors([])
      }
    }
    reader.readAsText(file)
  }, [])

  const onDrop = useCallback((e: ReactDragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  if (!open) return null

  return (
    <div className="modal-backdrop" onClick={() => setOpen(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Import cordis.patch.yml</h3>
          <button className="btn ghost" onClick={() => setOpen(false)}>Close</button>
        </div>
        <div className="import-body">
          <div
            className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
          >
            <p>Drop a .cordis.yml file here, or paste YAML below</p>
            <input
              type="file"
              accept=".yml,.yaml"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFile(file)
              }}
            />
          </div>
          <textarea
            className="import-textarea mono"
            rows={12}
            placeholder="# Paste cordis.patch.yml content here..."
            value={text}
            onChange={(e) => { setText(e.target.value); setErrors([]) }}
          />
          {errors.length > 0 && (
            <div className="import-errors">
              {errors.map((err, i) => (
                <div key={i} className="import-error">
                  {err.line && <span className="error-line">L{err.line}: </span>}
                  {err.message}
                </div>
              ))}
            </div>
          )}
          <button className="btn primary" onClick={handleImport} disabled={!text.trim()}>
            Parse & Import
          </button>
        </div>
      </div>
    </div>
  )
}
