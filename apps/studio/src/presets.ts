import type { Profile } from './types'
import { CATALOG } from './catalog'
import { getDefaultConfig } from './schema'

function makePreset(enabled: string[], name: string): Profile {
  const rows: Record<string, { enabled: boolean; config: Record<string, unknown> }> = {}
  for (const p of CATALOG) {
    rows[p.id] = {
      enabled: enabled.includes(p.id),
      config: enabled.includes(p.id) ? getDefaultConfig(p.id) : { ...p.defaults },
    }
  }
  return { name, rows, customs: [], nodePositions: {} }
}

export interface Preset {
  id: string
  name: string
  description: string
  icon: string
  profile: Profile
}

export const PRESETS: Preset[] = [
  {
    id: 'coding-agent',
    name: 'Coding Agent',
    description: 'Полноценный coding assistant со всеми инструментами: FS, Shell, Web, Skills, Subagents, Compaction, Guards',
    icon: '💻',
    profile: makePreset([
      'llm', 'llm-deepseek', 'agent-default-model',
      'session', 'session-persistence', 'session-title',
      'agent', 'agent-loop', 'agent-instructions', 'system-prompt', 'tools',
      'fs-local', 'fs-sandbox', 'tool-fs', 'tool-fs-search',
      'subprocess', 'bash-local', 'bash-sandbox', 'tool-bash',
      'web', 'web-search-deepseek', 'tool-web',
      'skill', 'skill-filesystem', 'tool-skill',
      'subagent', 'subagent-spawn', 'tool-subagent',
      'sandbox', 'sandbox-policy', 'approval',
      'token-meter', 'compaction-basic', 'tool-result-pruner', 'command-compact',
      'repeat-tool-reminder', 'timeout-policy',
      'tool-todo', 'tool-goal', 'goal',
      'commands', 'plan-mode',
    ], 'Coding Agent'),
  },
  {
    id: 'web-researcher',
    name: 'Web Researcher',
    description: 'Агент для веб-исследований: Web Search + Fetch + Skills + Compaction',
    icon: '🌐',
    profile: makePreset([
      'llm', 'llm-deepseek', 'agent-default-model',
      'session', 'session-persistence', 'session-title',
      'agent', 'agent-loop', 'agent-instructions', 'system-prompt', 'tools',
      'web', 'web-search-deepseek', 'tool-web',
      'skill', 'skill-filesystem', 'tool-skill',
      'sandbox', 'sandbox-policy', 'approval',
      'token-meter', 'compaction-basic', 'tool-result-pruner',
      'commands',
    ], 'Web Researcher'),
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Базовый агент: LLM + FS + Shell. Минимум для старта.',
    icon: '⚡',
    profile: makePreset([
      'llm', 'llm-deepseek', 'agent-default-model',
      'session', 'session-persistence',
      'agent', 'agent-loop', 'agent-instructions', 'system-prompt', 'tools',
      'fs-local', 'tool-fs',
      'subprocess', 'bash-local', 'tool-bash',
      'sandbox', 'sandbox-policy', 'approval',
      'commands',
    ], 'Minimal'),
  },
]
