import { useState } from 'react';
import { Check } from 'lucide-react';

interface RespondedButtonProps {
  itemId: string;
  onSuccess: () => void;
}

const WEBHOOK_URL = 'https://consultoriooftalmogui.app.n8n.cloud/webhook/triagem/update?key=Gui@oftalmoSul2026';

export function RespondedButton({ itemId, onSuccess }: RespondedButtonProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleClick = async () => {
    if (loading || success) return;
    setLoading(true);
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: itemId,
          data_ultima_msg_responsavel: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error('Erro ao enviar');
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSuccess();
      }, 2000);
    } catch (error) {
      console.error('Erro ao marcar resposta:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
        success
          ? 'bg-status-finalizado text-status-finalizado-text'
          : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
      } disabled:opacity-50`}
      title="Marcar como respondido"
    >
      <Check size={14} />
      <span>{success ? 'Enviado!' : 'Respondeu ✓'}</span>
    </button>
  );
}
