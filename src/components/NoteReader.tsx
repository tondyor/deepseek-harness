import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Share2, 
  Languages, 
  ArrowLeft, 
  ArrowRight, 
  Link2, 
  FileCode, 
  BookOpen, 
  Info, 
  ChevronRight,
  ExternalLink,
  Code2
} from 'lucide-react';
import { NoteDetail, LanguageMode, UILanguage } from '../types';
import { getCategoryBadgeStyle, getLifecycleBadgeStyle } from './NoteCard';
import { i18n } from '../i18n';

interface NoteReaderProps {
  note: NoteDetail | null;
  isLoading: boolean;
  onClose: () => void;
  onSelectNote: (noteId: string) => void;
  langMode: LanguageMode;
  onLangModeChange: (mode: LanguageMode) => void;
  uiLang: UILanguage;
  allNotes?: Array<{ id: string; title: string }>;
}

export const NoteReader: React.FC<NoteReaderProps> = ({
  note,
  isLoading,
  onClose,
  onSelectNote,
  langMode,
  onLangModeChange,
  uiLang,
  allNotes = []
}) => {
  const t = i18n[uiLang];
  const [copied, setCopied] = useState(false);
  const [showYaml, setShowYaml] = useState(false);
  const [activeTab, setActiveTab] = useState<'en' | 'zh' | 'bilingual'>(
    langMode === 'zh' ? 'zh' : langMode === 'bilingual' ? 'bilingual' : 'en'
  );

  useEffect(() => {
    if (langMode === 'zh' && note?.hasZh) {
      setActiveTab('zh');
    } else if (langMode === 'bilingual' && note?.hasZh) {
      setActiveTab('bilingual');
    } else {
      setActiveTab('en');
    }
  }, [langMode, note]);

  if (!note && !isLoading) {
    return null;
  }

  const handleCopyMarkdown = () => {
    if (!note) return;
    const textToCopy = activeTab === 'zh' && note.contentZh ? note.contentZh : note.contentEn;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!note) return;
    const text = activeTab === 'zh' && note.contentZh ? note.contentZh : note.contentEn;
    const filename = `${note.slug}${activeTab === 'zh' ? '.zh' : ''}.md`;
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Find index in allNotes for next/prev
  const currentIndex = allNotes.findIndex(n => n.id === note?.id);
  const prevNote = currentIndex > 0 ? allNotes[currentIndex - 1] : null;
  const nextNote = currentIndex >= 0 && currentIndex < allNotes.length - 1 ? allNotes[currentIndex + 1] : null;

  const lifecycleInfo = note ? getLifecycleBadgeStyle(note.lifecycle, uiLang) : null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-md flex justify-end animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-slate-900 border-l border-slate-800 shadow-2xl h-full flex flex-col">
        
        {/* Top Sticky Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-slate-800 bg-slate-950/90 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 min-w-0">
            <button
              id="reader-close-btn"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-all"
              title={t.closeEsc}
            >
              <X className="w-4 h-4" />
            </button>

            {note && (
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getCategoryBadgeStyle(note.category)}`}>
                    {note.category}
                  </span>
                  {lifecycleInfo && (
                    <span className={`flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${lifecycleInfo.bg}`}>
                      {lifecycleInfo.icon}
                      <span>{lifecycleInfo.label}</span>
                    </span>
                  )}
                  <span className="text-xs text-slate-400 font-mono">
                    {note.date}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white truncate max-w-xl">
                  {activeTab === 'zh' && note.titleZh ? note.titleZh : note.title}
                </h2>
              </div>
            )}
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 flex-shrink-0">
            
            {/* Language Switcher */}
            {note?.hasZh && (
              <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-lg p-0.5 text-xs font-medium">
                <button
                  id="reader-lang-en"
                  onClick={() => setActiveTab('en')}
                  className={`px-2.5 py-1 rounded transition-all ${
                    activeTab === 'en' ? 'bg-indigo-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.tabEnglish}
                </button>
                <button
                  id="reader-lang-zh"
                  onClick={() => setActiveTab('zh')}
                  className={`px-2.5 py-1 rounded transition-all ${
                    activeTab === 'zh' ? 'bg-indigo-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.tabChinese}
                </button>
                <button
                  id="reader-lang-bilingual"
                  onClick={() => setActiveTab('bilingual')}
                  className={`px-2.5 py-1 rounded transition-all hidden md:block ${
                    activeTab === 'bilingual' ? 'bg-indigo-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.tabSideBySide}
                </button>
              </div>
            )}

            {note?.i18nYaml && (
              <button
                id="toggle-yaml-btn"
                onClick={() => setShowYaml(!showYaml)}
                className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1 transition-all ${
                  showYaml 
                    ? 'bg-purple-950/80 text-purple-300 border-purple-700' 
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
                title={t.yamlMeta}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">YAML</span>
              </button>
            )}

            {/* Copy Button */}
            <button
              id="copy-markdown-btn"
              onClick={handleCopyMarkdown}
              className="p-2 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all flex items-center gap-1 text-xs"
              title={t.copyBtn}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? t.copiedBtn : t.copyBtn}</span>
            </button>

            {/* Download Button */}
            <button
              id="download-note-btn"
              onClick={handleDownload}
              className="p-2 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all text-xs"
              title={t.downloadBtn}
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-3">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm">{t.loadingContent}</p>
            </div>
          ) : note ? (
            <>
              {/* YAML Sidecar Panel */}
              {showYaml && note.i18nYaml && (
                <div className="p-4 rounded-xl bg-slate-950 border border-purple-800/50 text-xs font-mono text-purple-300 overflow-x-auto">
                  <div className="flex items-center justify-between mb-2 text-slate-400 font-sans font-semibold">
                    <span>{t.yamlMeta}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-900/40 text-purple-300">YAML</span>
                  </div>
                  <pre>{note.i18nYaml}</pre>
                </div>
              )}

              {/* Path & Metadata Banner */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-400 font-mono truncate">
                  <FileCode className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                  <span className="truncate">{activeTab === 'zh' && note.filePathZh ? note.filePathZh : note.filePathEn}</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {note.tags.map((tag, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Main Markdown Content Area */}
              {activeTab === 'bilingual' && note.contentZh ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* English Column */}
                  <div className="space-y-4">
                    <div className="pb-2 border-b border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">{t.englishSource}</span>
                      <span className="text-[11px] text-slate-500 font-mono">{note.filePathEn.split('/').pop()}</span>
                    </div>
                    <div className="markdown-prose text-slate-200">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {note.contentEn}
                      </ReactMarkdown>
                    </div>
                  </div>

                  {/* Chinese Column */}
                  <div className="space-y-4">
                    <div className="pb-2 border-b border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-purple-400">{t.chineseTranslation}</span>
                      <span className="text-[11px] text-slate-500 font-mono">{note.filePathZh?.split('/').pop()}</span>
                    </div>
                    <div className="markdown-prose text-slate-200">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {note.contentZh}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="markdown-prose text-slate-200 max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {activeTab === 'zh' && note.contentZh ? note.contentZh : note.contentEn}
                  </ReactMarkdown>
                </div>
              )}

              {/* Backlinks & Cross References Grid */}
              <div className="mt-12 pt-8 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Inbound Backlinks */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-indigo-400" />
                    {t.citedBy} ({note.backlinks.length})
                  </h4>
                  {note.backlinks.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">{t.noBacklinks}</p>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {note.backlinks.map(bl => (
                        <button
                          key={bl.id}
                          onClick={() => onSelectNote(bl.id)}
                          className="w-full text-left p-2 rounded-lg bg-slate-900/80 hover:bg-indigo-950/50 border border-slate-800/80 hover:border-indigo-700/60 text-xs text-slate-300 hover:text-indigo-300 transition-all flex items-center justify-between group"
                        >
                          <span className="truncate pr-2">{bl.title}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Outbound Cross References */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
                    {t.outboundReferences} ({note.links.length})
                  </h4>
                  {note.links.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">{t.noOutbound}</p>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {note.links.map((link, idx) => {
                        const targetSlug = link.split('/').pop()?.replace('.zh.md', '').replace('.md', '');
                        return (
                          <div
                            key={idx}
                            onClick={() => {
                              if (targetSlug) onSelectNote(targetSlug);
                            }}
                            className="p-2 rounded-lg bg-slate-900/80 hover:bg-purple-950/50 border border-slate-800/80 hover:border-purple-700/60 text-xs text-slate-300 hover:text-purple-300 transition-all flex items-center justify-between cursor-pointer group"
                          >
                            <span className="font-mono text-[11px] truncate pr-2">{link}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 flex-shrink-0" />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            </>
          ) : null}
        </div>

        {/* Bottom Pagination Bar */}
        <div className="flex-shrink-0 px-6 py-3.5 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between gap-4 text-xs">
          {prevNote ? (
            <button
              onClick={() => onSelectNote(prevNote.id)}
              className="flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors truncate max-w-[45%]"
            >
              <ArrowLeft className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{t.prevNote}: {prevNote.title}</span>
            </button>
          ) : <div />}

          {nextNote ? (
            <button
              onClick={() => onSelectNote(nextNote.id)}
              className="flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors truncate max-w-[45%] text-right ml-auto"
            >
              <span className="truncate">{t.nextNote}: {nextNote.title}</span>
              <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
            </button>
          ) : <div />}
        </div>

      </div>
    </div>
  );
};

