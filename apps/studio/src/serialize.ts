import type { RowState, CustomRow } from './types';
import { byId, CATALOG } from './catalog';

function scalar(v: unknown): string {
  if (v === null || v === undefined) return 'null';
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  if (typeof v === 'number') return Number.isFinite(v) ? String(v) : 'null';
  const s = String(v);
  if (s === '') return "''";
  if (/^[a-zA-Z0-9_./:@~\-]+$/.test(s) && !/^\d+$/.test(s) && s !== 'true' && s !== 'false' && s !== 'null') {
    return s;
  }
  return JSON.stringify(s);
}

function scalarSafe(v: unknown): boolean {
  return v === null || v === undefined || typeof v === 'boolean' || typeof v === 'number' || typeof v === 'string';
}

function emit(value: unknown, indent: number, base: string, acc: string[]): void {
  const pad = ' '.repeat(indent);
  if (Array.isArray(value)) {
    if (value.length === 0) {
      acc.push(`${pad}${base} []`);
      return;
    }
    if (value.every(scalarSafe)) {
      acc.push(`${pad}${base} [${value.map((x) => scalar(x)).join(', ')}]`);
      return;
    }
    acc.push(`${pad}${base}:`);
    for (const item of value) {
      emit(item, indent + 2, '-', acc);
    }
    return;
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) {
      acc.push(`${pad}${base} {}`);
      return;
    }
    acc.push(base === '-' ? `${pad}-` : `${pad}${base}:`);
    for (const [k, v] of entries) {
      emit(v, indent + 2, k, acc);
    }
    return;
  }
  acc.push(`${pad}${base} ${scalar(value)}`);
}

export function serializeYaml(rows: Record<string, RowState>, customs: CustomRow[]): string {
  const acc: string[] = [];
  acc.push('# Сгенерировано DeepSeek Harness Studio');
  acc.push('# Профиль-композиция dsh. Строки через - insert: имеют id | name | (config) | (disabled).');
  acc.push('');

  const hostRows: Array<{ id: string; name: string; config: Record<string, unknown> }> = [];
  const agentRows: Array<{ id: string; name: string; config: Record<string, unknown> }> = [];

  for (const plugin of CATALOG) {
    const r = rows[plugin.id];
    if (!r?.enabled) continue;
    const hasConfig = plugin.fields.length > 0;
    (plugin.role === 'tool' || plugin.role === 'capability'
      ? agentRows
      : hostRows
    ).push({
      id: plugin.id,
      name: plugin.name,
      config: hasConfig ? r.config : {},
    });
  }

  acc.push('insert:');
  for (const row of [...hostRows, ...agentRows]) {
    if (Object.keys(row.config).length === 0) {
      acc.push(`  - id: ${row.id}`);
      acc.push(`    name: ${JSON.stringify(row.name)}`);
    } else {
      acc.push(`  - id: ${row.id}`);
      acc.push(`    name: ${JSON.stringify(row.name)}`);
      acc.push('    config:');
      for (const [k, v] of Object.entries(row.config)) {
        emit(v, 6, k, acc);
      }
    }
  }

  // disabled rows explicitly (only ones the user turned off that defaulted on)
  const disabledIds = CATALOG.filter((p) => p.enabled && !rows[p.id]?.enabled).map((p) => p.id);
  if (disabledIds.length) {
    acc.push('');
    for (const id of disabledIds) {
      const p = byId.get(id)!;
      acc.push(`- id: ${id}`);
      acc.push(`  name: ${JSON.stringify(p.name)}`);
      acc.push('  disabled: true');
    }
  }

  for (const c of customs) {
    acc.push('');
    acc.push(`# custom: ${c.id} (${c.plane})`);
    if (c.enabled) {
      acc.push(c.configText.trim());
    } else {
      acc.push(`- id: ${c.id}`);
      acc.push(`  name: ${JSON.stringify(c.name)}`);
      acc.push('  disabled: true');
    }
  }

  acc.push('');
  return acc.join('\n');
}