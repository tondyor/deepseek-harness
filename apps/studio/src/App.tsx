import { useMemo, useState } from 'react';
import { useStudio, store } from './store';
import { CATALOG } from './catalog';
import { serializeYaml } from './serialize';
import CatalogPanel from './components/CatalogPanel';
import CompositionPanel from './components/CompositionPanel';
import InspectorPanel from './components/InspectorPanel';
import YamlModal from './components/YamlModal';

export default function App() {
  const state = useStudio();
  const [showYaml, setShowYaml] = useState(false);
  const [copied, setCopied] = useState(false);

  const yaml = useMemo(
    () => serializeYaml(state.rows, state.customs),
    [state.rows, state.customs],
  );

  const enabledCount = useMemo(
    () => CATALOG.filter((p) => state.rows[p.id]?.enabled).length,
    [state.rows],
  );

  async function copy() {
    try {
      await navigator.clipboard.writeText(yaml);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setShowYaml(true);
    }
  }

  function download() {
    const blob = new Blob([yaml], { type: 'application/x-yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.profileName || 'harness'}.cordis.yml`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="logo">DS</span>
          <span className="btitle">DeepSeek Harness Studio</span>
        </div>
        <input
          className="profile-input"
          value={state.profileName}
          onChange={(e) => store.setProfileName(e.target.value)}
          placeholder="имя профиля"
          title="Имя профиля (dsh.profile)"
        />
        <div className="meter">
          <span className="meter-n">{enabledCount}</span> плагинов
        </div>
        <div className="actions">
          <button className="btn" onClick={() => store.reset()} title="Сбросить к дефолту">
            Сброс
          </button>
          <button className="btn" onClick={() => setShowYaml(true)}>
            YAML
          </button>
          <button className="btn" onClick={copy}>
            {copied ? 'Скопировано ✓' : 'Копировать'}
          </button>
          <button className="btn primary" onClick={download}>
            Скачать .cordis.yml
          </button>
        </div>
      </header>

      <div className="three">
        <CatalogPanel />
        <CompositionPanel />
        <InspectorPanel />
      </div>

      {showYaml && (
        <YamlModal yaml={yaml} onCopy={copy} onDownload={download} onClose={() => setShowYaml(false)} />
      )}
    </div>
  );
}