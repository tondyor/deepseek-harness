export type UILanguage = 'en' | 'ru';

export const i18n = {
  en: {
    appTitle: 'DeepSeek Harness',
    appSubtitle: 'Agent Notes v1.0',
    appTagline: 'Architectural decision records, microkernel taxonomy, ACP protocols & system design',
    runtimeInfo: 'Runtime: Node.js / Cordis microkernel',
    frontdoorsInfo: 'Dual front-door: TUI & Web GUI',
    footerSpecification: '.agents/notes repository specification',
    footerTitle: 'DeepSeek Harness Architectural Knowledge Engine',
    
    // View Navigation
    navDecisions: 'Decisions',
    navArchitecture: 'Architecture Map',
    navTimeline: 'Timeline',
    searchPlaceholder: 'Search notes (Ctrl+K or ⌘K)...',
    searchBtn: 'Search...',
    rescanRepo: 'Rescan notes repository',

    // Stats
    totalDecisions: 'Total Decisions',
    implementedRecords: 'Implemented',
    archivedRecords: 'Archived Records',
    bilingualRecords: 'Bilingual (EN/ZH)',

    // Filter Bar
    allLifecycles: 'All Lifecycles',
    allCategories: 'All Categories',
    filterByTitlePlaceholder: 'Filter by title, tag, slug...',
    sortNewestFirst: 'Newest First',
    sortOldestFirst: 'Oldest First',
    sortTitleAZ: 'Title (A-Z)',
    categoryLabel: 'Category:',
    pillarsLabel: 'Pillars:',
    showingDecisions: 'Showing',
    decisionsCountLabel: 'decisions',
    resetFilters: 'Reset Filters',
    clearFilters: 'Clear Filters',
    noDecisionsMatch: 'No decisions match current criteria',
    noDecisionsDesc: 'Try adjusting the lifecycle filter, category selection, or search query.',

    // Categories
    catArchitecture: 'Architecture',
    catFeature: 'Feature',
    catBugFix: 'Bug-Fix',
    catSimplification: 'Simplification',
    catProcess: 'Process',
    catTesting: 'Testing',

    // Lifecycles
    lifecycleImplemented: 'Implemented',
    lifecycleArchived: 'Archived',
    lifecycleProposed: 'Proposed',
    lifecycleRejected: 'Rejected',

    // Note Card
    readAction: 'Read',
    crossReferences: 'cross-references',
    enZhAvailable: 'EN & ZH available',

    // Note Reader
    closeEsc: 'Close (Esc)',
    copyBtn: 'Copy',
    copiedBtn: 'Copied',
    downloadBtn: 'Download',
    yamlMeta: 'i18n Metadata & Consistency Record (.i18n.yaml)',
    englishSource: 'English Source',
    chineseTranslation: '中文译本 (Chinese Translation)',
    citedBy: 'Cited By',
    outboundReferences: 'Outbound References',
    noBacklinks: 'No notes link to this decision directly.',
    noOutbound: 'No external note references in this document.',
    prevNote: 'Prev',
    nextNote: 'Next',
    loadingContent: 'Loading note content...',
    tabEnglish: 'English',
    tabChinese: '中文',
    tabSideBySide: 'Side-by-Side',

    // Architecture Map
    archBannerSubtitle: 'System Topology & Architectural Pillars',
    archBannerTitle: 'DeepSeek Harness Architecture Map',
    archBannerDesc: 'The DeepSeek Harness architecture is built on a modular, event-driven microkernel where all functional layers are isolated behind typed capability seams and Cordis effect listeners. Select any architectural pillar below to explore its foundational decision records.',
    decisionNotesCount: 'Decision Notes',
    inspectPillar: 'Inspect',
    corePrinciples: 'Core Architectural Principles & Invariants',
    decisionRecordsInPillar: 'Architectural Decision Records in this Pillar',

    // Pillars names & descriptions
    pillarMicrokernelName: 'Microkernel & Cordis Event Taxonomy',
    pillarMicrokernelZh: '微内核与 Cordis 事件分类体系',
    pillarMicrokernelCategory: 'Core Engine',
    pillarMicrokernelDesc: 'Pure Cordis event taxonomy where everything is a plugin. Extension points feature typed dispatch modes: waterfall, serial, parallel, and emit.',
    pillarMicrokernelKey1: 'Waterfall around-middleware for pre-step & stream wrapping',
    pillarMicrokernelKey2: 'Serial checkpoint order for turn-stopping',
    pillarMicrokernelKey3: 'Parallel fan-out for session durability flush',
    pillarMicrokernelKey4: 'Defensive isolation of plugin exceptions',

    pillarInterfacesName: 'Dual Client Front-Doors (TUI & Web GUI)',
    pillarInterfacesZh: '双客户端前门（终端 TUI 与 Web GUI）',
    pillarInterfacesCategory: 'Presentation & ACP',
    pillarInterfacesDesc: 'Full parity between dedicated full-screen TUI and modern Web GUI, mediated by the ACP (Agent Client Protocol).',
    pillarInterfacesKey1: 'TUI: Responsive terminal state, slash commands, status prompt tools',
    pillarInterfacesKey2: 'Web: Incremental AST markdown renderer, docked goal bar, composer stack',
    pillarInterfacesKey3: 'ACP Protocol: Structured event stream & terminal tool rendering',

    pillarLlmName: 'LLM Adapters & Streaming Engine',
    pillarLlmZh: 'LLM 适配器与流式传输引擎',
    pillarLlmCategory: 'Model Inference',
    pillarLlmDesc: 'Provider-routed LLM adapters with native DeepSeek SSE eventsource parsing, dynamic credential boundaries, and retryable stream recovery.',
    pillarLlmKey1: 'DeepSeek native SSE stream parser with token rate calculation',
    pillarLlmKey2: 'Pi AI declared provider catalog & draft endpoint interrogation',
    pillarLlmKey3: 'Bounded request recovery & retry on empty completions',

    pillarTokenName: 'Token Management & Compaction Policy',
    pillarTokenZh: 'Token 管理与上下文压缩策略',
    pillarTokenCategory: 'Context Engine',
    pillarTokenDesc: 'Real-time projected token metering, compaction pressure triggers, prefix-cache preservation, and after-call recovery.',
    pillarTokenKey1: 'Replay token meter service & projected usage calculations',
    pillarTokenKey2: 'Compaction summary prefix cache reuse',
    pillarTokenKey3: 'English compaction checkpoints & overflow backstop',

    pillarSeamsName: 'Capability Seams & Sandboxing',
    pillarSeamsZh: '能力接缝与沙箱隔离',
    pillarSeamsCategory: 'Execution World',
    pillarSeamsDesc: 'Portable execution world with strictly isolated capability seams for filesystem, subprocesses, LSP, and background job execution.',
    pillarSeamsKey1: 'Filesystem Seam: per-session CWD, listing cache, DACL preservation',
    pillarSeamsKey2: 'Subprocess Seam: structured exit signals, stdin pipeline, timeout policy',
    pillarSeamsKey3: 'Packaged Ripgrep search & glob sampling discovery',

    pillarPersistenceName: 'Session Persistence & JSONL Write Coordinator',
    pillarPersistenceZh: '会话持久化与 JSONL 写入协调器',
    pillarPersistenceCategory: 'Storage & State',
    pillarPersistenceDesc: 'Event-sourced sessions with zstandard compressed JSONL logs, bounded batching, atomic durable publishers, and resume points.',
    pillarPersistenceKey1: 'Event-sourced session stream with durable UUIDs',
    pillarPersistenceKey2: 'Shared persistence write coordinator with batch queuing',
    pillarPersistenceKey3: 'Session restore pipeline & fork anchor floor verification',

    // Timeline View
    timelineTitle: 'Decision Timeline',
    totalMilestones: 'Total Milestones',
    allMonths: 'All Months',
    monthDecisions: 'Decisions',
    readNote: 'Read Note',

    // Spotlight Search Modal
    searchModalPlaceholder: 'Search decisions, microkernel, cordis, acp, token, seams...',
    matchesFound: 'Matches Found',
    searchingCorpus: 'Searching notes corpus...',
    noMatchesFor: 'No matching decisions found for',
    searchHintsText: 'Type keywords to search across titles, problems, decisions, and Chinese translations.',
    navHint: 'to navigate',
    openHint: 'to open',
    searchFooterBranding: 'DeepSeek Harness Decision Search',
    titleMatch: 'title match',
    contentMatch: 'content match',

    // Language switcher
    interfaceLanguage: 'Interface Language'
  },
  ru: {
    appTitle: 'DeepSeek Harness',
    appSubtitle: 'Архитектурные Заметки v1.0',
    appTagline: 'Реестр архитектурных решений (ADR), таксономия микроядра, протоколы ACP и системное проектирование',
    runtimeInfo: 'Среда исполнения: Node.js / микроядро Cordis',
    frontdoorsInfo: 'Двойной фронтенд: консольный TUI и Web GUI',
    footerSpecification: 'Спецификация репозитория .agents/notes',
    footerTitle: 'База архитектурных знаний DeepSeek Harness',

    // View Navigation
    navDecisions: 'Решения',
    navArchitecture: 'Карта архитектуры',
    navTimeline: 'Хронология',
    searchPlaceholder: 'Поиск по решениям (Ctrl+K или ⌘K)...',
    searchBtn: 'Поиск...',
    rescanRepo: 'Пересканировать базу заметок',

    // Stats
    totalDecisions: 'Всего решений',
    implementedRecords: 'Реализовано',
    archivedRecords: 'В архиве',
    bilingualRecords: 'Билингвальные (EN/ZH)',

    // Filter Bar
    allLifecycles: 'Все статусы',
    allCategories: 'Все категории',
    filterByTitlePlaceholder: 'Фильтр по названию, тегу, слагу...',
    sortNewestFirst: 'Сначала новые',
    sortOldestFirst: 'Сначала старые',
    sortTitleAZ: 'По названию (А-Я / A-Z)',
    categoryLabel: 'Категория:',
    pillarsLabel: 'Столпы системы:',
    showingDecisions: 'Отображается',
    decisionsCountLabel: 'решений',
    resetFilters: 'Сбросить фильтры',
    clearFilters: 'Очистить фильтры',
    noDecisionsMatch: 'Нет решений, соответствующих заданным критериям',
    noDecisionsDesc: 'Попробуйте изменить статус жизненного цикла, категорию или поисковый запрос.',

    // Categories
    catArchitecture: 'Архитектура',
    catFeature: 'Функциональность',
    catBugFix: 'Исправление ошибок',
    catSimplification: 'Упрощение',
    catProcess: 'Процессы',
    catTesting: 'Тестирование',

    // Lifecycles
    lifecycleImplemented: 'Реализовано',
    lifecycleArchived: 'Архив',
    lifecycleProposed: 'Предложено',
    lifecycleRejected: 'Отклонено',

    // Note Card
    readAction: 'Читать',
    crossReferences: 'перекрёстных ссылок',
    enZhAvailable: 'Доступно EN и ZH',

    // Note Reader
    closeEsc: 'Закрыть (Esc)',
    copyBtn: 'Копировать',
    copiedBtn: 'Скопировано',
    downloadBtn: 'Скачать',
    yamlMeta: 'Метаданные i18n и отчёт целостности (.i18n.yaml)',
    englishSource: 'Оригинал (English)',
    chineseTranslation: 'Китайский перевод (中文)',
    citedBy: 'Ссылки на это решение',
    outboundReferences: 'Исходящие ссылки и зависимости',
    noBacklinks: 'Нет прямых входящих ссылок на это решение.',
    noOutbound: 'В этом документе нет внешних ссылок на другие заметки.',
    prevNote: 'Назад',
    nextNote: 'Вперёд',
    loadingContent: 'Загрузка содержимого заметки...',
    tabEnglish: 'English',
    tabChinese: '中文',
    tabSideBySide: 'Параллельный вид (Side-by-Side)',

    // Architecture Map
    archBannerSubtitle: 'Системная топология и ключевые компоненты',
    archBannerTitle: 'Карта архитектуры DeepSeek Harness',
    archBannerDesc: 'Архитектура DeepSeek Harness основана на модульном событийно-ориентированном микроядре, где каждый функциональный слой изолирован за строгими интерфейсными швами (capability seams) и обработчиками Cordis. Выберите архитектурный столп ниже для детального анализа решений.',
    decisionNotesCount: 'Архитектурных решений',
    inspectPillar: 'Анализировать',
    corePrinciples: 'Фундаментальные принципы и системные инварианты',
    decisionRecordsInPillar: 'Архитектурные решения в этом модуле',

    // Pillars names & descriptions
    pillarMicrokernelName: 'Микроядро и таксономия событий Cordis',
    pillarMicrokernelZh: '微内核与 Cordis 事件分类体系',
    pillarMicrokernelCategory: 'Базовое ядро',
    pillarMicrokernelDesc: 'Чистая таксономия событий Cordis: всё оформлено как плагин. Точки расширения поддерживают типизированную диспетчеризацию: waterfall, serial, parallel и emit.',
    pillarMicrokernelKey1: 'Waterfall around-middleware для пре-шагов и оборачивания стримов',
    pillarMicrokernelKey2: 'Последовательный (serial) чекпоинт для гарантированной остановки хода (turn-stopping)',
    pillarMicrokernelKey3: 'Параллельная (parallel) диспетчеризация для надёжного сброса состояния сессии',
    pillarMicrokernelKey4: 'Защитная изоляция исключений плагинов без падения ядра',

    pillarInterfacesName: 'Двойной клиентский интерфейс (TUI и Web GUI)',
    pillarInterfacesZh: '双客户端前门（终端 TUI 与 Web GUI）',
    pillarInterfacesCategory: 'Слой представления и протокол ACP',
    pillarInterfacesDesc: 'Полный паритет возможностей между полноэкранным терминалом (TUI) и современным Web GUI через унифицированный протокол ACP (Agent Client Protocol).',
    pillarInterfacesKey1: 'TUI: Адаптивное состояние терминала, слэш-команды, контекстные подсказки',
    pillarInterfacesKey2: 'Web: Инкрементальный AST-рендер Markdown, закреплённый бар целей, стек композитора',
    pillarInterfacesKey3: 'Протокол ACP: Структурированный поток событий и рендеринг терминальных инструментов',

    pillarLlmName: 'Адаптеры LLM и потоковый движок (Streaming Engine)',
    pillarLlmZh: 'LLM 适配器与流式传输引擎',
    pillarLlmCategory: 'Инференс моделей',
    pillarLlmDesc: 'Маршрутизируемые адаптеры провайдеров с нативным парсингом SSE-потоков DeepSeek, динамическими границами аутентификации и надёжным перезапуском прерванных стримов.',
    pillarLlmKey1: 'Нативный SSE-парсер DeepSeek с онлайн-расчётом скорости токенов',
    pillarLlmKey2: 'Декларативный каталог провайдеров Pi AI и опрос черновых эндпоинтов',
    pillarLlmKey3: 'Ограниченное восстановление запросов и повторы при пустых ответах',

    pillarTokenName: 'Управление токенами и политика сжатия (Compaction)',
    pillarTokenZh: 'Token 管理与上下文压缩策略',
    pillarTokenCategory: 'Контекстный движок',
    pillarTokenDesc: 'Расчётное измерение расхода токенов в реальном времени, триггеры давления сжатия, сохранение кэша префиксов и восстановление после вызовов.',
    pillarTokenKey1: 'Сервис учёта токенов воспроизведения (Replay token meter) и прогноз использования',
    pillarTokenKey2: 'Повторное использование кэша префиксов для сводок сжатия контекста',
    pillarTokenKey3: 'Чекпоинты сжатия и защитные барьеры от переполнения контекстного окна',

    pillarSeamsName: 'Интерфейсные швы возможностей и песочницы (Capability Seams)',
    pillarSeamsZh: '能力接缝与沙箱隔离',
    pillarSeamsCategory: 'Среда исполнения',
    pillarSeamsDesc: 'Переносимая среда исполнения со строго изолированными швами возможностей для файловой системы, подпроцессов, LSP и фоновых задач.',
    pillarSeamsKey1: 'Файловый шов: изоляция рабочей директории (CWD), кэширование листингов, сохранение DACL',
    pillarSeamsKey2: 'Шов подпроцессов: структурированные сигналы завершения, конвейер stdin, тайм-аут политики',
    pillarSeamsKey3: 'Встроенный движок поиска Ripgrep и сэмплирование глоб-паттернов',

    pillarPersistenceName: 'Персистентность сессий и координатор записи JSONL',
    pillarPersistenceZh: '会话持久化与 JSONL 写入协调器',
    pillarPersistenceCategory: 'Хранение и состояние',
    pillarPersistenceDesc: 'Событийно-ориентированные сессии со сжатием JSONL через Zstandard, батчинг с ограниченной очередью, атомарная публикация и точки возобновления.',
    pillarPersistenceKey1: 'Поток сессий на основе Event Sourcing с постоянными UUID',
    pillarPersistenceKey2: 'Общий координатор записи с буферизацией и гарантией порядка',
    pillarPersistenceKey3: 'Конвейер восстановления сессий и верификация точек ветвления (fork anchors)',

    // Timeline View
    timelineTitle: 'Хронология архитектурных решений',
    totalMilestones: 'Всего контрольных точек',
    allMonths: 'Все месяцы',
    monthDecisions: 'Решений',
    readNote: 'Читать решение',

    // Spotlight Search Modal
    searchModalPlaceholder: 'Поиск по решениям, микроядру, cordis, acp, токенам, швам...',
    matchesFound: 'Найдено совпадений',
    searchingCorpus: 'Поиск по корпусу архитектурных решений...',
    noMatchesFor: 'Не найдено решений по запросу',
    searchHintsText: 'Введите ключевые слова для поиска по заголовкам, проблемам, решениям и китайским переводам.',
    navHint: 'навигация',
    openHint: 'открыть',
    searchFooterBranding: 'Поисковый движок DeepSeek Harness',
    titleMatch: 'в заголовке',
    contentMatch: 'в тексте',

    // Language switcher
    interfaceLanguage: 'Язык интерфейса'
  }
};
