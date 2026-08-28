import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronRight, FileText, Sparkles } from 'lucide-react';
import { SearchResult, UILanguage } from '../types';
import { getCategoryBadgeStyle, getLifecycleBadgeStyle } from './NoteCard';
import { i18n } from '../i18n';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNote: (noteId: string) => void;
  uiLang: UILanguage;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectNote,
  uiLang
}) => {
  const t = i18n[uiLang];
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        setResults(data.results || []);
        setSelectedIndex(0);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      onSelectNote(results[selectedIndex].id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onKeyDown={handleKeyDown}
      >
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchModalPlaceholder}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {isLoading ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              {t.searchingCorpus}
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                {results.length} {t.matchesFound}
              </div>
              {results.map((res, index) => {
                const isSelected = index === selectedIndex;
                const lifecycleInfo = getLifecycleBadgeStyle(res.lifecycle, uiLang);

                return (
                  <div
                    key={res.id}
                    onClick={() => {
                      onSelectNote(res.id);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`p-3 rounded-xl transition-all cursor-pointer flex flex-col gap-1.5 ${
                      isSelected ? 'bg-indigo-600/20 border border-indigo-500/40 text-white' : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getCategoryBadgeStyle(res.category)}`}>
                          {res.category}
                        </span>
                        <span className={`flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${lifecycleInfo.bg}`}>
                          {lifecycleInfo.icon}
                          <span>{lifecycleInfo.label}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {res.date}
                        </span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 font-mono">
                        {res.matchType === 'title' ? t.titleMatch : t.contentMatch}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-white">
                      {res.title}
                    </h4>

                    {res.snippet && (
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {res.snippet}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : query.trim() ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              {t.noMatchesFor} "{query}"
            </div>
          ) : (
            <div className="py-8 px-4 text-center text-slate-500 text-xs space-y-2">
              <Sparkles className="w-5 h-5 mx-auto text-indigo-400/60" />
              <p>{t.searchHintsText}</p>
              <div className="flex items-center justify-center gap-1.5 flex-wrap pt-2">
                {['cordis', 'acp', 'compaction', 'sse stream', 'subprocesses', 'write-coordinator'].map(suggest => (
                  <button
                    key={suggest}
                    onClick={() => setQuery(suggest)}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 text-[11px]"
                  >
                    {suggest}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>Use <kbd className="px-1 py-0.5 bg-slate-800 rounded">↑</kbd> <kbd className="px-1 py-0.5 bg-slate-800 rounded">↓</kbd> {t.navHint}</span>
            <span><kbd className="px-1 py-0.5 bg-slate-800 rounded">↵</kbd> {t.openHint}</span>
          </div>
          <span>{t.searchFooterBranding}</span>
        </div>

      </div>
    </div>
  );
};

