import { useSyncExternalStore } from 'react';
import type { RowState, CustomRow } from './types';
import { CATALOG } from './catalog';

export interface StudioState {
  profileName: string;
  rows: Record<string, RowState>;
  customs: CustomRow[];
  selected: string | null;
}

function initialRows(): Record<string, RowState> {
  const rows: Record<string, RowState> = {};
  for (const p of CATALOG) {
    rows[p.id] = { enabled: p.enabled, config: { ...p.defaults } };
  }
  return rows;
}

class StudioStore {
  state: StudioState = {
    profileName: 'standard',
    rows: initialRows(),
    customs: [],
    selected: null,
  };
  private listeners = new Set<() => void>();

  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  };

  private emit() {
    for (const l of this.listeners) l();
  }

  getSnapshot = () => this.state;

  set(partial: Partial<StudioState>) {
    this.state = { ...this.state, ...partial };
    this.emit();
  }

  setProfileName(name: string) {
    this.set({ profileName: name });
  }

  toggle(id: string) {
    const rows = { ...this.state.rows };
    rows[id] = { ...rows[id], enabled: !rows[id].enabled };
    this.set({ rows });
  }

  setConfig(id: string, key: string, value: unknown) {
    const rows = { ...this.state.rows };
    rows[id] = { ...rows[id], config: { ...rows[id].config, [key]: value } };
    this.set({ rows });
  }

  select(id: string | null) {
    this.set({ selected: id });
  }

  addCustom(name: string) {
    const id = `custom-${Date.now()}`;
    const custom: CustomRow = { id, name, plane: 'agent', configText: '', enabled: true };
    this.set({ customs: [...this.state.customs, custom], selected: id });
  }

  removeCustom(id: string) {
    this.set({ customs: this.state.customs.filter((c) => c.id !== id), selected: null });
  }

  toggleCustom(id: string) {
    this.set({ customs: this.state.customs.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c)) });
  }

  setCustomText(id: string, text: string) {
    this.set({ customs: this.state.customs.map((c) => (c.id === id ? { ...c, configText: text } : c)) });
  }

  setCustomName(id: string, name: string) {
    this.set({ customs: this.state.customs.map((c) => (c.id === id ? { ...c, name } : c)) });
  }

  loadRows(rows: Record<string, RowState>, profileName: string) {
    this.set({ rows, profileName });
  }

  reset() {
    this.set({ rows: initialRows(), profileName: 'standard', customs: [], selected: null });
  }
}

export const store = new StudioStore();

export function useStudio(): StudioState {
  return useSyncExternalStore(store.subscribe, store.getSnapshot);
}