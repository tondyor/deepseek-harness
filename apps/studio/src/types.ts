export type FieldKind =
  | 'string'
  | 'number'
  | 'boolean'
  | 'select'
  | 'multiline'
  | 'stringlist';

export interface Field {
  key: string;
  label: string;
  kind: FieldKind;
  options?: string[];
  hint?: string;
}

export interface CatalogPlugin {
  id: string;
  name: string;
  group: string;
  summary: string;
  role: 'core' | 'tool' | 'capability' | 'policy' | 'storage';
  fields: Field[];
  defaults: Record<string, unknown>;
  enabled: boolean;
}

export interface RowState {
  enabled: boolean;
  config: Record<string, unknown>;
}

export type Plane = 'host' | 'agent';

export interface CustomRow {
  id: string;
  name: string;
  plane: Plane;
  configText: string;
  enabled: boolean;
}