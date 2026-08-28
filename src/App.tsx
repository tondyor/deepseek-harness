import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { NoteCard } from './components/NoteCard';
import { NoteReader } from './components/NoteReader';
import { ArchitectureMap } from './components/ArchitectureMap';
import { TimelineView } from './components/TimelineView';
import { SearchModal } from './components/SearchModal';
import { NoteItem, NoteDetail, ViewMode, LanguageMode, UILanguage, RepositoryStats } from './types';
import { BookOpen, Layers, Clock, Sparkles, FolderGit2, CheckCircle2, Archive, HelpCircle } from 'lucide-react';
import { i18n } from './i18n';

export function App() {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [stats, setStats] = useState<RepositoryStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // View & Filter States
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [langMode, setLangMode] = useState<LanguageMode>('en');
  const [uiLang, setUiLang] = useState<UILanguage>('ru'); // default to Russian as requested
  const [selectedLifecycle, setSelectedLifecycle] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('date-desc');

  const t = i18n[uiLang];

  // Reader & Modal States
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [selectedNoteDetail, setSelectedNoteDetail] = useState<NoteDetail | null>(null);
  const [isNoteLoading, setIsNoteLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Load initial notes & stats
  const fetchNotesAndStats = async () => {
    try {
      const [notesRes, statsRes] = await Promise.all([
        fetch('/api/notes'),
        fetch('/api/stats')
      ]);
      const notesData = await notesRes.json();
      const statsData = await statsRes.json();

      setNotes(notesData.notes || []);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load notes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotesAndStats();
  }, []);

  // Handle URL hash / search params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const noteParam = params.get('note');
    if (noteParam) {
      setSelectedNoteId(noteParam);
    }
  }, []);

  // Fetch note details when selected
  useEffect(() => {
    if (!selectedNoteId) {
      setSelectedNoteDetail(null);
      return;
    }

    const fetchDetail = async () => {
      setIsNoteLoading(true);
      try {
        const res = await fetch(`/api/notes/${encodeURIComponent(selectedNoteId)}`);
        if (res.ok) {
          const data = await res.json();
          setSelectedNoteDetail(data);
        } else {
          console.error('Note not found');
        }
      } catch (err) {
        console.error('Failed to fetch note detail:', err);
      } finally {
        setIsNoteLoading(false);
      }
    };

    fetchDetail();
  }, [selectedNoteId]);

  // Global hotkeys (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        if (isSearchOpen) setIsSearchOpen(false);
        else if (selectedNoteId) setSelectedNoteId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, selectedNoteId]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetch('/api/refresh', { method: 'POST' });
      await fetchNotesAndStats();
    } catch (err) {
      console.error('Failed to refresh cache:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Filter notes
  const filteredNotes = useMemo(() => {
    let result = [...notes];

    if (selectedLifecycle !== 'all') {
      result = result.filter(n => n.lifecycle === selectedLifecycle);
    }

    if (selectedCategory !== 'all') {
      result = result.filter(n => n.category === selectedCategory);
    }

    if (selectedTag !== 'all') {
      result = result.filter(n => n.tags.includes(selectedTag));
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(n => 
        n.title.toLowerCase().includes(q) ||
        (n.titleZh && n.titleZh.toLowerCase().includes(q)) ||
        n.slug.toLowerCase().includes(q) ||
        n.summary.toLowerCase().includes(q) ||
        n.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (sortOrder === 'date-asc') {
      result.sort((a, b) => a.date.localeCompare(b.date));
    } else if (sortOrder === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      result.sort((a, b) => b.date.localeCompare(a.date));
    }

    return result;
  }, [notes, selectedLifecycle, selectedCategory, selectedTag, searchTerm, sortOrder]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Global Header */}
      <Header
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        langMode={langMode}
        onLangModeChange={setLangMode}
        uiLang={uiLang}
        onUILangChange={setUiLang}
        onOpenSearch={() => setIsSearchOpen(true)}
        stats={stats}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* View mode 1: Architectural Decision Cards & Filters */}
        {viewMode === 'grid' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Top Quick Stats Strip */}
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-950/60 text-indigo-400 border border-indigo-800/50">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-slate-400">{t.totalDecisions}</span>
                    <p className="text-lg font-bold text-white">{stats.totalNotes}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-slate-400">{t.implementedRecords}</span>
                    <p className="text-lg font-bold text-emerald-400">
                      {stats.lifecycleCounts['implemented'] || 0}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-800/60 text-slate-400 border border-slate-700/50">
                    <Archive className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-slate-400">{t.archivedRecords}</span>
                    <p className="text-lg font-bold text-slate-300">
                      {stats.lifecycleCounts['archived'] || 0}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-950/60 text-purple-400 border border-purple-800/50">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-slate-400">{t.bilingualRecords}</span>
                    <p className="text-lg font-bold text-purple-300">{stats.bilingualCount}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Filter Bar */}
            <FilterBar
              selectedLifecycle={selectedLifecycle}
              onSelectLifecycle={setSelectedLifecycle}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedTag={selectedTag}
              onSelectTag={setSelectedTag}
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
              sortOrder={sortOrder}
              onSortOrderChange={setSortOrder}
              stats={stats}
              totalFiltered={filteredNotes.length}
              uiLang={uiLang}
            />

            {/* Notes Grid */}
            {isLoading ? (
              <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm">{t.searchingCorpus}</p>
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="py-16 text-center rounded-2xl bg-slate-900/30 border border-slate-800 text-slate-400 space-y-3">
                <FolderGit2 className="w-8 h-8 mx-auto text-slate-600" />
                <h3 className="text-base font-semibold text-slate-300">{t.noDecisionsMatch}</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {t.noDecisionsDesc}
                </p>
                <button
                  onClick={() => {
                    setSelectedLifecycle('all');
                    setSelectedCategory('all');
                    setSelectedTag('all');
                    setSearchTerm('');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow"
                >
                  {t.clearFilters}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {filteredNotes.map(note => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    langMode={langMode}
                    uiLang={uiLang}
                    onSelect={(id) => setSelectedNoteId(id)}
                    isSelected={selectedNoteId === note.id}
                  />
                ))}
              </div>
            )}

          </div>
        )}

        {/* View mode 2: Interactive System Architecture Map */}
        {viewMode === 'architecture' && (
          <ArchitectureMap
            notes={notes}
            uiLang={uiLang}
            onSelectNote={(id) => setSelectedNoteId(id)}
          />
        )}

        {/* View mode 3: Chronological Decision Timeline */}
        {viewMode === 'timeline' && (
          <TimelineView
            notes={notes}
            langMode={langMode}
            uiLang={uiLang}
            onSelectNote={(id) => setSelectedNoteId(id)}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/80 px-4 sm:px-6 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-1.5">
            <span>{t.footerTitle}</span>
            <span>•</span>
            <span className="font-mono text-slate-400">{t.footerSpecification}</span>
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>{t.runtimeInfo}</span>
            <span>{t.frontdoorsInfo}</span>
          </div>
        </div>
      </footer>

      {/* Full-Feature Markdown Reader Modal / Drawer */}
      {selectedNoteId && (
        <NoteReader
          note={selectedNoteDetail}
          isLoading={isNoteLoading}
          onClose={() => setSelectedNoteId(null)}
          onSelectNote={(id) => setSelectedNoteId(id)}
          langMode={langMode}
          onLangModeChange={setLangMode}
          uiLang={uiLang}
          allNotes={notes.map(n => ({ id: n.id, title: n.title }))}
        />
      )}

      {/* Spotlight Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectNote={(id) => setSelectedNoteId(id)}
        uiLang={uiLang}
      />

    </div>
  );
}
export default App;

