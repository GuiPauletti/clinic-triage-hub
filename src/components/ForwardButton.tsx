import { useState } from 'react';
import { UserCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ForwardButtonProps {
  itemId: string;
  onSuccess?: (responsavel: string) => void;
}

const WEBHOOK_URL = 'https://consultoriooftalmogui.app.n8n.cloud/webhook/triagem/assign?key=Gui@oftalmoSul2026';

export function ForwardButton({ itemId, onSuccess }: ForwardButtonProps) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleAssume = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemId, responsavel: currentUser }),
      });
      if (!res.ok) throw new Error('Erro ao assumir');
      setSent(true);
      onSuccess?.(currentUser);
      setTimeout(() => setSent(false), 2000);
    } catch (error) {
      console.error('Erro ao assumir:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAssume}
      disabled={loading}
      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
        sent ? 'bg-green-100 text-green-700' : 'text-muted-foreground hover:text-blue-600 hover:bg-blue-50'
      } disabled:opacity-50`}
      title={`Assumir como ${currentUser}`}
    >
      <UserCheck size={14} />
      <span>{sent ? `✓ ${currentUser}` : 'Assumir'}</span>
    </button>
  );
}
