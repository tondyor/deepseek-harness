import yaml from 'js-yaml'
import type { Profile } from './types'
import { catalogMap } from './catalog'

interface CordisEntry {
  id: string
  name: string
  config?: Record<string, unknown>
  disabled?: boolean
}

export function serializeToYaml(profile: Profile): string {
  const entries: CordisEntry[] = []

  // Host plane plugins
  const hostPlugins = Object.entries(profile.rows)
    .filter(([id, row]) => {
      const cat = catalogMap.get(id)
      return cat && cat.plane === 'host' && (row.enabled || hasNonDefaultConfig(id, row.config))
    })
    .sort(([, a], [, b]) => (a.enabled === b.enabled ? 0 : a.enabled ? -1 : 1))

  for (const [id, row] of hostPlugins) {
    const cat = catalogMap.get(id)!
    const entry: CordisEntry = {
      id,
      name: cat.npmName,
    }
    if (!row.enabled) entry.disabled = true
    if (hasNonDefaultConfig(id, row.config)) entry.config = row.config
    entries.push(entry)
  }

  // Agent plane plugins
  const agentPlugins = Object.entries(profile.rows)
    .filter(([id, row]) => {
      const cat = catalogMap.get(id)
      return cat && cat.plane === 'agent' && (row.enabled || hasNonDefaultConfig(id, row.config))
    })
    .sort(([, a], [, b]) => (a.enabled === b.enabled ? 0 : a.enabled ? -1 : 1))

  for (const [id, row] of agentPlugins) {
    const cat = catalogMap.get(id)!
    const entry: CordisEntry = {
      id,
      name: cat.npmName,
    }
    if (!row.enabled) entry.disabled = true
    if (hasNonDefaultConfig(id, row.config)) entry.config = row.config
    entries.push(entry)
  }

  // Custom plugins
  for (const custom of profile.customs) {
    if (!custom.enabled) continue
    const entry: CordisEntry = {
      id: custom.id,
      name: custom.npmName || custom.id,
    }
    if (custom.configText.trim()) {
      try {
        const parsed = yaml.load(custom.configText)
        if (parsed && typeof parsed === 'object') entry.config = parsed as Record<string, unknown>
      } catch { /* ignore invalid yaml in custom */ }
    }
    entries.push(entry)
  }

  return yaml.dump(entries, {
    indent: 2,
    lineWidth: 120,
    noRefs: true,
    sortKeys: false,
    quotingType: '"',
    forceQuotes: false,
  })
}

function hasNonDefaultConfig(id: string, config: Record<string, unknown>): boolean {
  const cat = catalogMap.get(id)
  if (!cat) return Object.keys(config).length > 0
  for (const [key, value] of Object.entries(config)) {
    const def = cat.defaults[key]
    if (JSON.stringify(value) !== JSON.stringify(def)) return true
  }
  return false
}
