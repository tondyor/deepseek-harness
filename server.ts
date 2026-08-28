import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

interface NoteItem {
  id: string;
  slug: string;
  title: string;
  titleZh?: string;
  lifecycle: 'implemented' | 'archived' | 'proposed' | 'rejected';
  category: 'architecture' | 'feature' | 'bug-fix' | 'simplification' | 'process' | 'testing';
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

interface NoteDetail extends NoteItem {
  contentEn: string;
  contentZh?: string;
  i18nYaml?: string;
  backlinks: Array<{ id: string; title: string; category: string; lifecycle: string }>;
}

let cachedNotes: NoteItem[] = [];
let cachedDetails: Map<string, NoteDetail> = new Map();

function extractTags(text: string, title: string): string[] {
  const haystack = (title + ' ' + text).toLowerCase();
  const tagKeywords: Record<string, string[]> = {
    'Cordis & Events': ['cordis', 'event taxonomy', 'waterfall', 'emitter', 'dispatch'],
    'TUI': ['tui', 'terminal', 'readline', 'terminal-state', 'pane-title', 'banner'],
    'Web GUI': ['web-client', 'web ui', 'web message', 'composer', 'sidebar', 'gui'],
    'ACP Protocol': ['acp', 'agent-client-protocol', 'acp-terminal'],
    'LLM & Streaming': ['llm', 'stream', 'sse', 'deepseek', 'model-catalog', 'reasoning'],
    'Session & Persistence': ['session', 'persistence', 'jsonl', 'zstandard', 'restore', 'write-coordinator'],
    'Token & Compaction': ['compaction', 'token', 'meter', 'pressure', 'overflow'],
    'Capability Seams': ['seam', 'filesystem', 'subprocess', 'lsp', 'job-registry', 'directory-picker'],
    'Skills & Presets': ['skill', 'preset', 'slash-command', 'profile-plugin'],
    'Error & Lifecycle': ['cancellation', 'error-taxonomy', 'resilience', 'lifecycle', 'timeout', 'deadline'],
    'Windows Support': ['windows', 'dacl', 'wine', 'powershell'],
    'Testing & CI': ['snapshot', 'gate', 'ci', 'fixture', 'matrix', 'execa']
  };

  const detected: string[] = [];
  for (const [tag, keywords] of Object.entries(tagKeywords)) {
    if (keywords.some(kw => haystack.includes(kw))) {
      detected.push(tag);
    }
  }
  return detected.slice(0, 4);
}

function parseMarkdownHeaders(content: string) {
  const lines = content.split('\n');
  let title = '';
  let status = 'implemented';

  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    const line = lines[i].trim();
    if (line.startsWith('# Agent Note:')) {
      title = line.replace('# Agent Note:', '').trim();
    } else if (line.startsWith('# ')) {
      title = line.replace('# ', '').trim();
    } else if (line.startsWith('Status:')) {
      status = line.replace('Status:', '').trim();
    }
  }

  // Extract sections
  let problemExcerpt = '';
  let decisionExcerpt = '';

