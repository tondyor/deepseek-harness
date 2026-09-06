import { z } from 'zod'

const pluginSchemas: Record<string, z.ZodType> = {
  'llm-deepseek': z.object({
    apiKeyEnv: z.string().default('DEEPSEEK_API_KEY'),
    baseURL: z.string().optional(),
    thinking: z.enum(['enabled', 'disabled']).optional(),
    reasoningEffort: z.enum(['off', 'high', 'max']).optional(),
    maxTokens: z.number().min(1).max(1_000_000).default(256000),
    defaultContextWindow: z.number().min(1000).max(10_000_000).default(1_000_000),
    models: z.array(z.string()).default(['gpt-4o-mini']),
    streamIdleTimeoutMs: z.number().min(0).max(3_600_000).optional(),
  }),
  'llm-retry': z.object({
    maxRetries: z.number().min(0).max(10).default(3),
    baseDelayMs: z.number().min(100).max(60_000).default(1000),
  }),
  'agent-default-model': z.object({
    provider: z.string().default('deepseek-official'),
    model: z.string().default('gpt-4o-mini'),
  }),
  'agent-loop': z.object({
    maxParallelToolCalls: z.number().min(1).max(20).default(4),
  }),
  'agent-instructions': z.object({
    maxBytes: z.number().min(1024).max(1_048_576).default(65536),
    maxSourceBytes: z.number().min(1024).max(1_048_576).optional(),
  }),
  'system-prompt': z.object({
    persona: z.string().default(''),
  }),
  'hmr': z.object({
    root: z.array(z.string()).default(['.']),
  }),
  'fs-local': z.object({
    cwd: z.string().optional(),
    diffBasisMaxBytes: z.number().min(1024).max(104_857_600).default(10_485_760),
  }),
  'fs-sandbox': z.object({
    cwd: z.string().optional(),
  }),
  'tool-fs': z.object({
    readLimit: z.number().optional(),
    readMaxLineLength: z.number().optional(),
    readMaxBytes: z.number().optional(),
  }),
  'tool-fs-search': z.object({
    globMaxResults: z.number().min(10).max(10_000).default(200),
    grepMaxMatches: z.number().min(10).max(1000).default(250),
    timeoutMs: z.number().min(1000).max(120_000).default(30_000),
  }),
  'bash-local': z.object({
    cwd: z.string().optional(),
    timeoutMs: z.number().min(1000).max(600_000).default(120_000),
    maxTimeoutMs: z.number().min(5000).max(3_600_000).default(600_000),
    maxOutputBytes: z.number().min(1024).max(1_048_576).default(64_000),
  }),
  'bash-sandbox': z.object({
    timeoutMs: z.number().min(1000).max(600_000).default(120_000),
  }),
  'tool-bash': z.object({
    enableRunInBackground: z.boolean().default(true),
  }),
  'web': z.object({
    searchProvider: z.string().optional(),
    fetchProvider: z.string().optional(),
  }),
  'web-search-deepseek': z.object({
    apiKeyEnv: z.string().optional(),
    model: z.string().default('deepseek-v4-flash'),
    maxTokens: z.number().min(256).max(32_000).default(4096),
    maxUses: z.number().min(1).max(20).default(5),
  }),
  'tool-web': z.object({
    search: z.boolean().default(true),
    fetch: z.boolean().default(false),
    searchMaxResults: z.number().min(1).max(20).default(5),
    fetchTimeoutMs: z.number().min(5000).max(120_000).default(30_000),
    fetchMaxOutputChars: z.number().min(1000).max(1_000_000).default(200_000),
  }),
  'skill': z.object({
    collectCacheMaxEntries: z.number().min(1).max(1024).default(128),
  }),
  'skill-filesystem': z.object({
    includeDefaultRoots: z.boolean().default(true),
    customSkillDirs: z.array(z.string()).default([]),
    watch: z.boolean().default(true),
  }),
  'tool-skill': z.object({
    catalogDescriptionMaxLength: z.number().min(3).max(5000).default(500),
  }),
  'subagent-spawn': z.object({
    providerName: z.string().default('spawn'),
  }),
  'subagent-fork': z.object({
    providerName: z.string().default('fork'),
  }),
  'tool-subagent': z.object({
    provider: z.enum(['spawn', 'fork']).default('spawn'),
    enableRunInBackground: z.boolean().default(true),
    backgroundMode: z.enum(['one-shot', 'continuable']).default('one-shot'),
    maxDepth: z.number().min(1).max(10).default(3),
    persona: z.string().optional(),
  }),
  'workflow-worker': z.object({
    provider: z.enum(['spawn', 'fork']).default('spawn'),
  }),
  'tool-ralph': z.object({
    subagentProvider: z.enum(['spawn', 'fork']).default('spawn'),
    maxRounds: z.number().min(1).max(256).default(64),
  }),
  'tool-todo': z.object({
    allowParallelInProgress: z.boolean().default(true),
  }),
  'compaction-basic': z.object({
    thresholdRatio: z.number().min(0.1).max(1.0).default(0.8),
    retainRatio: z.number().min(0.01).max(0.5).default(0.16),
    maxTokens: z.number().min(1024).max(100_000).default(8192),
    compactionRetries: z.number().min(0).max(5).default(1),
    auto: z.boolean().default(true),
  }),
  'tool-result-pruner': z.object({
    thresholdChars: z.number().min(512).max(100_000).default(8192),
    headChars: z.number().min(128).max(50_000).default(4096),
    tailChars: z.number().min(128).max(50_000).default(1024),
  }),
  'sandbox-policy': z.object({
    mode: z.enum(['read-only', 'workspace-write', 'danger-full-access']).default('workspace-write'),
    workspaceRoot: z.string().optional(),
  }),
  'approval': z.object({
    policy: z.enum(['ask', 'never']).default('ask'),
  }),
  'repeat-tool-reminder': z.object({
    thresholds: z.array(z.string()).default(['3', '5', '8']),
    argumentsPreviewChars: z.number().min(100).max(2000).default(500),
  }),
  'session-persistence': z.object({
    root: z.string().optional(),
  }),
  'session-title': z.object({
    fallbackMaxWords: z.number().min(1).max(20).default(5),
    maxTitleBytes: z.number().min(20).max(200).default(80),
  }),
  'session-telemetry': z.object({
    mode: z.enum(['DISABLED', 'ENABLED']).default('DISABLED'),
    'exporter.url': z.string().optional(),
  }),
  'plan-mode': z.object({
    section: z.string().optional(),
  }),
  'spill': z.object({
    maxInlineBytes: z.number().min(1000).max(1_000_000).default(50_000),
  }),
}

export function validatePluginConfig(id: string, config: Record<string, unknown>): { success: boolean; data?: Record<string, unknown>; errors?: string[] } {
  const schema = pluginSchemas[id]
  if (!schema) return { success: true, data: config }
  const result = schema.safeParse(config)
  if (result.success) return { success: true, data: result.data as Record<string, unknown> }
  return { success: false, errors: result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`) }
}

export function getDefaultConfig(id: string): Record<string, unknown> {
  const schema = pluginSchemas[id]
  if (!schema) return {}
  const result = schema.safeParse({})
  return result.success ? (result.data as Record<string, unknown>) : {}
}
