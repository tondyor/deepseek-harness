import React from 'react';
import { Calendar, Link2, FileText, ArrowRight, CheckCircle2, Archive, HelpCircle, XCircle, Languages } from 'lucide-react';
import { NoteItem, LanguageMode, UILanguage } from '../types';
import { i18n } from '../i18n';

interface NoteCardProps {
  note: NoteItem;
  langMode: LanguageMode;
  uiLang: UILanguage;
  onSelect: (noteId: string) => void;
  isSelected?: boolean;
}

export const getCategoryBadgeStyle = (category: string) => {
  switch (category) {
    case 'architecture':
      return 'bg-purple-950/60 text-purple-300 border-purple-800/60';
    case 'feature':
      return 'bg-blue-950/60 text-blue-300 border-blue-800/60';
    case 'bug-fix':
      return 'bg-amber-950/60 text-amber-300 border-amber-800/60';
    case 'simplification':
      return 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60';
    case 'process':
      return 'bg-slate-900 text-slate-300 border-slate-700';
    case 'testing':
      return 'bg-rose-950/60 text-rose-300 border-rose-800/60';
    default:
      return 'bg-slate-900 text-slate-300 border-slate-800';
  }
};

export const getLifecycleBadgeStyle = (lifecycle: string, uiLang: UILanguage = 'en') => {
  const t = i18n[uiLang];
  switch (lifecycle) {
    case 'implemented':
      return {
        bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        icon: <CheckCircle2 className="w-3 h-3 text-emerald-400" />,
        label: t.lifecycleImplemented
      };
    case 'archived':
      return {
        bg: 'bg-slate-500/10 text-slate-400 border-slate-600/30',
        icon: <Archive className="w-3 h-3 text-slate-400" />,
        label: t.lifecycleArchived
      };
    case 'proposed':
      return {
        bg: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
        icon: <HelpCircle className="w-3 h-3 text-sky-400" />,
        label: t.lifecycleProposed
      };
    case 'rejected':
      return {
        bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        icon: <XCircle className="w-3 h-3 text-rose-400" />,
        label: t.lifecycleRejected
      };
    default:
      return {
        bg: 'bg-slate-800 text-slate-300 border-slate-700',
        icon: <FileText className="w-3 h-3" />,
        label: lifecycle
      };
  }
};

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  langMode,
  uiLang,
  onSelect,
  isSelected
}) => {
  const t = i18n[uiLang];
  const lifecycleInfo = getLifecycleBadgeStyle(note.lifecycle, uiLang);
  const displayTitle = (langMode === 'zh' && note.titleZh) ? note.titleZh : note.title;

  return (
    <div
      id={`note-card-${note.id}`}
      onClick={() => onSelect(note.id)}
      className={`group relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'bg-slate-900/90 border-indigo-500/80 ring-2 ring-indigo-500/30 shadow-xl shadow-indigo-950/40'
          : 'bg-slate-900/40 hover:bg-slate-900/80 border-slate-800/80 hover:border-slate-700 hover:shadow-lg hover:shadow-black/40'
      }`}
    >
      <div>
        {/* Top Badges and Date */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Category Tag */}
            <span className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getCategoryBadgeStyle(note.category)}`}>
              {note.category}
            </span>

            {/* Lifecycle Tag */}
            <span className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${lifecycleInfo.bg}`}>
              {lifecycleInfo.icon}
              <span>{lifecycleInfo.label}</span>
            </span>

            {/* Bilingual Tag */}
            {note.hasZh && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/50 flex items-center gap-0.5" title={t.enZhAvailable}>
                <Languages className="w-2.5 h-2.5" />
                <span>EN/中</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-400 font-mono flex-shrink-0">
            <Calendar className="w-3 h-3 text-slate-500" />
            <span>{note.date}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-2 mb-1.5 leading-snug">
          {displayTitle}
        </h3>

        {/* Alternate Language Subtitle if viewing bilingual/EN */}
        {note.titleZh && (langMode === 'en' || langMode === 'bilingual') && (
          <p className="text-xs text-slate-400 font-normal line-clamp-1 mb-2">
            {note.titleZh}
          </p>
        )}

        {/* Excerpt */}
        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
          {note.problemExcerpt || note.summary || 'Click to read architectural decision details.'}
        </p>
      </div>

      {/* Footer Tags & Read Action */}
      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-1.5 flex-wrap overflow-hidden max-h-6">
          {note.tags.slice(0, 2).map((tag, idx) => (
            <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
              #{tag}
            </span>
          ))}
          {note.links.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 text-slate-500 flex items-center gap-0.5" title={`${note.links.length} ${t.crossReferences}`}>
              <Link2 className="w-2.5 h-2.5" />
              {note.links.length}
            </span>
          )}
        </div>

        <button
          className="text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-all flex-shrink-0"
        >
          <span>{t.readAction}</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