  const problemMatch = content.match(/## (?:Problem|问题)[\r\n]+([\s\S]*?)(?=##|$)/);
  if (problemMatch && problemMatch[1]) {
    problemExcerpt = problemMatch[1].trim().split('\n')[0].replace(/[*_#`[\]]/g, '').slice(0, 180);
  }

  const decisionMatch = content.match(/## (?:Decision|Proposal|决策|提案)[\r\n]+([\s\S]*?)(?=##|$)/);
  if (decisionMatch && decisionMatch[1]) {
    decisionExcerpt = decisionMatch[1].trim().split('\n')[0].replace(/[*_#`[\]]/g, '').slice(0, 180);
  }

  const summary = problemExcerpt || decisionExcerpt || title;

  // Extract markdown links
  const links: string[] = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const href = match[2];
    if (href.endsWith('.md') && !href.startsWith('http')) {
      links.push(href);
    }
  }

  return { title, status, problemExcerpt, decisionExcerpt, summary, links };
}

function scanNotes(): { notes: NoteItem[]; details: Map<string, NoteDetail> } {
  const notesDir = path.join(process.cwd(), '.agents', 'notes');
  const result: NoteItem[] = [];
  const detailsMap = new Map<string, NoteDetail>();

  if (!fs.existsSync(notesDir)) {
    return { notes: [], details: detailsMap };
  }

  const lifecycles: Array<'implemented' | 'archived' | 'proposed' | 'rejected'> = ['implemented', 'archived', 'proposed', 'rejected'];
  const categories: Array<'architecture' | 'feature' | 'bug-fix' | 'simplification' | 'process' | 'testing'> = [
    'architecture', 'feature', 'bug-fix', 'simplification', 'process', 'testing'
  ];

  for (const lifecycle of lifecycles) {
    const lifePath = path.join(notesDir, lifecycle);
    if (!fs.existsSync(lifePath)) continue;

    for (const category of categories) {
      const catPath = path.join(lifePath, category);
      if (!fs.existsSync(catPath)) continue;

      const files = fs.readdirSync(catPath);
      // Group by slug (filename without .zh.md or .md)
      const slugGroups = new Map<string, { en?: string; zh?: string; yaml?: string }>();

      for (const file of files) {
        if (file.endsWith('.zh.md')) {
          const slug = file.replace('.zh.md', '');
          if (!slugGroups.has(slug)) slugGroups.set(slug, {});
          slugGroups.get(slug)!.zh = file;
        } else if (file.endsWith('.md')) {
          const slug = file.replace('.md', '');
          if (!slugGroups.has(slug)) slugGroups.set(slug, {});
          slugGroups.get(slug)!.en = file;
        } else if (file.endsWith('.i18n.yaml')) {
          const slug = file.replace('.i18n.yaml', '');
          if (!slugGroups.has(slug)) slugGroups.set(slug, {});
          slugGroups.get(slug)!.yaml = file;
        }
      }

      for (const [slug, group] of slugGroups.entries()) {
        if (!group.en) continue;

        const filePathEn = path.join(catPath, group.en);
        const contentEn = fs.readFileSync(filePathEn, 'utf-8');
        const parsedEn = parseMarkdownHeaders(contentEn);

        let contentZh: string | undefined;
        let titleZh: string | undefined;
        let filePathZh: string | undefined;

        if (group.zh) {
          filePathZh = path.join(catPath, group.zh);
          contentZh = fs.readFileSync(filePathZh, 'utf-8');
          const parsedZh = parseMarkdownHeaders(contentZh);
          titleZh = parsedZh.title;
        }

        let i18nYaml: string | undefined;
        if (group.yaml) {
          i18nYaml = fs.readFileSync(path.join(catPath, group.yaml), 'utf-8');
        }

        // Date extraction from slug YYYY-MM-DD-...
        const dateMatch = slug.match(/^(\d{4}-\d{2}-\d{2})/);
        const date = dateMatch ? dateMatch[1] : '2026-06-01';

        const id = `${lifecycle}-${category}-${slug}`;
        const tags = extractTags(contentEn, parsedEn.title);

        const noteItem: NoteItem = {
          id,
          slug,
          title: parsedEn.title || slug,
          titleZh,
          lifecycle,
          category,
          date,
          status: parsedEn.status,
          hasZh: Boolean(group.zh),
          filePathEn: path.relative(process.cwd(), filePathEn),
          filePathZh: filePathZh ? path.relative(process.cwd(), filePathZh) : undefined,
          summary: parsedEn.summary,
          problemExcerpt: parsedEn.problemExcerpt,
          decisionExcerpt: parsedEn.decisionExcerpt,
          tags,
          links: parsedEn.links
        };

        result.push(noteItem);

        const detail: NoteDetail = {
          ...noteItem,
          contentEn,
          contentZh,
          i18nYaml,
          backlinks: []
        };

        detailsMap.set(id, detail);
      }
    }
  }

  // Sort notes by date descending
  result.sort((a, b) => b.date.localeCompare(a.date));

  // Compute backlinks
  for (const [id, detail] of detailsMap.entries()) {
    for (const [targetId, targetDetail] of detailsMap.entries()) {
      if (id === targetId) continue;
      const targetSlug = targetDetail.slug;
      const isLinked = detail.links.some(l => l.includes(targetSlug)) || detail.contentEn.includes(targetSlug);
      if (isLinked) {
        targetDetail.backlinks.push({
          id: detail.id,
          title: detail.title,
          category: detail.category,
          lifecycle: detail.lifecycle
        });
      }
    }
  }

  return { notes: result, details: detailsMap };
}

function refreshCache() {
  const { notes, details } = scanNotes();
  cachedNotes = notes;
  cachedDetails = details;
}

// Initial scan
refreshCache();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', notesCount: cachedNotes.length });
  });

  // Get all notes with filtering
  app.get('/api/notes', (req, res) => {
    const { lifecycle, category, tag, search, sort } = req.query;

    let filtered = [...cachedNotes];

    if (lifecycle && typeof lifecycle === 'string' && lifecycle !== 'all') {
      filtered = filtered.filter(n => n.lifecycle === lifecycle);
    }

    if (category && typeof category === 'string' && category !== 'all') {
      filtered = filtered.filter(n => n.category === category);
    }

    if (tag && typeof tag === 'string' && tag !== 'all') {
      filtered = filtered.filter(n => n.tags.includes(tag));
    }

    if (search && typeof search === 'string' && search.trim()) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(q) ||
        (n.titleZh && n.titleZh.toLowerCase().includes(q)) ||
        n.slug.toLowerCase().includes(q) ||
        n.summary.toLowerCase().includes(q) ||
        n.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (sort === 'date-asc') {
      filtered.sort((a, b) => a.date.localeCompare(b.date));
    } else if (sort === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // Default: date descending
      filtered.sort((a, b) => b.date.localeCompare(a.date));
    }

    res.json({
      total: filtered.length,
      notes: filtered
    });
  });

  // Get note detail by id or slug
  app.get('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    let detail = cachedDetails.get(id);

    if (!detail) {
      // Try search by slug or partial id
      for (const [key, value] of cachedDetails.entries()) {
        if (value.slug === id || key.endsWith(id)) {
          detail = value;
          break;
        }
      }
    }

    if (!detail) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(detail);
  });

  // Full-text search across content
  app.get('/api/search', (req, res) => {
    const q = (req.query.q as string || '').toLowerCase().trim();
    if (!q) {
      return res.json({ results: [] });
    }

    const matches: Array<{
      id: string;
      title: string;
      titleZh?: string;
      lifecycle: string;
      category: string;
      date: string;
      snippet: string;
      matchType: 'title' | 'content';
    }> = [];

    for (const [id, detail] of cachedDetails.entries()) {
      const inTitle = detail.title.toLowerCase().includes(q) || (detail.titleZh && detail.titleZh.toLowerCase().includes(q));
      const inContent = detail.contentEn.toLowerCase().includes(q) || (detail.contentZh && detail.contentZh.toLowerCase().includes(q));

      if (inTitle || inContent) {
        let snippet = '';
        if (inContent) {
          const content = detail.contentEn;
          const idx = content.toLowerCase().indexOf(q);
          const start = Math.max(0, idx - 60);
          const end = Math.min(content.length, idx + q.length + 80);
          snippet = (start > 0 ? '...' : '') + content.slice(start, end).replace(/\n/g, ' ') + (end < content.length ? '...' : '');
        } else {
          snippet = detail.summary;
        }

        matches.push({
          id: detail.id,
          title: detail.title,
          titleZh: detail.titleZh,
          lifecycle: detail.lifecycle,
          category: detail.category,
          date: detail.date,
          snippet,
          matchType: inTitle ? 'title' : 'content'
        });
      }
    }

    res.json({ query: q, total: matches.length, results: matches.slice(0, 30) });
  });

  // Global repository statistics & taxonomy
  app.get('/api/stats', (req, res) => {
    const categoryCounts: Record<string, number> = {};
    const lifecycleCounts: Record<string, number> = {};
    const tagCounts: Record<string, number> = {};
    const monthlyActivity: Record<string, number> = {};

    for (const note of cachedNotes) {
      categoryCounts[note.category] = (categoryCounts[note.category] || 0) + 1;
      lifecycleCounts[note.lifecycle] = (lifecycleCounts[note.lifecycle] || 0) + 1;
      
      for (const tag of note.tags) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      }

      const month = note.date.slice(0, 7); // YYYY-MM
      monthlyActivity[month] = (monthlyActivity[month] || 0) + 1;
    }

    // Top connected notes (most backlinks)
    const topConnected = Array.from(cachedDetails.values())
      .map(d => ({ id: d.id, title: d.title, backlinksCount: d.backlinks.length, category: d.category }))
      .sort((a, b) => b.backlinksCount - a.backlinksCount)
      .slice(0, 8);

    res.json({
      totalNotes: cachedNotes.length,
      bilingualCount: cachedNotes.filter(n => n.hasZh).length,
      categoryCounts,
      lifecycleCounts,
      tagCounts,
      monthlyActivity,
      topConnected
    });
  });

  // Refresh index endpoint
  app.post('/api/refresh', (req, res) => {
    refreshCache();
    res.json({ status: 'ok', notesCount: cachedNotes.length });
  });

  // Vite middleware for development vs static for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DeepSeek Harness Explorer Server running on http://localhost:${PORT}`);
  });
}

startServer();
