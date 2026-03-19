import { useState } from 'react';

interface ObservationCellProps {
  itemId: string;
  initialValue?: string;
}

const WEBHOOK_URL = 'https://consultoriooftalmogui.app.n8n.cloud/webhook/triagem/update?key=Gui@oftalmoSul2026';

export function ObservationCell({ itemId, initialValue = '' }: ObservationCellProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setEditing(false);
    if (value === initialValue) return;
    setSaving(true);
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemId, observacao_interna: value }),
      });
    } catch (error) {
      console.error('Erro ao salvar observação:', error);
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <textarea
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSave(); }
          if (e.key === 'Escape') setEditing(false);
        }}
        className="w-full min-w-[160px] text-xs border border-primary/40 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
        rows={2}
      />
    );
  }

  return (
    <div
      onClick={() => setEditing(true)}
      className={`min-w-[160px] text-xs cursor-pointer px-2 py-1 rounded hover:bg-muted/50 transition-colors ${
        saving ? 'opacity-50' : ''
      } ${value ? 'text-foreground' : 'text-muted-foreground italic'}`}
      title="Clique para editar"
    >
      {saving ? 'Salvando...' : value || 'Adicionar obs...'}
    </div>
  );
}
