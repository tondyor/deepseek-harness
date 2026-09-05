export default function YamlModal({
  yaml,
  onCopy,
  onDownload,
  onClose,
}: {
  yaml: string;
  onCopy: () => void;
  onDownload: () => void;
  onClose: () => void;
}) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>cordis.patch.yml</h3>
          <div className="actions">
            <button className="btn" onClick={onCopy}>
              Копировать
            </button>
            <button className="btn primary" onClick={onDownload}>
              Скачать
            </button>
            <button className="btn ghost" onClick={onClose}>
              Закрыть
            </button>
          </div>
        </div>
        <pre className="yaml-view">{yaml}</pre>
      </div>
    </div>
  );
}