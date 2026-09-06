export type FieldKind = 'string' | 'number' | 'boolean' | 'select' | 'multiline' | 'stringlist'

export interface Field {
  key: string
  label: string
  kind: FieldKind
  options?: string[]
  hint?: string
  min?: number
  max?: number
}

export interface CatalogPlugin {
  id: string
  npmName: string
  label: string
  group: string
  summary: string
  role: 'core' | 'tool' | 'capability' | 'policy' | 'storage'
  plane: 'host' | 'agent'
  fields: Field[]
  defaults: Record<string, unknown>
  dependencies?: string[]
}

export interface NodePosition {
  x: number
  y: number
}

export interface RowState {
  enabled: boolean
  config: Record<string, unknown>
}

export interface CustomPlugin {
  id: string
  npmName: string
  label: string
  plane: 'host' | 'agent'
  enabled: boolean
  configText: string
}

export interface Profile {
  name: string
  rows: Record<string, RowState>
  customs: CustomPlugin[]
  nodePositions: Record<string, NodePosition>
}

export const GROUP_ORDER = [
  'Модель и LLM',
  'Ядро spine',
  'Файловая система',
  'Shell',
  'Web',
  'Skills',
  'Субагенты',
  'Workflow',
  'Цели',
  'Компакция',
  'Разрешения',
  'Сессии',
  'Команды',
  'Телеметрия',
] as const

export type GroupName = (typeof GROUP_ORDER)[number]
