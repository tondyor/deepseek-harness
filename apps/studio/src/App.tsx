import { useCallback, useEffect } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import { useStudio } from './store'
import TopBar from './components/TopBar'
import PalettePanel from './components/PalettePanel'
import CanvasView from './components/CanvasView'
import InspectorPanel from './components/InspectorPanel'
import YamlModal from './components/YamlModal'
import ImportModal from './components/ImportModal'
import PresetModal from './components/PresetModal'

export default function App() {
  const undo = useStudio((s) => s.undo)
  const redo = useStudio((s) => s.redo)
  const selectNode = useStudio((s) => s.selectNode)
  const setYamlModalOpen = useStudio((s) => s.setYamlModalOpen)
  const setImportModalOpen = useStudio((s) => s.setImportModalOpen)
  const setPresetModalOpen = useStudio((s) => s.setPresetModalOpen)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault()
      undo()
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
      e.preventDefault()
      redo()
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
      e.preventDefault()
      setYamlModalOpen(true)
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault()
      setImportModalOpen(true)
    }
    if (e.key === 'Escape') {
      selectNode(null)
      setYamlModalOpen(false)
      setImportModalOpen(false)
      setPresetModalOpen(false)
    }
  }, [undo, redo, selectNode, setYamlModalOpen, setImportModalOpen, setPresetModalOpen])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <ReactFlowProvider>
      <div className="app">
        <TopBar />
        <div className="workspace">
          <PalettePanel />
          <CanvasView />
          <InspectorPanel />
        </div>
        <YamlModal />
        <ImportModal />
        <PresetModal />
      </div>
    </ReactFlowProvider>
  )
}
