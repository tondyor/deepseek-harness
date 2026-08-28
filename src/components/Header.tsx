import React from 'react';
import { 
  BookOpen, 
  Layers, 
  Clock, 
  Search, 
  RefreshCw, 
  Languages, 
  Sparkles, 
  FolderGit2,
  FileCode2,
  Terminal,
  Cpu,
  Globe
} from 'lucide-react';
import { ViewMode, LanguageMode, RepositoryStats, UILanguage } from '../types';
import { i18n } from '../i18n';

interface HeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  langMode: LanguageMode;
  onLangModeChange: (mode: LanguageMode) => void;
  uiLang: UILanguage;
  onUILangChange: (lang: UILanguage) => void;
  onOpenSearch: () => void;
  stats: RepositoryStats | null;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onViewModeChange,
  langMode,
  onLangModeChange,
  uiLang,
  onUILangChange,
  onOpenSearch,
  stats,
  onRefresh,
  isRefreshing
}) => {
  const t = i18n[uiLang];

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md px-4 sm:px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3.5">
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center flex-shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5">
                {t.appTitle}
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  {t.appSubtitle}
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {t.appTagline}
            </p>
          </div>
        </div>

        {/* Center Navigation Views */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 self-start md:self-auto overflow-x-auto max-w-full">
          <button
            id="view-nav-grid"
            onClick={() => onViewModeChange('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              viewMode === 'grid'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            {t.navDecisions} ({stats?.totalNotes || '...'})
          </button>
          
          <button
            id="view-nav-arch"
            onClick={() => onViewModeChange('architecture')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              viewMode === 'architecture'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            {t.navArchitecture}
          </button>

          <button
            id="view-nav-timeline"
            onClick={() => onViewModeChange('timeline')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              viewMode === 'timeline'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            {t.navTimeline}
          </button>
        </div>

        {/* Right Tools & Language Switcher */}
        <div className="flex items-center gap-2 justify-end flex-wrap sm:flex-nowrap">
          {/* Quick Search Button */}
          <button
            id="global-search-btn"
            onClick={onOpenSearch}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-medium transition-all group"
            title={t.searchPlaceholder}
          >
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
            <span className="hidden sm:inline">{t.searchBtn}</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-slate-950 text-slate-400 border border-slate-700/60 rounded">
              ⌘K
            </kbd>
          </button>

          {/* UI Language Switcher (EN / RU) */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-medium" title={t.interfaceLanguage}>
            <button
              id="ui-lang-en"
              onClick={() => onUILangChange('en')}
              className={`px-2 py-1 rounded transition-all flex items-center gap-1 ${
                uiLang === 'en' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EN
            </button>
            <button
              id="ui-lang-ru"
              onClick={() => onUILangChange('ru')}
              className={`px-2 py-1 rounded transition-all flex items-center gap-1 ${
                uiLang === 'ru' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              RU
            </button>
          </div>

          {/* Doc Content Bilingual Toggle (EN / ZH / Bilingual) */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-medium" title="Markdown Content Language">
            <button
              id="lang-btn-en"
              onClick={() => onLangModeChange('en')}
              className={`px-2 py-1 rounded ${
                langMode === 'en' ? 'bg-slate-800 text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="English Documents"
            >
              Doc: EN
            </button>
            <button
              id="lang-btn-zh"
              onClick={() => onLangModeChange('zh')}
              className={`px-2 py-1 rounded ${
                langMode === 'zh' ? 'bg-slate-800 text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="中文译本文档 (Chinese Documents)"
            >
              中
            </button>
            <button
              id="lang-btn-bilingual"
              onClick={() => onLangModeChange('bilingual')}
              className={`px-2 py-1 rounded hidden lg:block ${
                langMode === 'bilingual' ? 'bg-slate-800 text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Side-by-side Dual Language (EN / 中文)"
            >
              EN/中
            </button>
          </div>

          {/* Refresh Button */}
          <button
            id="refresh-index-btn"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors disabled:opacity-50"
            title={t.rescanRepo}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
        </div>

      </div>
    </header>
  );
};

