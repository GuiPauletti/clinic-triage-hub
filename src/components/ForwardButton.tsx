import { useState, useRef, useEffect } from 'react';
import { UserCheck } from 'lucide-react';

interface ForwardButtonProps {
  itemId: string;
  currentResponsible?: string;
  onSuccess?: (responsavel: string) => void;
}

const RESPONSAVEIS = ['Dr Guilherme', 'Karla', 'Jodele', 'Carlise', 'Rafael'];
const WEBHOOK_URL = 'https://consultoriooftalmogui.app.n8n.cloud/webhook/triagem/assign?key=Gui@oftalmoSul2026';

export function ForwardButton({ itemId, currentResponsible, onSuccess }: ForwardButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = async (responsavel: string) => {
    setOpen(false);
    setLoading(true);
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemId, responsavel }),
      });
      if (!res.ok) throw new Error('Erro ao encaminhar');
      setSent(responsavel);
      onSuccess?.(responsavel);
      setTimeout(() => setSent(null), 2000);
    } catch (error) {
      console.error('Erro ao encaminhar:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={loading}
        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
          sent ? 'bg-blue-100 text-blue-700' : 'text-muted-foreground hover:text-blue-600 hover:bg-blue-50'
        } disabled:opacity-50`}
        title="Encaminhar para responsável"
      >
        <UserCheck size={14} />
        <span>{sent ? `→ ${sent}` : 'Encaminhar'}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-white border border-border rounded-lg shadow-lg py-1 min-w-[150px]">
          {RESPONSAVEIS.map((r) => (
            <button
              key={r}
              onClick={() => handleSelect(r)}
              className={`w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors ${
                r === currentResponsible ? 'font-semibold text-primary' : ''
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
