import React from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Tag, CheckCircle2, Archive, HelpCircle } from 'lucide-react';
import { NoteCategory, NoteLifecycle, RepositoryStats, UILanguage } from '../types';
import { i18n } from '../i18n';

interface FilterBarProps {
  selectedLifecycle: string;
  onSelectLifecycle: (lifecycle: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  selectedTag: string;
  onSelectTag: (tag: string) => void;
  searchTerm: string;
  onSearchTermChange: (search: string) => void;
  sortOrder: string;
  onSortOrderChange: (sort: string) => void;
  stats: RepositoryStats | null;
  totalFiltered: number;
  uiLang: UILanguage;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedLifecycle,
  onSelectLifecycle,
  selectedCategory,
  onSelectCategory,
  selectedTag,
  onSelectTag,
  searchTerm,
  onSearchTermChange,
  sortOrder,
  onSortOrderChange,
  stats,
  totalFiltered,
  uiLang
}) => {
  const t = i18n[uiLang];

  const lifecycles = [
    { id: 'all', label: t.allLifecycles },
    { id: 'implemented', label: t.lifecycleImplemented, count: stats?.lifecycleCounts['implemented'] || 0 },
    { id: 'archived', label: t.lifecycleArchived, count: stats?.lifecycleCounts['archived'] || 0 },
    { id: 'proposed', label: t.lifecycleProposed, count: stats?.lifecycleCounts['proposed'] || 0 },
  ];

  const categories: Array<{ id: string; label: string; count?: number }> = [
    { id: 'all', label: t.allCategories },
    { id: 'architecture', label: t.catArchitecture, count: stats?.categoryCounts['architecture'] || 0 },
    { id: 'feature', label: t.catFeature, count: stats?.categoryCounts['feature'] || 0 },
    { id: 'bug-fix', label: t.catBugFix, count: stats?.categoryCounts['bug-fix'] || 0 },
    { id: 'simplification', label: t.catSimplification, count: stats?.categoryCounts['simplification'] || 0 },
    { id: 'process', label: t.catProcess, count: stats?.categoryCounts['process'] || 0 },
    { id: 'testing', label: t.catTesting, count: stats?.categoryCounts['testing'] || 0 },
  ];

  const topTags = [
    'Cordis & Events',
    'TUI',
    'Web GUI',
    'ACP Protocol',
    'LLM & Streaming',
    'Token & Compaction',
    'Capability Seams',
    'Session & Persistence',
    'Skills & Presets',
    'Windows Support'
  ];

  const hasActiveFilters = selectedLifecycle !== 'all' || selectedCategory !== 'all' || selectedTag !== 'all' || searchTerm.trim() !== '';

  const handleResetFilters = () => {
    onSelectLifecycle('all');
    onSelectCategory('all');
    onSelectTag('all');
    onSearchTermChange('');
  };

  return (
    <div className="space-y-3.5 bg-slate-900/50 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-lg">
      
      {/* Top Row: Lifecycle Selector & Search & Sort */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Lifecycle Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 md:pb-0">
          {lifecycles.map(l => {
            const isSelected = selectedLifecycle === l.id;
            return (
              <button
                key={l.id}
                onClick={() => onSelectLifecycle(l.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-100 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span>{l.label}</span>
                {l.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-slate-300 text-slate-900' : 'bg-slate-800 text-slate-400'}`}>
                    {l.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search input & Sort selector */}
        <div className="flex items-center gap-2 justify-between md:justify-end">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              placeholder={t.filterByTitlePlaceholder}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchTermChange('')}
                className="absolute right-2.5 top-2 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-400">
            <ArrowUpDown className="w-3 h-3 text-slate-500" />
            <select
              value={sortOrder}
              onChange={(e) => onSortOrderChange(e.target.value)}
              className="bg-transparent text-slate-300 focus:outline-none text-xs cursor-pointer"
            >
              <option value="date-desc" className="bg-slate-900 text-slate-200">{t.sortNewestFirst}</option>
              <option value="date-asc" className="bg-slate-900 text-slate-200">{t.sortOldestFirst}</option>
              <option value="title" className="bg-slate-900 text-slate-200">{t.sortTitleAZ}</option>
            </select>
          </div>
        </div>

      </div>

      {/* Middle Row: Categories Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pt-1 pb-1">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 flex-shrink-0">
          {t.categoryLabel}
        </span>
        {categories.map(cat => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1 ${
                isSelected
                  ? 'bg-indigo-600 text-white font-semibold shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>{cat.label}</span>
              {cat.count !== undefined && cat.id !== 'all' && (
                <span className="text-[10px] text-slate-400">({cat.count})</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Row: Popular Topic Tags & Active Count */}
      <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mr-1">
            <Tag className="w-3 h-3 text-slate-400" />
            {t.pillarsLabel}
          </span>
          {topTags.map(tag => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => onSelectTag(isSelected ? 'all' : tag)}
                className={`text-[11px] px-2 py-0.5 rounded-md font-medium transition-all ${
                  isSelected
                    ? 'bg-indigo-950 text-indigo-300 border border-indigo-500 font-semibold'
                    : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-slate-400">
            {t.showingDecisions} <strong className="text-white">{totalFiltered}</strong> {t.decisionsCountLabel}
          </span>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 underline font-medium flex items-center gap-0.5"
            >
              {t.resetFilters}
            </button>
          )}
        </div>
      </div>

    </div>
  );
};

