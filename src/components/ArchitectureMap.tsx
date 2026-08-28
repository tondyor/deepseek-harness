import React, { useState } from 'react';
import { 
  Cpu, 
  Terminal, 
  Monitor, 
  Layers, 
  GitFork, 
  HardDrive, 
  Radio, 
  ShieldCheck, 
  Database, 
  Zap, 
  FileSearch, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { NoteItem, UILanguage } from '../types';
import { i18n } from '../i18n';

interface ArchitectureMapProps {
  notes: NoteItem[];
  onSelectNote: (noteId: string) => void;
  uiLang: UILanguage;
}

interface SystemModule {
  id: string;
  name: string;
  nameZh: string;
  category: string;
  icon: React.ReactNode;
  tagColor: string;
  description: string;
  keyConcepts: string[];
  filterTag: string;
  coreDecisionsSlugs: string[];
}

export const ArchitectureMap: React.FC<ArchitectureMapProps> = ({
  notes,
  onSelectNote,
  uiLang
}) => {
  const t = i18n[uiLang];
  const [activeModuleId, setActiveModuleId] = useState<string>('microkernel');

  const modules: SystemModule[] = [
    {
      id: 'microkernel',
      name: t.pillarMicrokernelName,
      nameZh: t.pillarMicrokernelZh,
      category: t.pillarMicrokernelCategory,
      icon: <Cpu className="w-5 h-5 text-indigo-400" />,
      tagColor: 'from-indigo-500/20 to-purple-500/20 border-indigo-500/40 text-indigo-300',
      description: t.pillarMicrokernelDesc,
      keyConcepts: [
        t.pillarMicrokernelKey1,
        t.pillarMicrokernelKey2,
        t.pillarMicrokernelKey3,
        t.pillarMicrokernelKey4
      ],
      filterTag: 'Cordis & Events',
      coreDecisionsSlugs: [
        '2026-06-11-microkernel-event-taxonomy',
        '2026-06-11-dev-invariants-over-deep-readonly',
        '2026-06-18-agent-lifecycle-and-ownership-contracts',
        '2026-08-09-cordis-event-walk-backstop'
      ]
    },
    {
      id: 'interfaces',
      name: t.pillarInterfacesName,
      nameZh: t.pillarInterfacesZh,
      category: t.pillarInterfacesCategory,
      icon: <Terminal className="w-5 h-5 text-cyan-400" />,
      tagColor: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/40 text-cyan-300',
      description: t.pillarInterfacesDesc,
      keyConcepts: [
        t.pillarInterfacesKey1,
        t.pillarInterfacesKey2,
        t.pillarInterfacesKey3
      ],
      filterTag: 'TUI',
      coreDecisionsSlugs: [
        '2026-06-14-acp-agent-client-protocol',
        '2026-07-17-dedicated-full-screen-tui-front-door',
        '2026-07-19-gui-web-client-architecture',
        '2026-08-06-web-markdown-incremental-ast-renderer'
      ]
    },
    {
      id: 'llm-adapters',
      name: t.pillarLlmName,
      nameZh: t.pillarLlmZh,
      category: t.pillarLlmCategory,
      icon: <Radio className="w-5 h-5 text-purple-400" />,
      tagColor: 'from-purple-500/20 to-pink-500/20 border-purple-500/40 text-purple-300',
      description: t.pillarLlmDesc,
      keyConcepts: [
        t.pillarLlmKey1,
        t.pillarLlmKey2,
        t.pillarLlmKey3
      ],
      filterTag: 'LLM & Streaming',
      coreDecisionsSlugs: [
        '2026-06-13-twin-llm-adapters',
        '2026-07-14-provider-routed-llm-adapters',
        '2026-07-26-eventsource-parser-for-deepseek-sse',
        '2026-08-03-pi-ai-declared-provider-catalog'
      ]
    },
    {
      id: 'token-compaction',
      name: t.pillarTokenName,
      nameZh: t.pillarTokenZh,
      category: t.pillarTokenCategory,
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      tagColor: 'from-amber-500/20 to-yellow-500/20 border-amber-500/40 text-amber-300',
      description: t.pillarTokenDesc,
      keyConcepts: [
        t.pillarTokenKey1,
        t.pillarTokenKey2,
        t.pillarTokenKey3
      ],
      filterTag: 'Token & Compaction',
      coreDecisionsSlugs: [
        '2026-07-10-after-call-compaction-pressure-and-overflow-recovery',
        '2026-07-15-replay-token-meter-service',
        '2026-07-20-routed-model-context-and-compaction-policy',
        '2026-07-21-compaction-summary-prefix-cache-reuse'
      ]
    },
    {
      id: 'capability-seams',
      name: t.pillarSeamsName,
      nameZh: t.pillarSeamsZh,
      category: t.pillarSeamsCategory,
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      tagColor: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300',
      description: t.pillarSeamsDesc,
      keyConcepts: [
        t.pillarSeamsKey1,
        t.pillarSeamsKey2,
        t.pillarSeamsKey3
      ],
      filterTag: 'Capability Seams',
      coreDecisionsSlugs: [
        '2026-06-13-capability-seams',
        '2026-06-17-filesystem-capability-seam',
        '2026-07-26-subprocess-seam',
        '2026-08-01-packaged-ripgrep-search'
      ]
    },
    {
      id: 'persistence',
      name: t.pillarPersistenceName,
      nameZh: t.pillarPersistenceZh,
      category: t.pillarPersistenceCategory,
      icon: <Database className="w-5 h-5 text-rose-400" />,
      tagColor: 'from-rose-500/20 to-red-500/20 border-rose-500/40 text-rose-300',
      description: t.pillarPersistenceDesc,
      keyConcepts: [
        t.pillarPersistenceKey1,
        t.pillarPersistenceKey2,
        t.pillarPersistenceKey3
      ],
      filterTag: 'Session & Persistence',
      coreDecisionsSlugs: [
        '2026-06-11-event-sourced-sessions',
        '2026-06-14-session-persistence',
        '2026-06-18-shared-persistence-write-coordinator',
        '2026-07-19-zstandard-jsonl-session-logs'
      ]
    }
  ];

  const currentModule = modules.find(m => m.id === activeModuleId) || modules[0];

  // Find corresponding notes
  const matchedNotes = notes.filter(n => 
    currentModule.coreDecisionsSlugs.some(slug => n.slug.includes(slug)) ||
    n.tags.includes(currentModule.filterTag)
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Overview Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2 inline-block">
            {t.archBannerSubtitle}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            {t.archBannerTitle}
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            {t.archBannerDesc}
          </p>
        </div>
      </div>

      {/* Module Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map(mod => {
          const isSelected = mod.id === activeModuleId;
          return (
            <div
              key={mod.id}
              onClick={() => setActiveModuleId(mod.id)}
              className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer text-left flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-indigo-500 shadow-lg shadow-indigo-950/60 ring-2 ring-indigo-500/30'
                  : 'bg-slate-900/40 hover:bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    {mod.icon}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 font-mono">
                    {mod.category}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-100 mb-1">
                  {mod.name}
                </h3>
                <p className="text-xs text-slate-400 mb-3 line-clamp-1">
                  {mod.nameZh}
                </p>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {mod.description}
                </p>
              </div>

              <div className="pt-3 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">
                  {matchedNotes.length} {t.decisionNotesCount}
                </span>
                <span className={`font-semibold flex items-center gap-1 ${isSelected ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'}`}>
                  {t.inspectPillar} <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep-Dive Inspector for Active Pillar */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-indigo-500/30 shadow-2xl space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              {currentModule.icon}
            </div>
            <div>
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                {currentModule.category}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {currentModule.name}
              </h3>
              <p className="text-xs text-slate-400">
                {currentModule.nameZh}
              </p>
            </div>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 font-medium self-start sm:self-auto">
            Tag: #{currentModule.filterTag}
          </span>
        </div>

        {/* Key Concepts Grid */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {t.corePrinciples}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentModule.keyConcepts.map((concept, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-950 text-indigo-400 font-mono text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                  0{idx + 1}
                </span>
                <span className="leading-relaxed">{concept}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Relevant Decision Records */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            {t.decisionRecordsInPillar} ({matchedNotes.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {matchedNotes.slice(0, 8).map(note => (
              <div
                key={note.id}
                onClick={() => onSelectNote(note.id)}
                className="p-3.5 rounded-xl bg-slate-950/80 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-600/60 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="min-w-0 pr-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-slate-400">{note.date}</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-slate-800 text-slate-300 rounded font-medium">
                      {note.category}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 truncate">
                    {note.title}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

