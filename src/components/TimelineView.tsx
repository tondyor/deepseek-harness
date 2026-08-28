import React, { useState } from 'react';
import { Calendar, Clock, ChevronRight, Filter, Sparkles, CheckCircle2, Archive } from 'lucide-react';
import { NoteItem, LanguageMode, UILanguage } from '../types';
import { getCategoryBadgeStyle, getLifecycleBadgeStyle } from './NoteCard';
import { i18n } from '../i18n';

interface TimelineViewProps {
  notes: NoteItem[];
  langMode: LanguageMode;
  uiLang: UILanguage;
  onSelectNote: (noteId: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  notes,
  langMode,
  uiLang,
  onSelectNote
}) => {
  const t = i18n[uiLang];
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  // Group notes by month
  const groupedByMonth = notes.reduce((acc, note) => {
    const month = note.date.slice(0, 7); // 'YYYY-MM'
    if (!acc[month]) acc[month] = [];
    acc[month].push(note);
    return acc;
  }, {} as Record<string, NoteItem[]>);

  const months = Object.keys(groupedByMonth).sort((a, b) => b.localeCompare(a));

  const formatMonthTitle = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    const locale = uiLang === 'ru' ? 'ru-RU' : 'en-US';
    return date.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
  };

  const displayedMonths = selectedMonth === 'all' ? months : [selectedMonth];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Month Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            {t.timelineTitle} ({notes.length} {t.totalMilestones})
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
          <button
            onClick={() => setSelectedMonth('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              selectedMonth === 'all'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {t.allMonths}
          </button>
          {months.map(m => (
            <button
              key={m}
              onClick={() => setSelectedMonth(m)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                selectedMonth === m
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {formatMonthTitle(m)} ({groupedByMonth[m].length})
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="space-y-12">
        {displayedMonths.map(month => (
          <div key={month} className="space-y-4">
            
            {/* Month Header Banner */}
            <div className="sticky top-16 z-20 py-2 bg-slate-950/90 backdrop-blur-sm border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 capitalize">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-indigo-500/20" />
                {formatMonthTitle(month)}
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {groupedByMonth[month].length} {t.monthDecisions}
              </span>
            </div>

            {/* List of notes in this month */}
            <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-800 space-y-4 ml-3">
              {groupedByMonth[month].map(note => {
                const lifecycleInfo = getLifecycleBadgeStyle(note.lifecycle, uiLang);
                const displayTitle = (langMode === 'zh' && note.titleZh) ? note.titleZh : note.title;

                return (
                  <div
                    key={note.id}
                    onClick={() => onSelectNote(note.id)}
                    className="relative group p-4 sm:p-5 rounded-2xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800/80 hover:border-indigo-500/50 transition-all cursor-pointer shadow-md hover:shadow-indigo-950/40"
                  >
                    {/* Timeline Node Dot */}
                    <div className="absolute -left-[31px] sm:-left-[39px] top-6 w-3.5 h-3.5 rounded-full bg-slate-950 border-2 border-indigo-400 group-hover:bg-indigo-400 transition-colors" />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getCategoryBadgeStyle(note.category)}`}>
                          {note.category}
                        </span>
                        <span className={`flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${lifecycleInfo.bg}`}>
                          {lifecycleInfo.icon}
                          <span>{lifecycleInfo.label}</span>
                        </span>
                        {note.hasZh && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/40 font-mono">
                            EN/中
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {note.date}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors mb-1.5">
                      {displayTitle}
                    </h4>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                      {note.problemExcerpt || note.summary}
                    </p>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/60">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {note.tags.map((t, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400">
                            #{t}
                          </span>
                        ))}
                      </div>
                      <span className="font-semibold text-indigo-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        {t.readNote} <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

