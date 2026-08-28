export type NoteLifecycle = 'implemented' | 'archived' | 'proposed' | 'rejected';
export type NoteCategory = 'architecture' | 'feature' | 'bug-fix' | 'simplification' | 'process' | 'testing';

export interface NoteItem {
  id: string;
  slug: string;
  title: string;
  titleZh?: string;
  lifecycle: NoteLifecycle;
  category: NoteCategory;
  date: string;
  status: string;
  hasZh: boolean;
  filePathEn: string;
  filePathZh?: string;
  summary: string;
  problemExcerpt?: string;
  decisionExcerpt?: string;
  tags: string[];
  links: string[];
}

export interface NoteDetail extends NoteItem {
  contentEn: string;
  contentZh?: string;
  i18nYaml?: string;
  backlinks: Array<{
    id: string;
    title: string;
    category: string;
    lifecycle: string;
  }>;
}

export interface SearchResult {
  id: string;
  title: string;
  titleZh?: string;
  lifecycle: string;
  category: string;
  date: string;
  snippet: string;
  matchType: 'title' | 'content';
}

export interface RepositoryStats {
  totalNotes: number;
  bilingualCount: number;
  categoryCounts: Record<string, number>;
  lifecycleCounts: Record<string, number>;
  tagCounts: Record<string, number>;
  monthlyActivity: Record<string, number>;
  topConnected: Array<{
    id: string;
    title: string;
    backlinksCount: number;
    category: string;
  }>;
}

export type ViewMode = 'grid' | 'timeline' | 'architecture' | 'reader';
export type LanguageMode = 'en' | 'zh' | 'bilingual';
export type UILanguage = 'en' | 'ru';
