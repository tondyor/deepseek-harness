import yaml from 'js-yaml'
import { catalogMap } from './catalog'
import { validatePluginConfig } from './schema'
import type { Profile, RowState } from './types'
import { CATALOG } from './catalog'

interface ParseError {
  line?: number
  message: string
}

interface ParseResult {
  profile: Profile | null
  errors: ParseError[]
}

export function parseYamlToProfile(yamlStr: string): ParseResult {
  const errors: ParseError[] = []

  let raw: unknown
  try {
    raw = yaml.load(yamlStr)
  } catch (e) {
    return { profile: null, errors: [{ message: `YAML parse error: ${e instanceof Error ? e.message : String(e)}` }] }
  }

  if (!Array.isArray(raw)) {
    return { profile: null, errors: [{ message: 'Expected a YAML array of cordis entries' }] }
  }

  const rows: Record<string, RowState> = {}
  for (const p of CATALOG) {
    rows[p.id] = { enabled: false, config: { ...p.defaults } }
  }

  const customs: Profile['customs'] = []

  for (let i = 0; i < raw.length; i++) {
    const entry = raw[i]
    if (!entry || typeof entry !== 'object') {
      errors.push({ line: i + 1, message: `Entry ${i + 1}: expected object` })
      continue
    }

    const { id, name, config, disabled } = entry as Record<string, unknown>
    if (typeof id !== 'string') {
      errors.push({ line: i + 1, message: `Entry ${i + 1}: missing or invalid "id"` })
      continue
    }

    // Check if this is a known catalog plugin
    const known = catalogMap.get(id)
    if (known) {
      rows[id].enabled = !disabled
      if (config && typeof config === 'object') {
        const validation = validatePluginConfig(id, config as Record<string, unknown>)
        if (validation.success && validation.data) {
          rows[id].config = validation.data
        } else if (validation.errors) {
          for (const err of validation.errors) {
            errors.push({ line: i + 1, message: `${id}: ${err}` })
          }
          rows[id].config = config as Record<string, unknown>
        }
      }
    } else {
      // Unknown plugin → custom
      customs.push({
        id,
        npmName: typeof name === 'string' ? name : id,
        label: typeof name === 'string' ? name : id,
        plane: 'agent',
        enabled: !disabled,
        configText: config ? yaml.dump([config], { indent: 2, lineWidth: 120, noRefs: true }) : '',
      })
    }
  }

  return {
    profile: {
      name: 'imported',
      rows,
      customs,
      nodePositions: {},
    },
    errors,
  }
}
