import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { CATALOG, catalogMap } from './catalog'
import type { Profile, RowState, NodePosition } from './types'

const MAX_HISTORY = 50

function defaultProfile(): Profile {
  const rows: Record<string, RowState> = {}
  for (const p of CATALOG) {
    rows[p.id] = { enabled: false, config: { ...p.defaults } }
  }
  return { name: 'default', rows, customs: [], nodePositions: {} }
}

function cloneProfile(profile: Profile): Profile {
  return JSON.parse(JSON.stringify(profile))
}

interface HistoryEntry {
  profile: Profile
}

interface StudioState {
  profile: Profile
  selectedNodeId: string | null
  searchQuery: string
  collapsedGroups: Record<string, boolean>
  yamlModalOpen: boolean
  importModalOpen: boolean
  presetModalOpen: boolean
  undoStack: HistoryEntry[]
  redoStack: HistoryEntry[]

  togglePlugin: (id: string) => void
  setConfig: (id: string, key: string, value: unknown) => void
  resetPlugin: (id: string) => void
  resetAll: () => void
  addCustom: (plane: 'host' | 'agent') => void
  removeCustom: (id: string) => void
  setCustomConfig: (id: string, yaml: string) => void
  selectNode: (id: string | null) => void
  setNodePosition: (id: string, pos: NodePosition) => void
  setSearchQuery: (q: string) => void
  toggleGroup: (group: string) => void
  setYamlModalOpen: (open: boolean) => void
  setImportModalOpen: (open: boolean) => void
  setPresetModalOpen: (open: boolean) => void
  setProfileName: (name: string) => void
  loadProfile: (profile: Profile) => void
  undo: () => void
  redo: () => void
}

function pushHistory(state: StudioState): Partial<StudioState> {
  const entry: HistoryEntry = { profile: cloneProfile(state.profile) }
  const undoStack = [...state.undoStack, entry].slice(-MAX_HISTORY)
  return { undoStack, redoStack: [] }
}

export const useStudio = create<StudioState>()(
  persist(
    immer((set) => ({
      profile: defaultProfile(),
      selectedNodeId: null,
      searchQuery: '',
      collapsedGroups: {},
      yamlModalOpen: false,
      importModalOpen: false,
      presetModalOpen: false,
      undoStack: [],
      redoStack: [],

      togglePlugin: (id) =>
        set((state) => {
          Object.assign(state, pushHistory(state))
          state.profile.rows[id].enabled = !state.profile.rows[id].enabled
        }),

      setConfig: (id, key, value) =>
        set((state) => {
          if (!state.undoStack.length || state.undoStack[state.undoStack.length - 1].profile !== state.profile) {
            Object.assign(state, pushHistory(state))
          }
          state.profile.rows[id].config[key] = value
        }),

      resetPlugin: (id) =>
        set((state) => {
          Object.assign(state, pushHistory(state))
          const catalog = catalogMap.get(id)
          state.profile.rows[id].config = catalog ? { ...catalog.defaults } : {}
        }),

      resetAll: () =>
        set((state) => {
          Object.assign(state, pushHistory(state))
          state.profile = defaultProfile()
        }),

      addCustom: (plane) =>
        set((state) => {
          Object.assign(state, pushHistory(state))
          const id = `custom-${Date.now()}`
          state.profile.customs.push({
            id,
            npmName: '',
            label: 'Custom Plugin',
            plane,
            enabled: true,
            configText: '',
          })
          state.selectedNodeId = id
        }),

      removeCustom: (id) =>
        set((state) => {
          Object.assign(state, pushHistory(state))
          state.profile.customs = state.profile.customs.filter((c) => c.id !== id)
          if (state.selectedNodeId === id) state.selectedNodeId = null
        }),

      setCustomConfig: (id, yaml) =>
        set((state) => {
          const custom = state.profile.customs.find((c) => c.id === id)
          if (custom) custom.configText = yaml
        }),

      selectNode: (id) => set({ selectedNodeId: id }),

      setNodePosition: (id, pos) =>
        set((state) => {
          state.profile.nodePositions[id] = pos
        }),

      setSearchQuery: (q) => set({ searchQuery: q }),

      toggleGroup: (group) =>
        set((state) => {
          state.collapsedGroups[group] = !state.collapsedGroups[group]
        }),

      setYamlModalOpen: (open) => set({ yamlModalOpen: open }),
      setImportModalOpen: (open) => set({ importModalOpen: open }),
      setPresetModalOpen: (open) => set({ presetModalOpen: open }),

      setProfileName: (name) =>
        set((state) => {
          state.profile.name = name
        }),

      loadProfile: (profile) =>
        set((state) => {
          Object.assign(state, pushHistory(state))
          state.profile = cloneProfile(profile)
          state.selectedNodeId = null
        }),

      undo: () =>
        set((state) => {
          if (state.undoStack.length === 0) return
          const prev = state.undoStack[state.undoStack.length - 1]
          state.redoStack.push({ profile: cloneProfile(state.profile) })
          state.profile = prev.profile
          state.undoStack.pop()
        }),

      redo: () =>
        set((state) => {
          if (state.redoStack.length === 0) return
          const next = state.redoStack[state.redoStack.length - 1]
          state.undoStack.push({ profile: cloneProfile(state.profile) })
          state.profile = next.profile
          state.redoStack.pop()
        }),
    })),
    {
      name: 'dsh-studio-profile',
      partialize: (state) => ({ profile: state.profile }),
    }
  )
)
